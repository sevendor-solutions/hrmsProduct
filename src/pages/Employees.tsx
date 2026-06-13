import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Search, Plus, Edit2, Trash2, Eye, Phone, Mail, MapPin, Users, Filter } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

const statusBadge = (status: string) => {
  const map: Record<string, string> = { Active: 'badge-green', Inactive: 'badge-red', 'On Leave': 'badge-yellow' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

const avatarColors = ['from-violet-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600', 'from-blue-500 to-cyan-600', 'from-fuchsia-500 to-purple-600'];

import type { Employee } from '../types';

const emptyForm: Omit<Employee, 'id' | 'status' | 'avatar'> = { name: '', department: 'Engineering', designation: '', email: '', phone: '', location: '', salary: 0, joinDate: '', gender: 'Male', dob: '', address: '', manager: '', skills: [] };

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHrms();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<Employee | null>(null);
  const [showView, setShowView] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, 'id' | 'status' | 'avatar'> | Employee>(emptyForm);
  const [formError, setFormError] = useState('');

  const filtered = employees
    .filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q);
      const matchDept = deptFilter === 'All' || e.department === deptFilter;
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => ((a as any)[sortBy] || '')?.toString().localeCompare(((b as any)[sortBy] || '')?.toString()));

  const handleAdd = () => {
    if (!form.name || !form.email || !form.designation) { setFormError('Name, Email, and Designation are required.'); return; }
    addEmployee(form);
    setShowAdd(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleEdit = () => {
    if (!form.name || !form.email) { setFormError('Name and Email are required.'); return; }
    if (showEdit?.id) {
      updateEmployee(showEdit.id, form);
    }
    setShowEdit(null);
    setFormError('');
  };

  const openEdit = (emp: Employee) => { setShowEdit(emp); setForm({ ...emp }); setFormError(''); };
  const openAdd = () => { setShowAdd(true); setForm(emptyForm); setFormError(''); };

  return (
    <div className="space-y-5">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Employees</h1>
          <p>Manage your workforce — {employees.filter(e => e.status === 'Active').length} active of {employees.length} total</p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start sm:self-auto">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search by name, email, ID..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field w-auto">
          <option>All</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>On Leave</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-auto">
          <option value="name">Sort: Name</option>
          <option value="department">Sort: Dept</option>
          <option value="joinDate">Sort: Join Date</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th className="hidden md:table-cell">Email</th>
                <th className="hidden lg:table-cell">Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={<Users size={28} />} title="No employees found" description="Try adjusting your search or filters." /></td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarColors[(emp.name.charCodeAt(0) || 0) % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-purple">{emp.department}</span></td>
                  <td className="text-slate-600 dark:text-slate-400">{emp.designation}</td>
                  <td className="hidden md:table-cell text-slate-500 text-xs">{emp.email}</td>
                  <td className="hidden lg:table-cell text-slate-500 text-xs">{emp.location}</td>
                  <td>{statusBadge(emp.status)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowView(emp)} className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 text-slate-500 hover:text-violet-600 transition-colors"><Eye size={14} /></button>
                      <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-500 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Employee" size="lg">
        <EmployeeForm form={form} setForm={setForm} error={formError} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel="Add Employee" />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Employee" size="lg">
        <EmployeeForm form={form} setForm={setForm} error={formError} onSubmit={handleEdit} onCancel={() => setShowEdit(null)} submitLabel="Save Changes" />
      </Modal>

      {/* View Employee Modal */}
      {showView && (
        <Modal isOpen={!!showView} onClose={() => setShowView(null)} title="Employee Profile" size="md">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[(showView.name.charCodeAt(0) || 0) % avatarColors.length]} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {showView.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showView.name}</h3>
                <p className="text-sm text-slate-500">{showView.designation}</p>
                {statusBadge(showView.status)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: <Mail size={14} />, label: 'Email', val: showView.email },
                { icon: <Phone size={14} />, label: 'Phone', val: showView.phone },
                { icon: <MapPin size={14} />, label: 'Location', val: showView.location },
                { icon: <Users size={14} />, label: 'Department', val: showView.department },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-violet-500">{icon}</span>
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{val}</p>
                  </div>
                </div>
              ))}
            </div>
            {showView.skills?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {showView.skills.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-400">Join Date</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{showView.joinDate}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-400">Manager</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{showView.manager || '—'}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function EmployeeForm({ form, setForm, error, onSubmit, onCancel, submitLabel }: { form: any, setForm: any, error: string, onSubmit: () => void, onCancel: () => void, submitLabel: string }) {
  const f = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }));
  return (
    <div className="space-y-4">
      {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name *</label>
          <input className="input-field" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Arjun Sharma" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Email *</label>
          <input className="input-field" type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="arjun@sevendor.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
          <select className="input-field" value={form.department} onChange={e => f('department', e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Designation *</label>
          <input className="input-field" value={form.designation} onChange={e => f('designation', e.target.value)} placeholder="Software Engineer" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
          <input className="input-field" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
          <input className="input-field" value={form.location} onChange={e => f('location', e.target.value)} placeholder="Bangalore" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Salary (₹/month)</label>
          <input className="input-field" type="number" value={form.salary} onChange={e => f('salary', e.target.value)} placeholder="85000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Join Date</label>
          <input className="input-field" type="date" value={form.joinDate} onChange={e => f('joinDate', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
          <select className="input-field" value={form.gender} onChange={e => f('gender', e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth</label>
          <input className="input-field" type="date" value={form.dob} onChange={e => f('dob', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Address</label>
          <input className="input-field" value={form.address} onChange={e => f('address', e.target.value)} placeholder="12 MG Road, Bangalore 560001" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onSubmit} className="btn-primary">{submitLabel}</button>
        <button onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </div>
  );
}
