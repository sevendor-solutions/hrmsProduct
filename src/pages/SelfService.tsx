import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import { User, LogIn, LogOut, CalendarPlus, Download, Award, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function SelfService() {
  const { user, employees, attendance, checkIn, checkOut, leaves, addLeaveRequest, payroll, training } = useHrms();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Annual' as const, from: '', to: '', reason: '' });
  const [leaveError, setLeaveError] = useState('');

  // Default to EMP001 (Arjun Sharma) if not signed in or admin
  const empId = user?.empId || 'EMP001';
  const me = employees.find(e => e.id === empId) || employees[0];

  // Attendance Punch status
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.empId === empId && a.date === todayStr);

  // My Leave requests
  const myLeaves = leaves.filter(l => l.empId === empId);

  // My Payslips
  const myPayslips = payroll.filter(p => p.empId === empId);

  // My Trainings
  const myTrainings = training.filter(t => t.enrolled > 0); // Mock active enrolled list

  const handleApplyLeave = () => {
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason) {
      setLeaveError('Please enter all dates and details.');
      return;
    }
    const d1 = new Date(leaveForm.from);
    const d2 = new Date(leaveForm.to);
    if (d2 < d1) {
      setLeaveError('To date cannot be earlier than From date.');
      return;
    }
    const days = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    addLeaveRequest({
      empId: me.id,
      empName: me.name,
      type: leaveForm.type,
      from: leaveForm.from,
      to: leaveForm.to,
      days,
      reason: leaveForm.reason
    });

    setShowLeaveModal(false);
    setLeaveForm({ type: 'Annual', from: '', to: '', reason: '' });
    setLeaveError('');
    alert('Leave request submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1>Employee Self-Service</h1>
        <p>Manage your daily punches, check time-off balances, request leaves, and download payslips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Panel */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
              {me.avatar || 'ME'}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">{me.name}</h3>
              <p className="text-xs text-slate-400">{me.designation} • {me.id}</p>
              <span className="badge badge-green text-[10px] py-0.5 px-2 mt-1 inline-block">Active Employee</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-violet-500" />
              <span>{me.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-violet-500" />
              <span>{me.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-violet-500" />
              <span>{me.location}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] text-slate-400">REPORTING MANAGER</p>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{me.manager || 'Rahul Mehta'}</p>
            </div>
          </div>
        </div>

        {/* Punch Board & Leave Request Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Punch board */}
          <div className="glass-card p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Time Tracker</h3>
              <p className="text-xs text-slate-400 mb-4">Punch in to mark attendance or punch out to end the shift.</p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => checkIn(me.id)}
                  disabled={!!todayRecord}
                  className="flex-1 btn-success text-xs py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <LogIn size={14} /> Punch In
                </button>
                <button
                  onClick={() => checkOut(me.id)}
                  disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
                  className="flex-1 btn-danger text-xs py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <LogOut size={14} /> Punch Out
                </button>
              </div>

              {todayRecord && (
                <div className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/30 text-xs">
                  <span className="text-slate-400">Punch Status Today:</span>{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {todayRecord.checkIn} {todayRecord.checkOut ? `to ${todayRecord.checkOut}` : '(Active)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Time Off Balance card */}
          <div className="glass-card p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Leave Balance</h3>
              <p className="text-xs text-slate-400 mb-4">Request leaves or view pending requests.</p>
            </div>
            <div className="flex justify-around text-center mb-4">
              <div>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">13</p>
                <p className="text-[10px] text-slate-400 uppercase">Annual</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">11</p>
                <p className="text-[10px] text-slate-400 uppercase">Sick</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">4</p>
                <p className="text-[10px] text-slate-400 uppercase">Casual</p>
              </div>
            </div>
            <button
              onClick={() => { setLeaveError(''); setShowLeaveModal(true); }}
              className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <CalendarPlus size={14} /> Submit Leave Request
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payslips grid */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 border-b pb-2">My Salary Slip History</h3>
          <div className="space-y-2.5">
            {myPayslips.map((slip, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-xs">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{slip.month}</p>
                  <p className="text-slate-400">Net payout: ₹{slip.netSalary.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => alert(`Downloading payslip for ${slip.month}...`)}
                  className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-semibold hover:underline"
                >
                  <Download size={13} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Enrolled Trainings */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 border-b pb-2">Ongoing Learning Programs</h3>
          <div className="space-y-2.5">
            {myTrainings.map((trn, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{trn.title}</p>
                  <p className="text-slate-400">Duration: {trn.duration} • Mode: {trn.mode}</p>
                </div>
                <span className="badge badge-purple flex items-center gap-1">
                  <Award size={11} /> Enrolled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="Request Leave Time-Off" size="md">
        <div className="space-y-4">
          {leaveError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{leaveError}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Leave Type</label>
            <select className="input-field" value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value as any })}>
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date *</label>
              <input className="input-field" type="date" value={leaveForm.from} onChange={e => setLeaveForm({ ...leaveForm, from: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">End Date *</label>
              <input className="input-field" type="date" value={leaveForm.to} onChange={e => setLeaveForm({ ...leaveForm, to: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Reason for Request *</label>
            <textarea rows={3} className="input-field resize-none" placeholder="Provide a brief explanation for leave..." value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleApplyLeave} className="btn-primary">Submit Leave Request</button>
            <button onClick={() => setShowLeaveModal(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
