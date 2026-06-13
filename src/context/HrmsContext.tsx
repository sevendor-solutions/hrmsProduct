import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  mockEmployees, mockAttendance, mockLeaves, mockPayroll,
  mockRecruitment, mockCandidates, mockTraining, mockPerformance,
  mockAssets, mockTravel, mockExpenses, mockProjects, mockPolicies,
  mockNotifications, recentActivities, mockUsers, mockOkrs, mockShifts,
  mockOffboardings, mockAuditLogs,
} from '../data/mockData';
import type {
  Employee, Attendance, LeaveRequest, PayrollEntry, JobPosting, Candidate,
  TrainingProgram, PerformanceReview, Asset, TravelRequest, ExpenseClaim,
  Project, PolicyDocument, NotificationBroadcast, UserAccount, GoalOkr,
  ShiftRoster, OffboardingClearance, AuditLog,
} from '../types';

interface AuthUser {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  empId: string;
  avatar: string;
}

interface HrmsContextValue {
  // Auth
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id' | 'avatar' | 'status'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  // Attendance
  attendance: Attendance[];
  checkIn: (empId: string) => void;
  checkOut: (empId: string) => void;
  // Leaves
  leaves: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'approvedBy'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected', approvedBy?: string) => void;
  // Payroll
  payroll: PayrollEntry[];
  // Recruitment
  recruitment: JobPosting[];
  addJobPosting: (job: Omit<JobPosting, 'id' | 'applicants' | 'postedOn' | 'status'>) => void;
  candidates: Candidate[];
  updateCandidateStage: (id: string, stage: string, status: Candidate['status']) => void;
  // Training
  training: TrainingProgram[];
  enrollInTraining: (trainingId: string) => void;
  // Performance
  performance: PerformanceReview[];
  // Assets
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  // Travel
  travel: TravelRequest[];
  updateTravelStatus: (id: string, status: TravelRequest['status']) => void;
  expenses: ExpenseClaim[];
  // Projects
  projects: Project[];
  // Policies
  policies: PolicyDocument[];
  // Notifications
  notifications: NotificationBroadcast[];
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  // Activities
  activities: typeof recentActivities;
  // User Management
  users: UserAccount[];
  addUser: (u: Omit<UserAccount, 'id' | 'lastActive'>) => void;
  updateUserRole: (id: string, role: UserAccount['role']) => void;
  updateUserStatus: (id: string, status: UserAccount['status']) => void;
  deleteUser: (id: string) => void;
  // OKRs
  okrs: GoalOkr[];
  // Shifts
  shifts: ShiftRoster[];
  // Offboarding
  offboardings: OffboardingClearance[];
  updateOffboardingStatus: (id: string, status: OffboardingClearance['status']) => void;
  updateClearanceItem: (id: string, dept: keyof OffboardingClearance['clearanceStatus'], status: 'Approved' | 'Pending') => void;
  // Audit logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  // Derived
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  openPositions: number;
  monthlyPayroll: number;
  unreadNotifications: number;
}

const HrmsContext = createContext<HrmsContextValue | null>(null);

