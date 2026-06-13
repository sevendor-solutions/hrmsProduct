import { useHrms } from '../context/HrmsContext';
import { LogOut as LogOutIcon, CheckCircle2, Clock, AlertCircle, Building2, FileCheck, CheckCheck } from 'lucide-react';
import type { OffboardingClearance } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Initiated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const REASON_COLORS: Record<string, string> = {
  Resignation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Retirement: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Termination: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Contract End': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

const CLEARANCE_DEPTS: (keyof OffboardingClearance['clearanceStatus'])[] = ['IT', 'Finance', 'HR', 'Admin', 'Manager'];

function OffboardingCard({ o, onClearanceUpdate, onStatusUpdate }: {
  o: OffboardingClearance;
  onClearanceUpdate: (id: string, dept: keyof OffboardingClearance['clearanceStatus'], status: 'Approved' | 'Pending') => void;
  onStatusUpdate: (id: string, status: OffboardingClearance['status']) => void;
}) {
  const allCleared = CLEARANCE_DEPTS.every(d => o.clearanceStatus[d] === 'Approved');
  const clearedCount = CLEARANCE_DEPTS.filter(d => o.clearanceStatus[d] === 'Approved').length;

  return (
    <div className="card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {o.empName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{o.empName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{o.designation} · {o.department}</p>
            <p className="text-xs text-slate-400 mt-0.5">Last Working Day: <span className="font-semibold text-slate-600 dark:text-slate-300">{o.lastWorkingDay}</span></p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{o.status}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${REASON_COLORS[o.reason]}`}>{o.reason}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Clearance Progress</span>
          <span className="font-semibold">{clearedCount}/{CLEARANCE_DEPTS.length} cleared</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all" style={{ width: `${(clearedCount / CLEARANCE_DEPTS.length) * 100}%` }} />
        </div>
      </div>

      {/* Clearance Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CLEARANCE_DEPTS.map(dept => {
          const approved = o.clearanceStatus[dept] === 'Approved';
          return (
            <button
              key={dept}
              onClick={() => onClearanceUpdate(o.id, dept, approved ? 'Pending' : 'Approved')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                approved
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600'
              }`}
            >
              {approved ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Clock size={20} className="text-slate-400" />}
              <span className={`text-xs font-semibold ${approved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>{dept}</span>
              <span className="text-xs">{approved ? 'Cleared' : 'Pending'}</span>
            </button>
          );
        })}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Exit Interview', done: o.exitInterviewDone },
          { label: 'No-Due Certificate', done: o.noDueCertificate },
        ].map(item => (
          <div key={item.label} className={`flex items-center gap-2 px-4 py-3 rounded-xl ${item.done ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
            {item.done ? <CheckCheck size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-slate-400" />}
            <span className={`text-sm font-medium ${item.done ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {o.status !== 'Completed' && o.status !== 'Cancelled' && allCleared && (
        <button
          onClick={() => onStatusUpdate(o.id, 'Completed')}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <FileCheck size={18} /> Mark as Completed & Issue NDC
        </button>
      )}
    </div>
  );
}

export default function Offboarding() {
  const { offboardings, updateOffboardingStatus, updateClearanceItem } = useHrms();

  const initiated = offboardings.filter(o => o.status === 'Initiated').length;
  const inProgress = offboardings.filter(o => o.status === 'In Progress').length;
  const completed = offboardings.filter(o => o.status === 'Completed').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LogOutIcon className="text-violet-500" size={26} /> Offboarding
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage employee exits, clearances, and no-due certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: offboardings.length, color: 'text-violet-500' },
          { label: 'Initiated', value: initiated, color: 'text-blue-500' },
          { label: 'In Progress', value: inProgress, color: 'text-amber-500' },
          { label: 'Completed', value: completed, color: 'text-emerald-500' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700/50 p-4 flex gap-3">
        <Building2 size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700 dark:text-amber-300">
          <span className="font-semibold">Clearance Process:</span> Click on each department clearance card to toggle between Pending/Approved status. Once all 5 departments are cleared, you can generate the No-Due Certificate.
        </div>
      </div>

      {/* Offboarding Cards */}
      <div className="space-y-5">
        {offboardings.map(o => (
          <OffboardingCard
            key={o.id}
            o={o}
            onClearanceUpdate={updateClearanceItem}
            onStatusUpdate={updateOffboardingStatus}
          />
        ))}
        {offboardings.length === 0 && (
          <div className="card p-16 text-center text-slate-400">
            <LogOutIcon size={48} className="mx-auto mb-4 opacity-30" />
            <p>No active offboarding cases</p>
          </div>
        )}
      </div>
    </div>
  );
}
