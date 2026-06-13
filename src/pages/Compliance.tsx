import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { ShieldCheck, FileText, Download, Search, AlertCircle, FileLock } from 'lucide-react';

const CATEGORY_COLORS = {
  'HR Policy': 'badge-purple',
  'IT Policy': 'badge-blue',
  'Finance Policy': 'badge-yellow',
};

export default function Compliance() {
  const { policies } = useHrms();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const stats = [
    { icon: <ShieldCheck size={22} />, label: 'Active Policies', value: policies.length, color: 'violet' },
    { icon: <FileText size={22} />, label: 'Regulatory Mandates', value: 3, color: 'emerald' },
    { icon: <FileLock size={22} />, label: 'Security Standards', value: 'ISO 27001', color: 'blue' },
  ];

  const filtered = policies.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="page-header">
        <h1>Compliance & Corporate Policies</h1>
        <p>Review internal regulatory directives, IT privacy guidelines, security charters, and handbook rules.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search policies, versions or keyword descriptions..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Categories</option>
          <option>HR Policy</option>
          <option>IT Policy</option>
          <option>Finance Policy</option>
        </select>
      </div>

      {/* Policy list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon={<AlertCircle size={28} />} title="No policy documentation matching criteria" description="Try selecting another category or clear search query." />
          </div>
        ) : filtered.map(policy => (
          <div key={policy.id} className="glass-card p-5 flex flex-col justify-between hover:scale-[1.005] transition-all">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`badge ${CATEGORY_COLORS[policy.category] || 'badge-gray'}`}>
                  {policy.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-semibold">Version {policy.version}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{policy.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{policy.description}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Updated: {policy.updatedOn} • {policy.size}</span>
              <div className="flex gap-2">
                <button onClick={() => setSelectedDoc(policy)} className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                  View Online
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={() => alert(`Downloading policy file: ${policy.title}.${policy.format.toLowerCase()}`)} className="flex items-center gap-1 text-slate-600 dark:text-slate-450 hover:text-slate-800 font-semibold">
                  <Download size={13} /> {policy.format}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Document Modal */}
      {selectedDoc && (
        <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title={selectedDoc.title} size="lg">
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Category: <strong>{selectedDoc.category}</strong></span>
              <span className="text-slate-400">Last Revised: <strong>{selectedDoc.updatedOn}</strong></span>
            </div>

            {/* Simulated Document body reader */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/60 text-xs leading-relaxed space-y-4 max-h-[360px] overflow-y-auto font-sans select-none">
              <h2 className="text-center font-bold text-sm text-slate-900 dark:text-white uppercase">SevenDor Corporate Directives Checklist</h2>
              <p className="italic text-center text-[10px] text-slate-400">Restricted for internal distribution only • Version {selectedDoc.version}</p>

              <h3 className="font-semibold text-violet-500 border-b pb-1 text-xs">1. Purpose and Overview</h3>
              <p>
                {selectedDoc.description} This directive establishes the standards, baseline rules, and procedures mandated for all SevenDor corporate associates globally. Operational execution is checked regularly by the compliance council.
              </p>

              <h3 className="font-semibold text-violet-500 border-b pb-1 text-xs">2. Standard Operating Procedures</h3>
              <p>
                All company departments are required to review this protocol and ensure that day-to-day operations are aligned. Failure to follow the guidelines may lead to internal audits or structural revision cycles.
              </p>

              <h3 className="font-semibold text-violet-500 border-b pb-1 text-xs">3. Responsibilities & Execution</h3>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>Adherence to local statutory security regulations is mandatory.</li>
                <li>Auditing schedules will be compiled at Q3 close.</li>
                <li>Revision requests should be directed to the compliance panel.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => alert(`Downloading policy file...`)} className="btn-secondary flex items-center gap-1">
                <Download size={13} /> Download PDF
              </button>
              <button onClick={() => setSelectedDoc(null)} className="btn-ghost">
                Close Reader
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
