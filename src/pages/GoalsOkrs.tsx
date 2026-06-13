import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { Target, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Users, Building2, User } from 'lucide-react';
import type { GoalOkr, KeyResult } from '../types';
import type { ReactNode } from 'react';

const STATUS_COLORS: Record<string, string> = {
  'On Track': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'At Risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Behind': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Completed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Active': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Draft': 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

const TYPE_ICONS: Record<string, ReactNode> = {
  Company: <Building2 size={16} />,
  Department: <Users size={16} />,
  Individual: <User size={16} />,
};

const KR_STATUS_ICON: Record<string, ReactNode> = {
  'On Track': <TrendingUp size={14} className="text-emerald-500" />,
  'At Risk': <Minus size={14} className="text-amber-500" />,
  'Behind': <TrendingDown size={14} className="text-red-500" />,
  'Completed': <TrendingUp size={14} className="text-blue-500" />,
};

function ProgressRing({ pct, size = 56, color = '#8b5cf6' }: { pct: number; size?: number; color?: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={4} className="text-slate-200 dark:text-slate-700" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
    </svg>
  );
}

function KeyResultRow({ kr }: { kr: KeyResult }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-shrink-0">{KR_STATUS_ICON[kr.status]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{kr.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" style={{ width: `${kr.progress}%` }} />
          </div>
          <span className="text-xs text-slate-400 shrink-0">{kr.current}/{kr.target} {kr.unit}</span>
        </div>
      </div>
      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[kr.status]}`}>{kr.status}</span>
    </div>
  );
}

function OkrCard({ okr }: { okr: GoalOkr }) {
  const [expanded, setExpanded] = useState(false);
  const ringColor = okr.status === 'At Risk' ? '#f59e0b' : okr.status === 'Completed' ? '#3b82f6' : '#8b5cf6';

  return (
    <div className="card p-5 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <ProgressRing pct={okr.progress} color={ringColor} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white">{okr.progress}%</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-400">{TYPE_ICONS[okr.type]}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">{okr.type}</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{okr.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{okr.owner} · {okr.ownerDept} · {okr.quarter} {okr.year}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[okr.status]}`}>{okr.status}</span>
              <span className="text-xs text-slate-400">Due {okr.dueDate}</span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 mt-3 font-medium"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {okr.keyResults.length} Key Results
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 pl-16 space-y-1">
          {okr.keyResults.map(kr => <KeyResultRow key={kr.id} kr={kr} />)}
        </div>
      )}
    </div>
  );
}

export default function GoalsOkrs() {
  const { okrs } = useHrms();
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const types = ['All', 'Company', 'Department', 'Individual'];
  const statuses = ['All', 'Active', 'At Risk', 'Completed', 'Draft'];

  const filtered = okrs.filter(o => {
    const matchType = typeFilter === 'All' || o.type === typeFilter;
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchType && matchStatus;
  });

  const avgProgress = Math.round(okrs.reduce((acc, o) => acc + o.progress, 0) / okrs.length);
  const onTrack = okrs.filter(o => o.status === 'Active').length;
  const atRisk = okrs.filter(o => o.status === 'At Risk').length;
  const totalKRs = okrs.reduce((acc, o) => acc + o.keyResults.length, 0);
  const completedKRs = okrs.reduce((acc, o) => acc + o.keyResults.filter(kr => kr.status === 'Completed').length, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="text-violet-500" size={26} /> Goals & OKRs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track objectives and key results across the organization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Progress', value: `${avgProgress}%`, sub: 'across all OKRs', color: 'text-violet-500' },
          { label: 'On Track', value: onTrack, sub: 'objectives active', color: 'text-emerald-500' },
          { label: 'At Risk', value: atRisk, sub: 'need attention', color: 'text-amber-500' },
          { label: 'Key Results', value: `${completedKRs}/${totalKRs}`, sub: 'completed', color: 'text-blue-500' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${typeFilter === t ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>
        <select className="input-field w-40 ml-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* OKR Cards */}
      <div className="space-y-4">
        {filtered.map(okr => <OkrCard key={okr.id} okr={okr} />)}
        {filtered.length === 0 && (
          <div className="card p-12 text-center text-slate-400">No OKRs found for selected filters</div>
        )}
      </div>
    </div>
  );
}
