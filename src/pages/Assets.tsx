import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Monitor, Cpu, Plus, Search, Tag, Settings, Link2, AlertCircle } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  Assigned: 'badge-purple',
  Available: 'badge-green',
  Repair: 'badge-yellow',
};

import type { Asset } from '../types';

const emptyAssetForm = { name: '', category: 'Laptop', brand: '', serialNo: '', condition: 'Good', value: '', status: 'Available' };

export default function Assets() {
  const { assets, addAsset, updateAsset, employees, user } = useHrms();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyAssetForm);
  const [formError, setFormError] = useState('');
  const [assigningAsset, setAssigningAsset] = useState<Asset | null>(null);

  const totalValue = assets.reduce((acc, a) => acc + (a.value || 0), 0);
  const assignedCount = assets.filter(a => a.status === 'Assigned').length;
  const availableCount = assets.filter(a => a.status === 'Available').length;

  const stats = [
    { icon: <Cpu size={22} />, label: 'Total Assets', value: assets.length, color: 'violet' },
    { icon: <Monitor size={22} />, label: 'Assigned Assets', value: assignedCount, color: 'purple' },
    { icon: <Tag size={22} />, label: 'Available Assets', value: availableCount, color: 'emerald' },
    { icon: <Settings size={22} />, label: 'Total Inventory Value', value: `₹${(totalValue / 100000).toFixed(2)}L`, color: 'pink' },
  ];

  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.serialNo.toLowerCase().includes(q) || (a.assignedName && a.assignedName.toLowerCase().includes(q));
    const matchCat = catFilter === 'All' || a.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    if (!form.name || !form.brand || !form.serialNo || !form.value) {
      setFormError('Please fill in all asset details.');
      return;
    }
    addAsset({
      name: form.name,
      category: form.category,
      brand: form.brand,
      serialNo: form.serialNo,
      condition: form.condition,
      value: parseInt(form.value),
      status: form.status,
      assignedTo: null,
      assignedName: null,
      assignedOn: null
    });
    setShowAdd(false);
    setForm(emptyAssetForm);
    setFormError('');
  };

  const handleAssign = (empId: string) => {
    if (!assigningAsset) return;
    if (!empId) {
      // Unassign
      updateAsset(assigningAsset.id, {
        status: 'Available',
        assignedTo: null,
        assignedName: null,
        assignedOn: null
      });
    } else {
      const emp = employees.find(e => e.id === empId);
      updateAsset(assigningAsset.id, {
        status: 'Assigned',
        assignedTo: emp?.id || null,
        assignedName: emp?.name || null,
        assignedOn: new Date().toISOString().split('T')[0]
      });
    }
    setAssigningAsset(null);
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Company Assets Management</h1>
          <p>Register IT hardware, map equipment assignments, and audit value distributions.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => { setForm(emptyAssetForm); setFormError(''); setShowAdd(true); }} className="btn-primary self-start sm:self-auto">
            <Plus size={16} /> Register Asset
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search assets, serials or owners..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Categories</option>
          <option>Laptop</option>
          <option>Mobile</option>
          <option>Monitor</option>
          <option>Keyboard</option>
          <option>Tablet</option>
        </select>
      </div>

      {/* Asset Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Serial Code</th>
                <th>Assigned Owner</th>
                <th>Condition</th>
                <th>Asset Value</th>
                <th>Status</th>
                {user?.role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState icon={<AlertCircle size={28} />} title="No assets registered" description="Register a laptop or screen to manage inventory." />
                  </td>
                </tr>
              ) : filtered.map(asset => (
                <tr key={asset.id}>
                  <td className="font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <p className="text-sm">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.brand} • {asset.id}</p>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{asset.category}</span></td>
                  <td className="text-xs text-slate-500 font-mono">{asset.serialNo}</td>
                  <td className="text-slate-655 dark:text-slate-350 text-xs font-medium">
                    {asset.assignedName ? (
                      <div>
                        <p>{asset.assignedName}</p>
                        <p className="text-[10px] text-slate-400">Since {asset.assignedOn}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="text-slate-600 text-xs font-semibold">{asset.condition}</td>
                  <td className="text-slate-800 dark:text-slate-200 font-semibold text-xs">₹{asset.value.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[asset.status] || 'badge-gray'}`}>
                      {asset.status}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td>
                      <button onClick={() => setAssigningAsset(asset)} className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                        <Link2 size={12} /> Map Owner
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register IT Asset Inventory" size="md">
        <div className="space-y-4">
          {formError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{formError}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Asset Name *</label>
            <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPad Pro 12.9" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Asset Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Laptop</option>
                <option>Mobile</option>
                <option>Monitor</option>
                <option>Keyboard</option>
                <option>Tablet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Brand Name *</label>
              <input className="input-field" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Apple" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Serial Number *</label>
              <input className="input-field font-mono" value={form.serialNo} onChange={e => setForm({ ...form, serialNo: e.target.value })} placeholder="SNX238A89S" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Purchase Value (INR) *</label>
              <input className="input-field" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="85000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Device Condition</label>
              <select className="input-field" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                <option>Excellent</option>
                <option>Good</option>
                <option>Needs Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Availability Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Available</option>
                <option>Repair</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="btn-primary">Register Asset</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Mapping Owner Modal */}
      {assigningAsset && (
        <Modal isOpen={!!assigningAsset} onClose={() => setAssigningAsset(null)} title="Assign / Map Asset Owner" size="sm">
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Assign <strong>{assigningAsset.name}</strong> ({assigningAsset.serialNo}) to an active employee profile.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Select Employee</label>
              <select className="input-field" defaultValue={assigningAsset.assignedTo || ''} id="owner-select">
                <option value="">-- Unassign Asset --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const selVal = (document.getElementById('owner-select') as HTMLSelectElement).value;
                  handleAssign(selVal);
                }}
                className="btn-primary"
              >
                Apply Assignment
              </button>
              <button onClick={() => setAssigningAsset(null)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
