// ─── Core Domain Types ──────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joinDate: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Remote';
  manager: string;
  location: string;
  avatar: string;
  skills: string[];
  bloodGroup?: string;
  emergencyContact?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
}

export interface Attendance {
  empId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Holiday' | 'On Leave';
  hoursWorked: number;
}

export interface LeaveRequest {
  id: string;
  empId: string;
  empName: string;
  type: 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'Unpaid';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedOn: string;
  approvedBy: string | null;
}

export interface LeaveBalance {
  empId: string;
  annual: number;
  sick: number;
  casual: number;
  remaining: { annual: number; sick: number; casual: number };
}

export interface PayrollEntry {
  id?: string;
  empId: string;
  empName: string;
  department: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  pf: number;
  tax: number;
  netSalary: number;
  month: string;
  status: 'Paid' | 'Pending' | 'Processing';
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary: string;
  openings: number;
  applicants: number;
  postedOn: string;
  status: 'Active' | 'Closed' | 'Draft';
  description?: string;
  skills?: string[];
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  stage: 'Applied' | 'Screening' | 'Interview' | 'Technical' | 'HR Round' | 'Offer' | 'Hired';
  status: 'Active' | 'Rejected' | 'Hired' | 'Withdrawn';
  appliedOn: string;
  resumeScore: number;
  avatar: string;
  portfolio?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  type: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  mode: 'Online' | 'In-person' | 'Hybrid' | string;
  enrolled: number;
  capacity: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

export interface PerformanceReview {
  id: string;
  empId: string;
  empName: string;
  department: string;
  period: string;
  overallRating: number | null;
  technicalSkills: number | null;
  communication: number | null;
  teamwork: number | null;
  leadership: number | null;
  goalsAchieved: string | null;
  reviewedBy: string;
  status: 'Pending' | 'Draft' | 'Submitted' | 'Completed';
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNo: string;
  brand: string;
  value: number;
  condition: string;
  assignedName: string | null;
  assignedTo: string | null;
  status: 'Assigned' | 'Available' | 'Repair' | string;
  location: string;
  assignedOn: string | null;
}

export interface TravelRequest {
  id: string;
  empId: string;
  empName: string;
  purpose: string;
  destination: string;
  from: string;
  to: string;
  transport: string;
  estimatedCost: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  approvedBy?: string | null;
  notes?: string;
}

export interface ExpenseClaim {
  id: string;
  empId: string;
  empName: string;
  category: string;
  amount: number;
  submittedOn: string;
  description: string;
  receipt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';
  approvedBy?: string | null;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  manager: string;
  team: string[];
  startDate: string;
  deadline: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled' | 'Active';
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  tags: string[];
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  version: string;
  publishedOn: string;
  updatedOn: string;
  author: string;
  fileSize: string;
  status: 'Active' | 'Archived' | 'Draft';
  applicableTo: string[];
}

export interface NotificationBroadcast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetRoles: ('admin' | 'manager' | 'employee' | 'all')[];
  createdAt: string;
  createdBy: string;
  read: boolean;
  pinned?: boolean;
  category: 'HR' | 'Payroll' | 'Leave' | 'System' | 'Policy' | 'Event';
}

// ─── User Management ───────────────────────────────────────────────────────

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'hr' | 'finance';
  empId?: string;
  department?: string;
  status: 'Active' | 'Inactive' | 'Locked' | 'Suspended';
  lastActive: string;
  permissions: string[];
  mfaEnabled: boolean;
  createdAt: string;
}

// ─── OKRs / Goals ─────────────────────────────────────────────────────────

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
}

export interface GoalOkr {
  id: string;
  title: string;
  owner: string;
  ownerDept: string;
  quarter: string;
  year: number;
  type: 'Company' | 'Department' | 'Individual';
  progress: number;
  status: 'Active' | 'Completed' | 'At Risk' | 'Draft';
  keyResults: KeyResult[];
  dueDate: string;
}

// ─── Shift Roster ─────────────────────────────────────────────────────────

export interface ShiftSlot {
  empId: string;
  empName: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Off';
  startTime: string;
  endTime: string;
}

export interface ShiftRoster {
  id: string;
  week: string;
  department: string;
  slots: ShiftSlot[];
  publishedBy: string;
  publishedOn: string;
  status: 'Draft' | 'Published';
}

// ─── Offboarding ──────────────────────────────────────────────────────────

export interface OffboardingClearance {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  lastWorkingDay: string;
  reason: 'Resignation' | 'Retirement' | 'Termination' | 'Contract End';
  clearanceStatus: {
    IT: 'Approved' | 'Pending';
    Finance: 'Approved' | 'Pending';
    HR: 'Approved' | 'Pending';
    Admin: 'Approved' | 'Pending';
    Manager: 'Approved' | 'Pending';
  };
  status: 'Initiated' | 'In Progress' | 'Completed' | 'Cancelled';
  exitInterviewDone: boolean;
  noDueCertificate: boolean;
  initiatedOn: string;
}

// ─── Audit Log ────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

// ─── Charts / UI helpers ──────────────────────────────────────────────────

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  avatar: string;
}
