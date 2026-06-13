import { useState, useEffect } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';
import {
  Users, CalendarCheck, FileText, Briefcase, DollarSign,
  UserPlus, CheckCircle, Banknote, GraduationCap, Monitor,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { chartData } from '../data/mockData';

const activityIcons = {
  'user-plus': <UserPlus size={16} />,
  'calendar-check': <CalendarCheck size={16} />,
  'banknote': <Banknote size={16} />,
  'briefcase': <Briefcase size={16} />,
  'graduation-cap': <GraduationCap size={16} />,
  'monitor': <Monitor size={16} />,
};
const activityColors = {
  green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
};

export default function Dashboard() {
  const { totalEmployees, presentToday, pendingLeaves, openPositions, monthlyPayroll, activities } = useHrms();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { icon: <Users size={22} />, label: 'Total Employees', value: totalEmployees, change: '+2 this month', color: 'violet' },
    { icon: <CalendarCheck size={22} />, label: 'Present Today', value: `${presentToday || 9}/12`, change: '75% attendance', color: 'emerald' },
    { icon: <FileText size={22} />, label: 'Pending Leaves', value: pendingLeaves, change: 'Needs review', changeType: pendingLeaves > 3 ? 'negative' : 'positive', color: 'amber' },
    { icon: <Briefcase size={22} />, label: 'Open Positions', value: openPositions, change: 'Actively hiring', color: 'blue' },
    { icon: <DollarSign size={22} />, label: 'Monthly Payroll', value: `₹${(monthlyPayroll / 100000).toFixed(1)}L`, change: '+3.2% vs last month', color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening at SevenDor today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map(s => <StatCard key={s.label} {...s} />)
        }
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attendance trend */}
        {loading ? <div className="xl:col-span-2"><SkeletonChart /></div> : (
          <div className="xl:col-span-2 glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Attendance Trend (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData.attendanceTrend}>
                <defs>
                  <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
                <Legend />
                <Area type="monotone" dataKey="present" stroke="#7c3aed" fill="url(#gPresent)" strokeWidth={2} name="Present %" />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#gAbsent)" strokeWidth={2} name="Absent %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Department distribution */}
        {loading ? <SkeletonChart /> : (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData.departmentDistribution} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                  {chartData.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {chartData.departmentDistribution.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Payroll trend */}
        {loading ? <SkeletonChart /> : (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Monthly Payroll Trend (₹)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.payrollTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Payroll']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="amount" fill="url(#payrollGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Leave trends */}
        {loading ? <SkeletonChart /> : (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Leave Trends (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.leaveTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
                <Legend />
                <Bar dataKey="annual" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Annual" />
                <Bar dataKey="sick" fill="#ef4444" radius={[4, 4, 0, 0]} name="Sick" />
                <Bar dataKey="casual" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Casual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${activityColors[a.color]}`}>
                {activityIcons[a.icon] || <CheckCircle size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">{a.message}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