export function HrmsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [payroll] = useState<PayrollEntry[]>(mockPayroll);
  const [recruitment, setRecruitment] = useState<JobPosting[]>(mockRecruitment);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [training, setTraining] = useState<TrainingProgram[]>(mockTraining);
  const [performance] = useState<PerformanceReview[]>(mockPerformance);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [travel, setTravel] = useState<TravelRequest[]>(mockTravel);
  const [expenses] = useState<ExpenseClaim[]>(mockExpenses);
  const [projects] = useState<Project[]>(mockProjects);
  const [policies] = useState<PolicyDocument[]>(mockPolicies);
  const [notifications, setNotifications] = useState<NotificationBroadcast[]>(mockNotifications);
  const [activities] = useState(recentActivities);
  const [users, setUsers] = useState<UserAccount[]>(mockUsers);
  const [okrs] = useState<GoalOkr[]>(mockOkrs);
  const [shifts] = useState<ShiftRoster[]>(mockShifts);
  const [offboardings, setOffboardings] = useState<OffboardingClearance[]>(mockOffboardings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // ── Audit Logger ──────────────────────────────────────────────
  const addAuditLog = useCallback((action: string, details: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    setAuditLogs(prev => [{
      id: 'AUD' + Date.now(),
      timestamp,
      user: 'System',
      action,
      details,
    }, ...prev]);
  }, []);

  // ── Auth Actions ──────────────────────────────────────────────
  const login = useCallback((email: string, password: string) => {
    if (email === 'admin@sevendor.com' && password === 'admin123') {
      setUser({ name: 'Rahul Mehta', email, role: 'admin', empId: 'EMP003', avatar: 'RM' });
      addAuditLog('User Login', `Admin logged in via ${email}`);
      return { success: true };
    }
    if (email === 'employee@sevendor.com' && password === 'emp123') {
      setUser({ name: 'Arjun Sharma', email, role: 'employee', empId: 'EMP001', avatar: 'AS' });
      addAuditLog('User Login', `Employee logged in via ${email}`);
      return { success: true };
    }
    if (email === 'priya.nair@sevendor.com' && password === 'manager123') {
      setUser({ name: 'Priya Nair', email, role: 'manager', empId: 'EMP002', avatar: 'PN' });
      addAuditLog('User Login', `Manager logged in via ${email}`);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Try admin@sevendor.com / admin123' };
  }, [addAuditLog]);

  const logout = useCallback(() => {
    addAuditLog('User Logout', `${user?.name || 'User'} logged out`);
    setUser(null);
  }, [user, addAuditLog]);

  // ── Theme ──────────────────────────────────────────────
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  }, []);

  // ── Employee Actions ──────────────────────────────────────────
  const addEmployee = useCallback((emp: Omit<Employee, 'id' | 'avatar' | 'status'>) => {
    const newId = 'EMP' + String(Date.now()).slice(-3);
    const initials = emp.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    setEmployees(prev => [...prev, { ...emp, id: newId, avatar: initials, status: 'Active' }]);
    addAuditLog('Employee Added', `New employee ${emp.name} added (${newId})`);
  }, [addAuditLog]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addAuditLog('Employee Updated', `Employee ${id} profile updated`);
  }, [addAuditLog]);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    addAuditLog('Employee Deleted', `Employee ${id} removed from records`);
  }, [addAuditLog]);

  // ── Leave Actions ──────────────────────────────────────────────
  const addLeaveRequest = useCallback((req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'approvedBy'>) => {
    const newId = 'LV' + String(Date.now()).slice(-3);
    setLeaves(prev => [...prev, {
      ...req, id: newId, status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0], approvedBy: null,
    }]);
    addAuditLog('Leave Request', `${req.empName} submitted a ${req.type} request`);
  }, [addAuditLog]);

  const updateLeaveStatus = useCallback((id: string, status: 'Approved' | 'Rejected', approvedBy?: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status, approvedBy: approvedBy || null } : l));
    addAuditLog('Leave Status', `Leave ${id} marked as ${status}`);
  }, [addAuditLog]);

  // ── Attendance Actions ────────────────────────────────────────
  const checkIn = useCallback((empId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().slice(0, 5);
    setAttendance(prev => {
      if (prev.find(a => a.empId === empId && a.date === today)) return prev;
      return [...prev, { empId, date: today, checkIn: now, checkOut: null, status: 'Present', hoursWorked: 0 }];
    });
    addAuditLog('Check In', `Employee ${empId} punched in at ${now}`);
  }, [addAuditLog]);

  const checkOut = useCallback((empId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().slice(0, 5);
    setAttendance(prev => prev.map(a => {
      if (a.empId === empId && a.date === today && a.checkIn && !a.checkOut) {
        const [h1, m1] = a.checkIn.split(':').map(Number);
        const [h2, m2] = now.split(':').map(Number);
        const hours = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
        return { ...a, checkOut: now, hoursWorked: parseFloat(hours.toFixed(2)) };
      }
      return a;
    }));
    addAuditLog('Check Out', `Employee ${empId} punched out at ${now}`);
  }, [addAuditLog]);

  // ── Asset Actions ──────────────────────────────────────────────
  const addAsset = useCallback((asset: Omit<Asset, 'id'>) => {
    const newId = 'AST' + String(Date.now()).slice(-3);
    setAssets(prev => [...prev, { ...asset, id: newId }]);
    addAuditLog('Asset Added', `New asset ${asset.name} (${asset.serialNo}) registered`);
  }, [addAuditLog]);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addAuditLog('Asset Updated', `Asset ${id} details updated`);
  }, [addAuditLog]);

  // ── Recruitment Actions ───────────────────────────────────────
  const addJobPosting = useCallback((job: Omit<JobPosting, 'id' | 'applicants' | 'postedOn' | 'status'>) => {
    const newId = 'JOB' + String(Date.now()).slice(-3);
    setRecruitment(prev => [...prev, {
      ...job, id: newId, applicants: 0,
      postedOn: new Date().toISOString().split('T')[0], status: 'Active',
    }]);
    addAuditLog('Job Posted', `New job posting "${job.title}" created`);
  }, [addAuditLog]);

  const updateCandidateStage = useCallback((id: string, stage: string, status: Candidate['status']) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage, status } : c));
  }, []);

  // ── Travel Actions ─────────────────────────────────────────────
  const updateTravelStatus = useCallback((id: string, status: TravelRequest['status']) => {
    setTravel(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addAuditLog('Travel Request', `Travel ${id} marked as ${status}`);
  }, [addAuditLog]);

  // ── Training Actions ───────────────────────────────────────────
  const enrollInTraining = useCallback((trainingId: string) => {
    setTraining(prev => prev.map(t => t.id === trainingId ? { ...t, enrolled: t.enrolled + 1 } : t));
  }, []);

  // ── Notification Actions ───────────────────────────────────────
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // ── User Management Actions ────────────────────────────────────
  const addUser = useCallback((u: Omit<UserAccount, 'id' | 'lastActive'>) => {
    const newId = 'USR' + String(Date.now()).slice(-3);
    setUsers(prev => [...prev, { ...u, id: newId, lastActive: 'Never' }]);
    addAuditLog('User Created', `New user account created for ${u.name} (${u.role})`);
  }, [addAuditLog]);

  const updateUserRole = useCallback((id: string, role: UserAccount['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    addAuditLog('Role Changed', `User ${id} role updated to ${role}`);
  }, [addAuditLog]);

  const updateUserStatus = useCallback((id: string, status: UserAccount['status']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    addAuditLog('User Status', `User ${id} status set to ${status}`);
  }, [addAuditLog]);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('User Deleted', `User account ${id} removed`);
  }, [addAuditLog]);

  // ── Offboarding Actions ────────────────────────────────────────
  const updateOffboardingStatus = useCallback((id: string, status: OffboardingClearance['status']) => {
    setOffboardings(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addAuditLog('Offboarding', `Offboarding ${id} status updated to ${status}`);
  }, [addAuditLog]);

  const updateClearanceItem = useCallback((id: string, dept: keyof OffboardingClearance['clearanceStatus'], status: 'Approved' | 'Pending') => {
    setOffboardings(prev => prev.map(o => o.id === id ? {
      ...o, clearanceStatus: { ...o.clearanceStatus, [dept]: status }
    } : o));
    addAuditLog('Clearance Updated', `Offboarding ${id}: ${dept} clearance set to ${status}`);
  }, [addAuditLog]);

  // ── Derived Metrics ────────────────────────────────────────────
  const totalEmployees = employees.filter(e => e.status === 'Active').length;
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const openPositions = recruitment.filter(r => r.status === 'Active').reduce((acc, r) => acc + r.openings, 0);
  const monthlyPayroll = payroll.reduce((acc, p) => acc + p.netSalary, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const value: HrmsContextValue = {
    user, login, logout,
    darkMode, toggleDarkMode,
    sidebarOpen, setSidebarOpen,
    employees, addEmployee, updateEmployee, deleteEmployee,
    attendance, checkIn, checkOut,
    leaves, addLeaveRequest, updateLeaveStatus,
    payroll,
    recruitment, addJobPosting,
    candidates, updateCandidateStage,
    training, enrollInTraining,
    performance,
    assets, addAsset, updateAsset,
    travel, updateTravelStatus,
    expenses,
    projects,
    policies,
    notifications, markNotificationRead, markAllRead,
    activities,
    users, addUser, updateUserRole, updateUserStatus, deleteUser,
    okrs,
    shifts,
    offboardings, updateOffboardingStatus, updateClearanceItem,
    auditLogs, addAuditLog,
    totalEmployees, presentToday, pendingLeaves, openPositions, monthlyPayroll, unreadNotifications,
  };

  return <HrmsContext.Provider value={value}>{children}</HrmsContext.Provider>;
}

export function useHrms(): HrmsContextValue {
  const ctx = useContext(HrmsContext);
  if (!ctx) throw new Error('useHrms must be used inside HrmsProvider');
  return ctx;
}
