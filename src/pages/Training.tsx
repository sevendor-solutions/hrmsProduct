import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { GraduationCap, Award, Search, Plus, Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export default function Training() {
  const { training, enrollInTraining, user } = useHrms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '', type: 'Technical', instructor: '', startDate: '', endDate: '', duration: '', mode: 'Online', capacity: 15
  });
  const [courseError, setCourseError] = useState('');

  const filtered = training.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.instructor.toLowerCase().includes(q) || t.type.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEnroll = (id: string) => {
    enrollInTraining(id);
    alert('Successfully enrolled in training module! Progress tracks updated.');
  };

  const handleAddCourse = () => {
    if (!courseForm.title || !courseForm.instructor || !courseForm.startDate || !courseForm.endDate || !courseForm.duration) {
      setCourseError('All course fields are required.');
      return;
    }
    // Simple mock append (we can push directly to training state or show successful addition)
    training.push({
      id: 'TRN' + String(Date.now()).slice(-3),
      ...courseForm,
      enrolled: 0,
      status: 'Upcoming'
    });
    setShowAddCourse(false);
    setCourseError('');
    alert('Training course posted successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Training & Development</h1>
          <p>Schedule continuous learning courses, track ongoing skill modules, and enroll employees.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowAddCourse(true)} className="btn-primary self-start sm:self-auto">
            <Plus size={16} /> Schedule Course
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<GraduationCap size={22} />} label="Total Programs" value={training.length} color="purple" />
        <StatCard icon={<Award size={22} />} label="Upcoming" value={training.filter(t => t.status === 'Upcoming').length} color="emerald" />
        <StatCard icon={<Clock size={22} />} label="Completed" value={training.filter(t => t.status === 'Completed').length} color="blue" />
        <StatCard icon={<User size={22} />} label="Total Enrolled" value={training.reduce((acc, curr) => acc + curr.enrolled, 0)} color="pink" />
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search by title, instructor or skill tags..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon={<GraduationCap size={28} />} title="No training sessions scheduled" description="Try selecting different filters or schedule a new program." />
          </div>
        ) : filtered.map(course => {
          const enrollPct = Math.round((course.enrolled / course.capacity) * 100);
          return (
            <div key={course.id} className="glass-card p-5 flex flex-col justify-between hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10 transition-all group">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`badge ${course.type === 'Technical' ? 'badge-purple' : 'badge-blue'}`}>
                    {course.type}
                  </span>
                  <span className={`badge ${course.status === 'Completed' ? 'badge-gray' : 'badge-green'}`}>
                    {course.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-violet-500" />
                    <span>{course.startDate} to {course.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-violet-500" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-violet-500" />
                    <span>Mode: {course.mode}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar and enroll */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class Capacity</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{course.enrolled} / {course.capacity} ({enrollPct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${enrollPct}%` }} />
                  </div>
                </div>

                {course.status === 'Upcoming' && (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={course.enrolled >= course.capacity}
                    className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all disabled:opacity-50"
                  >
                    Enroll Now <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={showAddCourse} onClose={() => setShowAddCourse(false)} title="Schedule Training Program" size="md">
        <div className="space-y-4">
          {courseError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{courseError}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Course Title *</label>
            <input className="input-field" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="e.g. Docker & Kubernetes Masterclass" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Trainer / Instructor *</label>
              <input className="input-field" value={courseForm.instructor} onChange={e => setCourseForm({ ...courseForm, instructor: e.target.value })} placeholder="Sneha Patel" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
              <select className="input-field" value={courseForm.type} onChange={e => setCourseForm({ ...courseForm, type: e.target.value })}>
                <option>Technical</option>
                <option>Soft Skills</option>
                <option>Compliance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Duration *</label>
              <input className="input-field" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="e.g. 5 days (10 hours)" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Capacity</label>
              <input className="input-field" type="number" min={5} value={courseForm.capacity} onChange={e => setCourseForm({ ...courseForm, capacity: parseInt(e.target.value) || 15 })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date *</label>
              <input className="input-field" type="date" value={courseForm.startDate} onChange={e => setCourseForm({ ...courseForm, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">End Date *</label>
              <input className="input-field" type="date" value={courseForm.endDate} onChange={e => setCourseForm({ ...courseForm, endDate: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Instruction Mode</label>
            <select className="input-field" value={courseForm.mode} onChange={e => setCourseForm({ ...courseForm, mode: e.target.value })}>
              <option>Online</option>
              <option>In-person</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAddCourse} className="btn-primary">Schedule Course</button>
            <button onClick={() => setShowAddCourse(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
