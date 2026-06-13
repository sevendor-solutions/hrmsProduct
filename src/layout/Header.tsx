import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrms } from '../context/HrmsContext';
import {
  Menu, Sun, Moon, Bell, Search, LogOut, User, ChevronDown, Check
} from 'lucide-react';

export default function Header() {
  const { user, logout, darkMode, toggleDarkMode, setSidebarOpen, notifications, markNotificationRead, unreadNotifications } = useHrms();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const avatarColors = ['from-violet-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600'];
  const avatarColor = avatarColors[(user?.name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <header className="h-16 flex-shrink-0 flex items-center gap-4 px-4 lg:px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-20">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 focus-within:bg-white dark:focus-within:bg-slate-700 transition-all duration-200">
        <Search size={16} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search employees, modules..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifs(p => !p); setShowProfile(false); }}
            className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold leading-none">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card shadow-2xl animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                <button onClick={() => navigate('/notifications')} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">View all</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors ${!n.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'} truncate`}>{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.createdAt}</p>
                    </div>
                    {n.read && <Check size={12} className="text-emerald-500 mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(p => !p); setShowNotifs(false); }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold shadow`}>
              {user?.avatar || user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight capitalize">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-card shadow-2xl animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={() => { setShowProfile(false); navigate('/self-service'); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <User size={15} /> My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-slate-200 dark:border-slate-700"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
