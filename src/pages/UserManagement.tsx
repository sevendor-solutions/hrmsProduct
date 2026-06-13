import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import Modal from '../components/Modal';
import {
  UserCog, Plus, Trash2, Edit2, Shield, ShieldOff, Lock, Unlock,
  Search, Check, X,
} from 'lucide-react';
import type { UserAccount } from '../types';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  hr: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  employee: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  Locked: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Suspended: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const ALL_PERMISSIONS = [
  'employees', 'attendance', 'leaves', 'payroll', 'recruitment', 'training',
  'performance', 'goals', 'assets', 'travel', 'projects', 'compliance',
  'reports', 'users', 'audit', 'self-service', 'notifications', 'settings',
];

interface FormState {
  name: string;
  email: string;
  role: UserAccount['role'];
  department: string;
  status: UserAccount['status'];
  permissions: string[];
  mfaEnabled: boolean;
}

const defaultForm: FormState = {
  name: '', email: '', role: 'employee', department: '',
  status: 'Active', permissions: ['self-service', 'attendance', 'leaves'],
  mfaEnabled: false,
};

export default function UserManagement() {
  const { users, addUser, updateUserRole, updateUserStatus, deleteUser, user: currentUser } = useHrms();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserAccount | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const roles = ['All', 'admin', 'manager', 'hr', 'finance', 'employee'];

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => { setEditUser(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (u: UserAccount) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, department: u.department || '', status: u.status, permissions: u.permissions, mfaEnabled: u.mfaEnabled });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editUser) {
      updateUserRole(editUser.id, form.role);
      updateUserStatus(editUser.id, form.status);
    } else {
      addUser({ ...form, createdAt: new Date().toISOString().split('T')[0] });
    }
    setShowModal(false);
  };

  const togglePermission = (perm: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    admins: users.filter(u => u.role === 'admin').length,
    mfa: users.filter(u => u.mfaEnabled).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCog className="text-violet-500" size={26} /> User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage system users, roles, and permissions</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: UserCog, color: 'text-violet-500' },
          { label: 'Active', value: stats.active, icon: Check, color: 'text-emerald-500' },
          { label: 'Admins', value: stats.admins, icon: Shield, color: 'text-amber-500' },
          { label: 'MFA Enabled', value: stats.mfa, icon: Lock, color: 'text-blue-500' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{s.label}</span>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-9 input-field"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-40" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          {roles.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {['User', 'Role', 'Department', 'Status', 'MFA', 'Last Active', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.department || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[u.status]}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.mfaEnabled
                      ? <Shield size={16} className="text-emerald-500" />
                      : <ShieldOff size={16} className="text-slate-300 dark:text-slate-600" />}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.lastActive}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {currentUser?.role === 'admin' && (
                        <>
                          <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors">
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => updateUserStatus(u.id, u.status === 'Active' ? 'Locked' : 'Active')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-500 transition-colors"
                            title={u.status === 'Active' ? 'Lock' : 'Unlock'}
                          >
                            {u.status === 'Active' ? <Lock size={15} /> : <Unlock size={15} />}
                          </button>
                          {u.id !== 'USR001' && (
                            <button onClick={() => setConfirmDelete(u.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No users found</div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editUser ? 'Edit User' : 'Add New User'} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field w-full" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" disabled={!!editUser} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-field w-full" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" disabled={!!editUser} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input-field w-full" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserAccount['role'] }))}>
                {['admin', 'manager', 'hr', 'finance', 'employee'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field w-full" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as UserAccount['status'] }))}>
                {['Active', 'Inactive', 'Locked', 'Suspended'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label mb-2">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {ALL_PERMISSIONS.map(perm => (
                <button
                  key={perm}
                  type="button"
                  onClick={() => togglePermission(perm)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                    form.permissions.includes(perm)
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition-all relative ${form.mfaEnabled ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.mfaEnabled ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300" onClick={() => setForm(p => ({ ...p, mfaEnabled: !p.mfaEnabled }))}>
              Enable MFA (Multi-Factor Authentication)
            </span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editUser ? 'Save Changes' : 'Create User'}</button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete User" size="sm">
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setConfirmDelete(null)} className="btn-secondary">
              <X size={16} className="mr-1" /> Cancel
            </button>
            <button onClick={() => { if (confirmDelete) { deleteUser(confirmDelete); setConfirmDelete(null); } }} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors flex items-center gap-1">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
