import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { Bell, Pin, MailOpen, CheckSquare, Search, Plus, Trash2, Megaphone } from 'lucide-react';
import Modal from '../components/Modal';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, user } = useHrms();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddAnnounce, setShowAddAnnounce] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: '', message: '', category: 'Announcement', pinned: false });

  const handleCreateAnnouncement = () => {
    if (!announceForm.title || !announceForm.message) {
      alert('Title and Message are required.');
      return;
    }
    // Simulating context push
    notifications.unshift({
      id: 'NTF' + String(Date.now()).slice(-3),
      ...announceForm,
      createdBy: user?.name || 'Administrator',
      createdAt: new Date().toISOString().split('T')[0],
      read: false,
      type: 'info',
      targetRoles: ['all']
    });
    setShowAddAnnounce(false);
    setAnnounceForm({ title: '', message: '', category: 'Announcement', pinned: false });
    alert('Announcement broadcasted successfully!');
  };

  const filtered = notifications.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    const matchCategory = categoryFilter === 'All' || n.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Sort: Pinned first
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Notifications & Announcements</h1>
          <p>Read company broadcasts, event logs, holiday notices, and alerts.</p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <button onClick={() => setShowAddAnnounce(true)} className="btn-primary flex items-center gap-1">
              <Plus size={16} /> Broadcast Notice
            </button>
          )}
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-1.5">
            <CheckSquare size={15} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Categories</option>
          <option value="Announcement">Announcement</option>
          <option value="HR Notice">HR Notice</option>
          <option value="IT Notice">IT Notice</option>
          <option value="Facility">Facility</option>
          <option value="Event">Event</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {sorted.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`glass-card p-5 border-l-4 transition-all hover:scale-[1.005] cursor-pointer relative ${
              n.read ? 'border-l-slate-300 dark:border-l-slate-700 opacity-80' : 'border-l-violet-600 dark:border-l-violet-500 shadow-md shadow-violet-500/5'
            }`}
          >
            {n.pinned && (
              <span className="absolute top-5 right-5 text-violet-500" title="Pinned Announcement">
                <Pin size={15} className="rotate-45 fill-current" />
              </span>
            )}

            <div className="flex items-start gap-3.5 pr-6">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                n.pinned ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                <Megaphone size={16} />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm">{n.title}</h3>
                  <span className="badge badge-purple text-[10px] py-0.5 px-2">{n.category}</span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
                </div>

                <p className="text-slate-650 dark:text-slate-355 text-xs leading-relaxed">{n.message}</p>

                <div className="text-[10px] text-slate-400 flex gap-2 pt-1">
                  <span>Posted by: <strong className="font-medium text-slate-650 dark:text-slate-350">{n.createdBy}</strong></span>
                  <span>•</span>
                  <span>{n.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add announcement Modal */}
      <Modal isOpen={showAddAnnounce} onClose={() => setShowAddAnnounce(false)} title="Broadcast Company Announcement" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Announcement Title *</label>
            <input className="input-field" value={announceForm.title} onChange={e => setAnnounceForm({ ...announceForm, title: e.target.value })} placeholder="e.g. Town Hall Meeting Scheduled" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select className="input-field" value={announceForm.category} onChange={e => setAnnounceForm({ ...announceForm, category: e.target.value })}>
                <option>Announcement</option>
                <option>HR Notice</option>
                <option>IT Notice</option>
                <option>Facility</option>
                <option>Event</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-450 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announceForm.pinned}
                  onChange={e => setAnnounceForm({ ...announceForm, pinned: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-700 text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                Pin announcement at the top
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Message Content *</label>
            <textarea rows={4} className="input-field resize-none text-xs" placeholder="Write full details of notice..." value={announceForm.message} onChange={e => setAnnounceForm({ ...announceForm, message: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleCreateAnnouncement} className="btn-primary">Broadcast Now</button>
            <button onClick={() => setShowAddAnnounce(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
