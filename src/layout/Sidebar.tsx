import { NavLink, useLocation } from 'react-router-dom';
import { useHrms } from '../context/HrmsContext';
import {
  LayoutDashboard, Users, CalendarCheck, FileText, DollarSign, Briefcase,
  BarChart3, Settings, GraduationCap, Star, UserCircle, Bell, HelpCircle,
  Monitor, Plane, FolderKanban, Shield, GitBranch, X, ChevronDown, ChevronRight,
  Building2, Target, Clock4, LogOut as LogOutIcon, ShieldCheck, UserCog,
} from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.jpg';

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
      { to: '/employees', icon: <Users size={18} />, label: 'Employees' },
      { to: '/attendance', icon: <CalendarCheck size={18} />, label: 'Attendance' },
      { to: '/leave', icon: <FileText size={18} />, label: 'Leave Management' },
      { to: '/payroll', icon: <DollarSign size={18} />, label: 'Payroll' },
      { to: '/recruitment', icon: <Briefcase size={18} />, label: 'Recruitment' },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/training', icon: <GraduationCap size={18} />, label: 'Training & Dev' },
      { to: '/performance', icon: <Star size={18} />, label: 'Performance' },
      { to: '/goals', icon: <Target size={18} />, label: 'Goals & OKRs' },
      { to: '/shifts', icon: <Clock4 size={18} />, label: 'Shift Roster' },
      { to: '/offboarding', icon: <LogOutIcon size={18} />, label: 'Offboarding' },
      { to: '/self-service', icon: <UserCircle size={18} />, label: 'Self Service' },
      { to: '/org-chart', icon: <GitBranch size={18} />, label: 'Org Chart' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
      { to: '/assets', icon: <Monitor size={18} />, label: 'Assets' },
      { to: '/travel', icon: <Plane size={18} />, label: 'Travel & Expense' },
      { to: '/compliance', icon: <Shield size={18} />, label: 'Compliance' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { to: '/users', icon: <UserCog size={18} />, label: 'User Management' },
      { to: '/audit', icon: <ShieldCheck size={18} />, label: 'Audit Log' },
      { to: '/reports', icon: <BarChart3 size={18} />, label: 'Reports' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
      { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
      { to: '/help', icon: <HelpCircle size={18} />, label: 'Help & Support' },
    ],
  },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, unreadNotifications } = useHrms();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        w-64 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl
        border-r border-slate-200/60 dark:border-slate-700/60
        shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/30 flex-shrink-0 bg-white">
            <img src={logo} alt="SevenDor Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">SevenDor</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">HRMS Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-3 py-1.5 mb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span>{group.label}</span>
                {collapsed[group.label] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
              {!collapsed[group.label] && group.items.map((item) => {
                const isActive = item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.label === 'Notifications' && unreadNotifications > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {unreadNotifications}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            SevenDor Solutions © 2025
          </p>
        </div>
      </aside>
    </>
  );
}
