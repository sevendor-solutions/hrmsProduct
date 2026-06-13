import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { User, Shield, Bell, Eye, Moon, Sun, Save, Check } from 'lucide-react';

export default function Settings() {
  const { user, darkMode, toggleDarkMode } = useHrms();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Rahul Mehta',
    email: user?.email || 'admin@sevendor.com',
    role: user?.role || 'admin',
    phone: '+91 98765 43212',
    timezone: 'GMT+5:30 (India Standard Time)',
  });
  const [notifPreferences, setNotifPreferences] = useState({
    emailAlerts: true,
    pushNotifs: true,
    weeklyDigest: false,
    leaveApprovals: true,
  });
  const [saved, setSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNotifToggle = (key: keyof typeof notifPreferences) => {
    setNotifPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account profile, configure alerts, and customize app appearance settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar inside settings */}
        <div className="glass-card p-4 h-fit space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-500/20">
            <User size={16} /> Profile Information
          </button>
          <button onClick={() => alert('Security configuration simulator...')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-semibold text-sm transition-all text-left">
            <Shield size={16} /> Password & Security
          </button>
          <button onClick={() => alert('Billing and features portal...')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-semibold text-sm transition-all text-left">
            <Bell size={16} /> Push Notifications
          </button>
        </div>

        {/* Content panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <form onSubmit={handleProfileSave} className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
              <User size={16} className="text-violet-500" /> Account Profile
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Display Name</label>
                <input className="input-field" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                <input className="input-field" type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Designation Role</label>
                <input className="input-field" disabled value={profileForm.role === 'admin' ? 'Administrator' : 'Employee'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                <input className="input-field" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Timezone</label>
                <select className="input-field" value={profileForm.timezone} onChange={e => setProfileForm({ ...profileForm, timezone: e.target.value })}>
                  <option>GMT+5:30 (India Standard Time)</option>
                  <option>GMT-8:00 (Pacific Standard Time)</option>
                  <option>GMT+0:00 (London UTC)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary flex items-center gap-1.5 self-start">
              {saved ? (
                <>
                  <Check size={14} /> Profile Saved!
                </>
              ) : (
                <>
                  <Save size={14} /> Save Profile
                </>
              )}
            </button>
          </form>

          {/* Theme & Display Options */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
              <Eye size={16} className="text-violet-500" /> Interface Customization
            </h3>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">System Theme Mode</p>
                <p className="text-xs text-slate-400">Toggle dark mode configuration across the workspace dashboard layout.</p>
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-violet-500 flex items-center justify-center border border-slate-200 dark:border-slate-700/50 hover:scale-105 transition-all"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Notifications config */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 border-b pb-2 flex items-center gap-2">
              <Bell size={16} className="text-violet-500" /> Notifications Settings
            </h3>
            <div className="space-y-3">
              {(
                [
                  { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive daily report digests and critical notifications via registered email.' },
                  { key: 'pushNotifs', title: 'Push Notifications', desc: 'Display instant alerts within the browser and desktop dashboard shell.' },
                  { key: 'weeklyDigest', title: 'Weekly Reports', desc: 'Weekly summary compilation of team attendance and leaves.' },
                  { key: 'leaveApprovals', title: 'Approval Notifications', desc: 'Get notified as soon as time-off requests change states.' },
                ] as const
              ).map(({ key, title, desc }) => (
                <div key={key} className="flex justify-between items-start text-sm">
                  <div className="max-w-[80%]">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{title}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotifToggle(key)}
                    className={`w-11 h-6 rounded-full transition-all relative ${notifPreferences[key] ? 'bg-violet-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifPreferences[key] ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
