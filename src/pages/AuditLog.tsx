import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { ShieldCheck, Search, Download } from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
  'User Login': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'User Logout': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  'Employee Added': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Employee Updated': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Employee Deleted': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Leave Approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Leave Request': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Leave Status': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'User Created': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'User Deleted': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Role Changed': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Policy Published': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Payroll Processed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Check In': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Check Out': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  'Asset Added': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Performance Submitted': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Expense Approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export default function AuditLog() {
  const { auditLogs } = useHrms();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const uniqueActions = ['All', ...new Set(auditLogs.map(l => l.action))].sort();

  const filtered = auditLogs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.user.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.action.toLowerCase().includes(q);
    const matchAction = actionFilter === 'All' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const exportCsv = () => {
    const csv = ['Timestamp,User,Action,Details', ...filtered.map(l =>
      `"${l.timestamp}","${l.user}","${l.action}","${l.details}"`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit_log.csv'; a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-violet-500" size={26} /> Audit Log
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete record of all system actions and user activities</p>
        </div>
        <button onClick={exportCsv} className="btn-secondary flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Events', value: auditLogs.length, color: 'text-violet-500' },
          { label: 'Showing', value: filtered.length, color: 'text-blue-500' },
          { label: 'Unique Users', value: new Set(auditLogs.map(l => l.user)).size, color: 'text-emerald-500' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-9 input-field"
            placeholder="Search logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-48" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Log Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {['Timestamp', 'User', 'Action', 'Details'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {log.user === 'System' ? 'S' : log.user.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${ACTION_COLORS[log.action] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No log entries match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
