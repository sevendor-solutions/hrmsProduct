import { useState, useEffect } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import { CalendarCheck, CalendarX, Clock, AlertCircle, Plus, Search, Check, X, ShieldAlert } from 'lucide-react';
import type { LeaveRequest } from '../types';

const STATUS_BADGE: Record<string, string> = {
  Approved: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
  Cancelled: 'badge-gray',
};

const emptyForm = { empId: '', empName: '', type: 'Annual' as LeaveRequest['type'], from: '', to: '', days: 1, reason: '' };

export default function LeaveManagement() {
  const { leaves, addLeaveRequest, updateLeaveStatus, pendingLeaves, employees, user } = useHrms();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { icon: <CalendarCheck size={22} />, label: 'Total Leaves', value: leaves.length, color: 'emerald' },
    { icon: <CalendarX size={22} />, label: 'Pending Approvals', value: pendingLeaves, color: 'rose' },
    { icon: <Clock size={22} />, label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length, color: 'blue' },
    { icon: <AlertCircle size={22} />, label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length, color: 'amber' },
  ];

  const filtered = leaves.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.empName.toLowerCase().includes(q) || l.empId.toLowerCase().includes(q) || l.reason.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleAdd = () => {
    let emp = null;
    if (user?.role === 'admin') {
      emp = employees.find(e => e.id === form.empId);
      if (!emp) {
        setFormError('Please select a valid employee.');
        return;
      }
    } else {
      emp = employees.find(e => e.id === user?.empId) || { id: 'EMP001', name: 'Arjun Sharma' };
    }

    if (!form.from || !form.to || !form.reason) {
      setFormError('All fields are required.');
      return;
    }

    const d1 = new Date(form.from);
    const d2 = new Date(form.to);
    if (d2 < d1) {
      setFormError('To date cannot be earlier than From date.');
      return;
    }

    const calculatedDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    addLeaveRequest({
      empId: emp.id,
      empName: emp.name,
      type: form.type,
      from: form.from,
      to: form.to,
      days: calculatedDays,
      reason: form.reason
    });

    setShowAdd(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleApprove = (id: string) => {
    updateLeaveStatus(id, 'Approved', user?.name || 'Administrator');
  };

  const handleReject = (id: string) => {
    updateLeaveStatus(id, 'Rejected', user?.name || 'Administrator');
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Leave Management</h1>
          <p>Track employee time off, leave request balances, and pending approvals.</p>
        </div>
        <button onClick={() => { setForm({ ...emptyForm, empId: user?.empId || '' }); setFormError(''); setShowAdd(true); }} className="btn-primary self-start sm:self-auto">
          <Plus size={16} /> Request Leave
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map(s => <StatCard key={s.label} {...s} />)
        }
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search by name, ID or reason..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Types</option>
          <option value="Annual">Annual Leave</option>
          <option value="Sick">Sick Leave</option>
          <option value="Casual">Casual Leave</option>
          <option value="Maternity">Maternity Leave</option>
          <option value="Paternity">Paternity Leave</option>
          <option value="Unpaid">Unpaid Leave</option>
        </select>
      </div>

      {/* Requests table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                {user?.role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={<ShieldAlert size={28} />} title="No leave requests found" description="Try selecting different filter settings." />
                  </td>
                </tr>
              ) : filtered.map(leave => (
                <tr key={leave.id}>
                  <td className="font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <p className="text-sm">{leave.empName}</p>
                      <p className="text-xs text-slate-400">{leave.empId}</p>
                    </div>
                  </td>
                  <td><span className="badge badge-purple">{leave.type}</span></td>
                  <td className="text-slate-500 text-xs">{leave.from} to {leave.to}</td>
                  <td className="text-slate-700 dark:text-slate-300 font-semibold">{leave.days} {leave.days === 1 ? 'day' : 'days'}</td>
                  <td className="text-slate-500 max-w-xs truncate">{leave.reason}</td>
                  <td><span className={`badge ${STATUS_BADGE[leave.status]}`}>{leave.status}</span></td>
                  {user?.role === 'admin' && (
                    <td>
                      {leave.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(leave.id)} className="p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleReject(leave.id)} className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-colors" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">By {leave.approvedBy || 'Admin'}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Apply for Leave" size="md">
        <div className="space-y-4">
          {formError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{formError}</div>}

          {user?.role === 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Select Employee *</label>
              <select className="input-field" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })}>
                <option value="">-- Select Employee --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Leave Type *</label>
            <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as LeaveRequest['type'] })}>
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Paternity">Paternity Leave</option>
              <option value="Unpaid">Unpaid (LOP)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">From *</label>
              <input className="input-field" type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">To *</label>
              <input className="input-field" type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Reason for Leave *</label>
            <textarea rows={3} className="input-field resize-none" placeholder="Explain the reason for time off request..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="btn-primary">Submit Application</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
