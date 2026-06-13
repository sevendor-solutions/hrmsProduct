import { useState, useEffect } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import { DollarSign, Landmark, Download, FileText, Printer, Search, FileSpreadsheet, Percent, HelpCircle } from 'lucide-react';
import type { PayrollEntry } from '../types';

export default function Payroll() {
  const { payroll } = useHrms();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSlip, setSelectedSlip] = useState<PayrollEntry | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const totalCost = payroll.reduce((acc, p) => acc + p.basicSalary + p.hra + p.allowances, 0);
  const totalNet = payroll.reduce((acc, p) => acc + p.netSalary, 0);
  const totalDeductions = payroll.reduce((acc, p) => acc + p.deductions + p.pf + p.tax, 0);
  const processingCount = payroll.filter(p => p.status === 'Processing').length;

  const stats = [
    { icon: <DollarSign size={22} />, label: 'Total Gross Cost', value: `₹${(totalCost / 100000).toFixed(2)}L`, change: 'Company expense', color: 'purple' },
    { icon: <Landmark size={22} />, label: 'Total Net Payout', value: `₹${(totalNet / 100000).toFixed(2)}L`, change: 'Paid to employees', color: 'emerald' },
    { icon: <Percent size={22} />, label: 'Taxes & PF', value: `₹${(totalDeductions / 100000).toFixed(2)}L`, change: 'Statutory claims', color: 'pink' },
    { icon: <FileText size={22} />, label: 'Pending Process', value: processingCount, change: 'Needs batch run', color: 'amber' },
  ];

  const filtered = payroll.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.empName.toLowerCase().includes(q) || p.empId.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Payroll Management</h1>
          <p>Track employee payouts, basic salary components, statutory deductibles, and payslips.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('Batch run initiated...')} className="btn-primary">
            Run Batch Payroll
          </button>
          <button onClick={() => alert('Exporting payroll spreadsheet...')} className="btn-secondary">
            <FileSpreadsheet size={16} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
          <Search size={15} className="text-slate-400" />
          <input placeholder="Search by name, ID or department..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Processing">Processing</option>
        </select>
      </div>

      {/* Salary sheet */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Month</th>
                <th>Status</th>
                <th>Payslip</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.empId}>
                  <td className="font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <p className="text-sm">{p.empName}</p>
                      <p className="text-xs text-slate-400">{p.empId} • {p.department}</p>
                    </div>
                  </td>
                  <td className="text-slate-700 dark:text-slate-300 font-medium">₹{p.basicSalary.toLocaleString()}</td>
                  <td className="text-slate-500 text-xs">₹{(p.hra + p.allowances).toLocaleString()}</td>
                  <td className="text-slate-500 text-xs">₹{(p.deductions + p.pf + p.tax).toLocaleString()}</td>
                  <td className="text-violet-600 dark:text-violet-400 font-bold">₹{p.netSalary.toLocaleString()}</td>
                  <td className="text-slate-500 text-xs">{p.month}</td>
                  <td>
                    <span className={`badge ${p.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedSlip(p)} className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline font-semibold">
                      <Download size={12} /> View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedSlip && (
        <Modal isOpen={!!selectedSlip} onClose={() => setSelectedSlip(null)} title="Salary Payslip" size="md">
          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-violet-600 dark:text-violet-400">SevenDor Technologies</h2>
              <p className="text-xs text-slate-400">Bangalore Office • Salary slip for {selectedSlip.month}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Employee Name:</p>
                <p className="font-semibold">{selectedSlip.empName}</p>
              </div>
              <div>
                <p className="text-slate-400">Employee ID:</p>
                <p className="font-semibold">{selectedSlip.empId}</p>
              </div>
              <div>
                <p className="text-slate-400">Department:</p>
                <p className="font-semibold">{selectedSlip.department}</p>
              </div>
              <div>
                <p className="text-slate-400">Payment Status:</p>
                <p className="font-semibold text-emerald-500">{selectedSlip.status}</p>
              </div>
            </div>

            {/* Calculations */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-violet-500 border-b pb-1">Earnings</h3>
                <div className="flex justify-between text-xs">
                  <span>Basic Salary</span>
                  <span>₹{selectedSlip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>House Rent Allow.</span>
                  <span>₹{selectedSlip.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Special Allowance</span>
                  <span>₹{selectedSlip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1 text-xs">
                  <span>Gross Earnings</span>
                  <span>₹{(selectedSlip.basicSalary + selectedSlip.hra + selectedSlip.allowances).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-rose-500 border-b pb-1">Deductions</h3>
                <div className="flex justify-between text-xs">
                  <span>Professional Tax</span>
                  <span>₹{selectedSlip.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Provident Fund</span>
                  <span>₹{selectedSlip.pf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Other Deductions</span>
                  <span>₹{selectedSlip.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1 text-xs">
                  <span>Total Deductions</span>
                  <span>₹{(selectedSlip.tax + selectedSlip.pf + selectedSlip.deductions).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Payout */}
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex justify-between items-center font-bold">
              <span className="text-violet-700 dark:text-violet-300">Net Salary Payable</span>
              <span className="text-2xl text-violet-700 dark:text-violet-400">₹{selectedSlip.netSalary.toLocaleString()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end text-xs">
              <button onClick={() => window.print()} className="btn-secondary py-2">
                <Printer size={14} /> Print
              </button>
              <button onClick={() => setSelectedSlip(null)} className="btn-ghost py-2">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
