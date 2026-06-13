import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Plane, Receipt, Plus, Search, Check, X, ShieldAlert, Award, FileText } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  Approved: 'badge-green',
  Pending: 'badge-yellow',
  Completed: 'badge-blue',
  Rejected: 'badge-red',
};

const emptyTravelForm = { destination: '', purpose: '', transport: 'Flight', estimatedCost: '', from: '', to: '' };

export default function TravelExpenses() {
  const { travel, expenses, updateTravelStatus, employees, user } = useHrms();
  const [activeTab, setActiveTab] = useState('travel'); // 'travel' | 'expenses'
  const [search, setSearch] = useState('');
  const [showAddTravel, setShowAddTravel] = useState(false);
  const [travelForm, setTravelForm] = useState(emptyTravelForm);
  const [travelError, setTravelError] = useState('');

  const totalCostEstimate = travel.reduce((acc, t) => acc + (t.estimatedCost || 0), 0);
  const totalApprovedExpenses = expenses.filter(e => e.status === 'Approved').reduce((acc, e) => acc + (e.amount || 0), 0);

  const stats = [
    { icon: <Plane size={22} />, label: 'Active Trips', value: travel.filter(t => t.status === 'Approved').length, color: 'violet' },
    { icon: <Receipt size={22} />, label: 'Pending Claims', value: expenses.filter(e => e.status === 'Pending').length, color: 'rose' },
    { icon: <FileText size={22} />, label: 'Total Claims Reimbursed', value: `₹${(totalApprovedExpenses / 1000).toFixed(1)}k`, color: 'emerald' },
    { icon: <Award size={22} />, label: 'Trips Budget Cost', value: `₹${(totalCostEstimate / 100000).toFixed(2)}L`, color: 'pink' },
  ];

  const handleAddTravel = () => {
    if (!travelForm.destination || !travelForm.purpose || !travelForm.estimatedCost || !travelForm.from || !travelForm.to) {
      setTravelError('Please fill in all travel details.');
      return;
    }
    // Simulate add travel request
    travel.unshift({
      id: 'TRV' + String(Date.now()).slice(-3),
      empId: user?.empId || 'EMP001',
      empName: user?.name || 'Arjun Sharma',
      ...travelForm,
      estimatedCost: parseInt(travelForm.estimatedCost),
      status: 'Pending',
      approvedBy: null
    });
    setShowAddTravel(false);
    setTravelForm(emptyTravelForm);
    setTravelError('');
    alert('Travel request submitted successfully for approval.');
  };

  const handleApprove = (id: string) => {
    updateTravelStatus(id, 'Approved');
  };

  const handleReject = (id: string) => {
    updateTravelStatus(id, 'Rejected');
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Travel & Expenses</h1>
          <p>Book corporate travel requests, map ticket itineraries, and process cost reimbursement claims.</p>
        </div>
        {activeTab === 'travel' && (
          <button onClick={() => setShowAddTravel(true)} className="btn-primary self-start sm:self-auto">
            <Plus size={16} /> Request Business Travel
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('travel')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'travel' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Travel Bookings ({travel.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'expenses' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Expense Reimbursements ({expenses.length})
        </button>
      </div>

      {/* Filter search */}
      <div className="glass-card p-4 flex items-center gap-2 max-w-md px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
        <Search size={15} className="text-slate-400" />
        <input
          placeholder={activeTab === 'travel' ? 'Search destinations or purpose...' : 'Search claims or descriptions...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none"
        />
      </div>

      {/* Tables content */}
      <div className="glass-card overflow-hidden">
        {activeTab === 'travel' ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Destination</th>
                  <th>Trip dates</th>
                  <th>Mode / Transport</th>
                  <th>Est. Cost</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  {user?.role === 'admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {travel.filter(t => t.destination.toLowerCase().includes(search.toLowerCase()) || t.purpose.toLowerCase().includes(search.toLowerCase())).map(t => (
                  <tr key={t.id}>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      <div>
                        <p className="text-sm">{t.empName}</p>
                        <p className="text-xs text-slate-400">{t.empId}</p>
                      </div>
                    </td>
                    <td className="text-sm text-slate-750 dark:text-slate-200 font-semibold">{t.destination}</td>
                    <td className="text-xs text-slate-500">{t.from} to {t.to}</td>
                    <td><span className="badge badge-gray">{t.transport}</span></td>
                    <td className="font-bold text-slate-700 dark:text-slate-300 text-xs">₹{t.estimatedCost.toLocaleString()}</td>
                    <td className="text-slate-500 text-xs truncate max-w-xs">{t.purpose}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td>
                        {t.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(t.id)} className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" title="Approve">
                              <Check size={14} />
                            </button>
                            <button onClick={() => handleReject(t.id)} className="p-1 rounded bg-rose-50 dark:bg-rose-900/20 text-rose-600" title="Reject">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">By {t.approvedBy || 'Admin'}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Claim ID</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Submitted</th>
                  <th>Description</th>
                  <th>Receipt</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.empName.toLowerCase().includes(search.toLowerCase())).map(claim => (
                  <tr key={claim.id}>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      <div>
                        <p className="text-sm">{claim.empName}</p>
                        <p className="text-xs text-slate-400">{claim.empId}</p>
                      </div>
                    </td>
                    <td className="text-xs text-slate-500 font-mono">{claim.id}</td>
                    <td><span className="badge badge-purple">{claim.category}</span></td>
                    <td className="font-bold text-violet-600 dark:text-violet-400 text-xs">₹{claim.amount.toLocaleString()}</td>
                    <td className="text-slate-500 text-xs">{claim.submittedOn}</td>
                    <td className="text-slate-550 dark:text-slate-350 text-xs max-w-xs truncate">{claim.description}</td>
                    <td className="text-xs">
                      <button onClick={() => alert('Opening invoice receipt image...')} className="text-violet-650 font-semibold hover:underline">
                        {claim.receipt}
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[claim.status]}`}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add travel Modal */}
      <Modal isOpen={showAddTravel} onClose={() => setShowAddTravel(false)} title="Request Corporate Travel Booking" size="md">
        <div className="space-y-4">
          {travelError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{travelError}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Destination *</label>
            <input className="input-field" placeholder="e.g. Pune, Maharashtra" value={travelForm.destination} onChange={e => setTravelForm({ ...travelForm, destination: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Purpose of Visit *</label>
            <input className="input-field" placeholder="e.g. Annual Technical Stack Audit meetings" value={travelForm.purpose} onChange={e => setTravelForm({ ...travelForm, purpose: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Transport Mode</label>
              <select className="input-field" value={travelForm.transport} onChange={e => setTravelForm({ ...travelForm, transport: e.target.value })}>
                <option>Flight</option>
                <option>Train</option>
                <option>Car Rental</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Estimated Cost (INR) *</label>
              <input className="input-field" type="number" placeholder="15000" value={travelForm.estimatedCost} onChange={e => setTravelForm({ ...travelForm, estimatedCost: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Depart Date *</label>
              <input className="input-field" type="date" value={travelForm.from} onChange={e => setTravelForm({ ...travelForm, from: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Return Date *</label>
              <input className="input-field" type="date" value={travelForm.to} onChange={e => setTravelForm({ ...travelForm, to: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAddTravel} className="btn-primary">Submit Trip Booking</button>
            <button onClick={() => setShowAddTravel(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
