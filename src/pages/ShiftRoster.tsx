import { useHrms } from '../context/HrmsContext';
import { Clock4, Sun, Sunset, Moon, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ShiftRoster, ShiftSlot } from '../types';
import type { ReactNode } from 'react';

const SHIFT_CONFIG: Record<string, { icon: ReactNode; color: string; bg: string }> = {
  Morning: { icon: <Sun size={14} />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  Evening: { icon: <Sunset size={14} />, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  Night: { icon: <Moon size={14} />, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  Off: { icon: <Coffee size={14} />, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-700' },
};

function ShiftBadge({ shift }: { shift: ShiftSlot['shift'] }) {
  const cfg = SHIFT_CONFIG[shift];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.icon} {shift}
    </span>
  );
}

function RosterCard({ roster }: { roster: ShiftRoster }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{roster.department}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roster.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
              {roster.status === 'Published' ? <><CheckCircle2 size={12} className="inline mr-1" />Published</> : <><AlertCircle size={12} className="inline mr-1" />Draft</>}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Week: {roster.week}</p>
          <p className="text-xs text-slate-400 mt-0.5">By {roster.publishedBy} · {roster.publishedOn}</p>
        </div>
        <div className="flex gap-3 text-sm text-slate-400">
          <span>{roster.slots.length} employees</span>
          <span>·</span>
          <span>{roster.slots.filter(s => s.shift !== 'Off').length} working</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {['Employee', 'Department', 'Shift', 'Start', 'End'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {roster.slots.map(slot => (
              <tr key={slot.empId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {slot.empName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{slot.empName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{slot.department}</td>
                <td className="px-4 py-3"><ShiftBadge shift={slot.shift} /></td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">{slot.startTime}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">{slot.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ShiftRoster() {
  const { shifts } = useHrms();

  const published = shifts.filter(s => s.status === 'Published');
  const drafts = shifts.filter(s => s.status === 'Draft');
  const totalEmployees = [...new Set(shifts.flatMap(s => s.slots.map(sl => sl.empId)))].length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock4 className="text-violet-500" size={26} /> Shift Roster
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage weekly shift schedules across departments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rosters', value: shifts.length, color: 'text-violet-500' },
          { label: 'Published', value: published.length, color: 'text-emerald-500' },
          { label: 'Drafts', value: drafts.length, color: 'text-amber-500' },
          { label: 'Employees Rostered', value: totalEmployees, color: 'text-blue-500' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Shift Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(SHIFT_CONFIG).map(([name, cfg]) => (
          <div key={name} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
            {cfg.icon} {name}
          </div>
        ))}
      </div>

      {/* Rosters */}
      {published.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Published Rosters</h2>
          <div className="space-y-4">{published.map(r => <RosterCard key={r.id} roster={r} />)}</div>
        </div>
      )}
      {drafts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Drafts</h2>
          <div className="space-y-4">{drafts.map(r => <RosterCard key={r.id} roster={r} />)}</div>
        </div>
      )}
    </div>
  );
}
