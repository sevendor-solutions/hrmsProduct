import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import { CalendarCheck, UserCheck, UserX, Clock, LogIn, LogOut, Download } from 'lucide-react';

const STATUS_COLORS = {
  Present: 'bg-emerald-500',
  Absent: 'bg-red-400',
  Late: 'bg-amber-400',
  'On Leave': 'bg-blue-400',
  Weekend: 'bg-slate-200 dark:bg-slate-700',
};
const STATUS_BADGE = {
  Present: 'badge-green',
  Absent: 'badge-red',
  Late: 'badge-yellow',
  'On Leave': 'badge-blue',
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Attendance() {
  const { attendance, employees, checkIn, checkOut, user } = useHrms();
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedEmp, setSelectedEmp] = useState(user?.empId || 'EMP001');

  const todayStr = today.toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.empId === selectedEmp && a.date === todayStr);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const getRecordForDay = (day) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rec = attendance.find(a => a.empId === selectedEmp && a.date === dateStr);
    const dow = new Date(calYear, calMonth, day).getDay();
    if (dow === 0 || dow === 6) return { status: 'Weekend' };
    return rec;
  };

  const monthRecords = attendance.filter(a => {
    const d = new Date(a.date);
    return a.empId === selectedEmp && d.getFullYear() === calYear && d.getMonth() === calMonth;
  });

  const present = monthRecords.filter(r => r.status === 'Present').length;
  const absent = monthRecords.filter(r => r.status === 'Absent').length;
  const late = monthRecords.filter(r => r.status === 'Late').length;
  const onLeave = monthRecords.filter(r => r.status === 'On Leave').length;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Attendance</h1>
          <p>Track daily attendance and generate reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Exporting attendance report... (UI Demo)')} className="btn-secondary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<UserCheck size={20} />} label="Present" value={present} color="emerald" />
        <StatCard icon={<UserX size={20} />} label="Absent" value={absent} color="rose" />
        <StatCard icon={<Clock size={20} />} label="Late Arrivals" value={late} color="amber" />
        <StatCard icon={<CalendarCheck size={20} />} label="On Leave" value={onLeave} color="blue" />
      </div>

      {/* Check-in/out + Employee select */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Today's Status</h3>
          <div className="flex flex-col gap-2">
            <select className="input-field" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
            </select>
            <div className="flex gap-2">
              <button
                disabled={!!todayRecord}
                onClick={() => checkIn(selectedEmp)}
                className="flex-1 btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={16} /> {todayRecord?.checkIn ? `In: ${todayRecord.checkIn}` : 'Check In'}
              </button>
              <button
                disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
                onClick={() => checkOut(selectedEmp)}
                className="flex-1 btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut size={16} /> {todayRecord?.checkOut ? `Out: ${todayRecord.checkOut}` : 'Check Out'}
              </button>
            </div>
            {todayRecord?.hoursWorked > 0 && (
              <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-xs text-slate-500 dark:text-slate-400">Hours Worked</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{todayRecord.hoursWorked}h</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">
              {monthNames[calMonth]} {calYear}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500">‹</button>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const rec = getRecordForDay(day);
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              return (
                <div key={day} className={`
                  aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all
                  ${rec?.status ? STATUS_COLORS[rec.status] : 'bg-slate-100 dark:bg-slate-800'}
                  ${rec?.status === 'Present' || rec?.status === 'Late' ? 'text-white' : ''}
                  ${rec?.status === 'Absent' ? 'text-white' : ''}
                  ${rec?.status === 'On Leave' ? 'text-white' : ''}
                  ${isToday ? 'ring-2 ring-violet-500 ring-offset-1' : ''}
                `}>
                  {day}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(STATUS_COLORS).filter(([k]) => k !== 'Weekend').map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className={`w-3 h-3 rounded-sm ${v}`} />
                {k}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Attendance Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Employee</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              {attendance.slice().reverse().slice(0, 20).map((rec, i) => {
                const emp = employees.find(e => e.id === rec.empId);
                return (
                  <tr key={i}>
                    <td className="text-slate-600 dark:text-slate-400">{rec.date}</td>
                    <td className="font-medium text-slate-800 dark:text-slate-200">{emp?.name || rec.empId}</td>
                    <td className="text-slate-600">{rec.checkIn || '—'}</td>
                    <td className="text-slate-600">{rec.checkOut || '—'}</td>
                    <td className="text-slate-600">{rec.hoursWorked ? `${rec.hoursWorked}h` : '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[rec.status] || 'badge-gray'}`}>{rec.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
