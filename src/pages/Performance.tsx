import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import { Award, Star, Compass, UserCheck, Search, ShieldAlert, Target, ClipboardSignature } from 'lucide-react';
import type { PerformanceReview } from '../types';

const renderStars = (rating: number | null) => {
  if (!rating) return <span className="text-slate-400 italic text-xs">Pending review</span>;
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={13} fill="currentColor" />;
        return <Star key={i} size={13} className="text-slate-300 dark:text-slate-700" />;
      })}
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">({rating})</span>
    </div>
  );
};

export default function Performance() {
  const { performance, employees, user } = useHrms();
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  const stats = [
    { icon: <Award size={22} />, label: 'Avg Org Rating', value: '4.3 / 5', change: 'Outstanding target', color: 'pink' },
    { icon: <UserCheck size={22} />, label: 'Evaluations Completed', value: performance.filter(p => p.status === 'Completed').length, change: '100% compliant', color: 'emerald' },
    { icon: <Compass size={22} />, label: 'Pending Reviews', value: performance.filter(p => p.status === 'Pending').length, change: 'Requires manager run', color: 'amber' },
  ];

  const filtered = performance.filter(p => {
    const q = search.toLowerCase();
    return p.empName.toLowerCase().includes(q) || p.department.toLowerCase().includes(q) || p.period.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Performance Reviews</h1>
          <p>Assess employee competencies, rate core skill performance values, and view goal outcomes.</p>
        </div>
        <button onClick={() => alert('Appraisal review cycle initiated...')} className="btn-primary self-start sm:self-auto">
          <ClipboardSignature size={16} /> Open Review Cycle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Search Filter */}
      <div className="glass-card p-4 flex items-center gap-2 max-w-md px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search employee name or appraisal period..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
      </div>

      {/* Reviews Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Appraisal Period</th>
                <th>Overall Rating</th>
                <th>Goals Achieved</th>
                <th>Reviewed By</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rev => (
                <tr key={rev.id}>
                  <td className="font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <p className="text-sm">{rev.empName}</p>
                      <p className="text-xs text-slate-400">{rev.department} • {rev.empId}</p>
                    </div>
                  </td>
                  <td className="text-slate-600 dark:text-slate-400 text-sm">{rev.period}</td>
                  <td>{renderStars(rev.overallRating)}</td>
                  <td className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{rev.goalsAchieved || '—'}</td>
                  <td className="text-slate-500 text-xs">{rev.reviewedBy}</td>
                  <td>
                    <span className={`badge ${rev.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>
                      {rev.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedReview(rev)} className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Review Modal */}
      {selectedReview && (
        <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} title="Appraisal Feedback Report" size="md">
          <div className="space-y-5 text-slate-700 dark:text-slate-300">
            <div className="border-b pb-3 border-slate-200 dark:border-slate-800/80">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selectedReview.empName}</h2>
              <p className="text-xs text-slate-400">{selectedReview.department} • Period: {selectedReview.period}</p>
            </div>

            {selectedReview.overallRating ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                  <span className="font-semibold text-sm">Overall Score:</span>
                  {renderStars(selectedReview.overallRating)}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub-Metric Competencies</h3>
                  {[
                    { label: 'Technical Skills & Execution', score: selectedReview.technicalSkills },
                    { label: 'Communication & Alignment', score: selectedReview.communication },
                    { label: 'Teamwork & Collaboration', score: selectedReview.teamwork },
                    { label: 'Leadership & Directives', score: selectedReview.leadership },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} fill={i < (item.score || 0) ? 'currentColor' : 'transparent'} className={i < (item.score || 0) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={13} className="text-violet-500" /> Goals Assessment
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Appraisal Key Results Met</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReview.goalsAchieved}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3">
                <ShieldAlert className="mx-auto text-amber-500" size={32} />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Evaluation Pending</h3>
                <p className="text-xs text-slate-400">Arjun Sharma has not finalized this self-appraisal or submission review yet.</p>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button onClick={() => setSelectedReview(null)} className="btn-ghost text-xs">Close Details</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
