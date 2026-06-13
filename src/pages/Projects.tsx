import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Briefcase, Plus, Search, FolderKanban, Users, ShieldAlert, Award } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'badge-purple',
  High: 'badge-red',
  Medium: 'badge-yellow',
  Low: 'badge-blue',
};

const emptyProjectForm = { name: '', department: 'Engineering', lead: '', budget: '', startDate: '', endDate: '', priority: 'Medium' };

export default function Projects() {
  const { projects, employees, user } = useHrms();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyProjectForm);
  const [formError, setFormError] = useState('');

  const activeCount = projects.filter(p => p.status !== 'Completed').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

  const stats = [
    { icon: <FolderKanban size={22} />, label: 'Active Projects', value: activeCount, color: 'violet' },
    { icon: <Award size={22} />, label: 'Completed Projects', value: completedCount, color: 'emerald' },
    { icon: <Briefcase size={22} />, label: 'Total Allocated Budget', value: `₹${(totalBudget / 1000000).toFixed(1)}M`, color: 'pink' },
  ];

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.manager.toLowerCase().includes(q);
  });

  const handleAddProject = () => {
    if (!form.name || !form.lead || !form.budget || !form.startDate || !form.endDate) {
      setFormError('Please fill in all project fields.');
      return;
    }
    const leadEmp = employees.find(e => e.id === form.lead) || { name: 'Unassigned' };
    projects.unshift({
      id: 'PRJ' + String(Date.now()).slice(-3),
      name: form.name,
      manager: leadEmp.name,
      team: [form.lead],
      startDate: form.startDate,
      deadline: form.endDate,
      progress: 0,
      status: 'Active',
      priority: form.priority,
      budget: parseInt(form.budget),
      spent: 0,
      client: 'Internal',
      tags: []
    });
    setShowAdd(false);
    setForm(emptyProjectForm);
    setFormError('');
    alert('Project initialized successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Project Management</h1>
          <p>Track project timelines, map client task budgets, and overview team allocations.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowAdd(true)} className="btn-primary self-start sm:self-auto">
            <Plus size={16} /> Initialize Project
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Search Filter */}
      <div className="glass-card p-4 flex items-center gap-2 max-w-md px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search project name, lead, or department..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon={<ShieldAlert size={28} />} title="No projects found" description="Try creating a new project mapping or change filters." />
          </div>
        ) : filtered.map(proj => (
          <div key={proj.id} className="glass-card p-5 flex flex-col justify-between hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10 transition-all group">
            <div className="space-y-3.5">
              <div className="flex justify-between items-start">
                <span className={`badge ${PRIORITY_COLORS[proj.priority]}`}>{proj.priority} Priority</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-850 dark:text-slate-200 group-hover:text-violet-650 dark:group-hover:text-violet-400 transition-colors text-base">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Project Lead: <strong className="font-semibold text-slate-600 dark:text-slate-350">{proj.manager}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Total Budget</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">₹{proj.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Target Date</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{proj.deadline}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Execution Progress</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1"><Users size={13} /> {proj.team?.length || 1} Assigned</span>
                <span className={`badge ${proj.status === 'Completed' ? 'badge-green' : 'badge-blue'}`}>{proj.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Initialize New Corporate Project" size="md">
        <div className="space-y-4">
          {formError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{formError}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Project Name *</label>
            <input className="input-field" placeholder="e.g. Next-Gen Mobile App Build" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
              <select className="input-field" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Project Lead *</label>
              <select className="input-field" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })}>
                <option value="">-- Select Project Lead --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Project Budget (INR) *</label>
              <input className="input-field" type="number" placeholder="500000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Task Priority</label>
              <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date *</label>
              <input className="input-field" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Target End Date *</label>
              <input className="input-field" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAddProject} className="btn-primary">Initialize Project</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
