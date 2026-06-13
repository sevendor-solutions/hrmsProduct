import type { ReactNode } from 'react';

/**
 * Glassmorphic Card component.
 * Props: children, className, onClick, hover (boolean)
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * StatCard — KPI tile for Dashboard overview
 */
export interface StatCardProps {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  change?: ReactNode;
  changeType?: 'positive' | 'negative';
  color?: string;
}

export function StatCard({ icon, label, value, change, changeType = 'positive', color = 'violet' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    violet:  'from-violet-500 to-indigo-600',
    blue:    'from-blue-500 to-cyan-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber:   'from-amber-500 to-orange-600',
    rose:    'from-rose-500 to-red-600',
    pink:    'from-pink-500 to-fuchsia-600',
  };
  const bg = colorMap[color] || colorMap.violet;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bg} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
