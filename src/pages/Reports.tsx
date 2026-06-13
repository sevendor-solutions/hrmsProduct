import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { chartData } from '../data/mockData';
import { StatCard } from '../components/Card';
import { FileText, Download, TrendingUp, Award, Clock, Users } from 'lucide-react';

const COLORS = ['#7c3aed', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

export default function Reports() {
  const { employees, leaves, payroll } = useHrms();
  const [reportType, setReportType] = useState('demographics'); // 'demographics' | 'performance' | 'payroll'

  // Summary Metrics
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const avgSalary = payroll.reduce((acc, p) => acc + p.netSalary, 0) / (payroll.length || 1);
  const totalApprovedLeaves = leaves.filter(l => l.status === 'Approved').reduce((acc, l) => acc + l.days, 0);

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>HR Analytics & Reports</h1>
          <p>Export company-wide reports, analyze historical growth patterns, and evaluate performance spreads.</p>
        </div>
        <button onClick={() => alert('Downloading report PDF... (UI Simulation)')} className="btn-primary self-start sm:self-auto">
          <Download size={16} /> Export Master Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setReportType('demographics')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${reportType === 'demographics' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Staff & Headcount
        </button>
        <button
          onClick={() => setReportType('performance')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${reportType === 'performance' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Performance Ratings
        </button>
        <button
          onClick={() => setReportType('payroll')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${reportType === 'payroll' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Comp & Leaves
        </button>
      </div>

      {/* Conditional visual dashboard */}
      {reportType === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={<Users size={20} />} label="Active Headcount" value={activeCount} change="95% retention rate" color="violet" />
            <StatCard icon={<TrendingUp size={20} />} label="Net Growth" value="+24%" change="Since last fiscal year" color="emerald" />
            <StatCard icon={<FileText size={20} />} label="Total Records" value={employees.length} change="Including historical data" color="blue" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Historical Headcount Growth</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData.headcountGrowth}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Department Strength</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.departmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]}>
                    {chartData.departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {reportType === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={<Award size={20} />} label="Average Appraisal Score" value="4.35 / 5" change="Target: 4.0 minimum" color="pink" />
            <StatCard icon={<TrendingUp size={20} />} label="Evaluations Done" value="8 Completed" change="1 pending review submission" color="violet" />
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Performance Rating Spread</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.ratingsDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {reportType === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={<Users size={20} />} label="Avg Net Salary Payout" value={`₹${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} change="Paid per employee" color="emerald" />
            <StatCard icon={<Clock size={20} />} label="Leave Days Approved" value={`${totalApprovedLeaves} Days`} change="Across company records" color="amber" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Payroll Cost Flow</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData.payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Time Off Split</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.leaveTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="annual" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Annual" />
                  <Bar dataKey="sick" fill="#ef4444" radius={[4, 4, 0, 0]} name="Sick" />
                  <Bar dataKey="casual" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Casual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
