import type {
  Employee, Attendance, LeaveRequest, LeaveBalance, PayrollEntry, JobPosting, Candidate,
  TrainingProgram, PerformanceReview, Asset, TravelRequest, ExpenseClaim,
  Project, PolicyDocument, NotificationBroadcast, RecentActivity,
  UserAccount, GoalOkr, ShiftRoster, OffboardingClearance, AuditLog,
} from '../types';

// ──────────────────────────────────────────────────────────────────────────────
// EMPLOYEES
// ──────────────────────────────────────────────────────────────────────────────
export const mockEmployees: Employee[] = [
  { id: 'EMP001', name: 'Arjun Sharma', email: 'arjun.sharma@sevendor.com', phone: '+91 9876543210', department: 'Engineering', designation: 'Senior Software Engineer', joinDate: '2021-03-15', salary: 85000, status: 'Active', manager: 'Priya Nair', location: 'Bangalore', avatar: 'AS', skills: ['React', 'TypeScript', 'Node.js', 'AWS'], bloodGroup: 'B+', gender: 'Male', dob: '1994-07-22', address: '12 MG Road, Bangalore' },
  { id: 'EMP002', name: 'Priya Nair', email: 'priya.nair@sevendor.com', phone: '+91 9876543211', department: 'Engineering', designation: 'Engineering Manager', joinDate: '2019-07-01', salary: 120000, status: 'Active', manager: 'Rahul Mehta', location: 'Bangalore', avatar: 'PN', skills: ['Leadership', 'Agile', 'System Design', 'React'], bloodGroup: 'O+', gender: 'Female', dob: '1991-03-14', address: '5 Koramangala, Bangalore' },
  { id: 'EMP003', name: 'Rahul Mehta', email: 'rahul.mehta@sevendor.com', phone: '+91 9876543212', department: 'HR', designation: 'HR Director', joinDate: '2018-01-10', salary: 140000, status: 'Active', manager: 'CEO', location: 'Mumbai', avatar: 'RM', skills: ['HR Management', 'Talent Acquisition', 'Compliance', 'HRIS'], bloodGroup: 'A+', gender: 'Male', dob: '1988-11-02', address: '7 Andheri West, Mumbai' },
  { id: 'EMP004', name: 'Sunita Rao', email: 'sunita.rao@sevendor.com', phone: '+91 9876543213', department: 'Finance', designation: 'Finance Manager', joinDate: '2020-02-20', salary: 95000, status: 'Active', manager: 'Rahul Mehta', location: 'Hyderabad', avatar: 'SR', skills: ['Accounting', 'Tally', 'GST', 'SAP'], bloodGroup: 'AB+', gender: 'Female', dob: '1992-06-18', address: '3 Banjara Hills, Hyderabad' },
  { id: 'EMP005', name: 'Kiran Patel', email: 'kiran.patel@sevendor.com', phone: '+91 9876543214', department: 'Sales', designation: 'Sales Executive', joinDate: '2022-06-01', salary: 60000, status: 'Active', manager: 'Deepak Kumar', location: 'Ahmedabad', avatar: 'KP', skills: ['CRM', 'Salesforce', 'Negotiation', 'B2B'], bloodGroup: 'B-', gender: 'Male', dob: '1997-01-30', address: '9 CG Road, Ahmedabad' },
  { id: 'EMP006', name: 'Deepak Kumar', email: 'deepak.kumar@sevendor.com', phone: '+91 9876543215', department: 'Sales', designation: 'Sales Manager', joinDate: '2020-09-15', salary: 90000, status: 'Remote', manager: 'Rahul Mehta', location: 'Delhi', avatar: 'DK', skills: ['Sales Strategy', 'Team Management', 'CRM', 'Analytics'], bloodGroup: 'O-', gender: 'Male', dob: '1990-08-12', address: '45 Connaught Place, Delhi' },
  { id: 'EMP007', name: 'Ananya Singh', email: 'ananya.singh@sevendor.com', phone: '+91 9876543216', department: 'Marketing', designation: 'Digital Marketing Lead', joinDate: '2021-11-01', salary: 75000, status: 'Active', manager: 'Rahul Mehta', location: 'Bangalore', avatar: 'AS', skills: ['SEO', 'Google Ads', 'HubSpot', 'Analytics', 'Social Media'], bloodGroup: 'A-', gender: 'Female', dob: '1995-04-25', address: '22 Whitefield, Bangalore' },
  { id: 'EMP008', name: 'Vijay Reddy', email: 'vijay.reddy@sevendor.com', phone: '+91 9876543217', department: 'Engineering', designation: 'DevOps Engineer', joinDate: '2022-01-10', salary: 80000, status: 'Active', manager: 'Priya Nair', location: 'Hyderabad', avatar: 'VR', skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'], bloodGroup: 'B+', gender: 'Male', dob: '1996-09-08', address: '11 HITEC City, Hyderabad' },
  { id: 'EMP009', name: 'Meena Joshi', email: 'meena.joshi@sevendor.com', phone: '+91 9876543218', department: 'HR', designation: 'Talent Acquisition Specialist', joinDate: '2023-03-01', salary: 55000, status: 'On Leave', manager: 'Rahul Mehta', location: 'Pune', avatar: 'MJ', skills: ['Recruitment', 'LinkedIn Recruiter', 'ATS', 'HR Analytics'], bloodGroup: 'AB-', gender: 'Female', dob: '1998-12-11', address: '6 Hinjewadi, Pune' },
  { id: 'EMP010', name: 'Rohit Verma', email: 'rohit.verma@sevendor.com', phone: '+91 9876543219', department: 'Engineering', designation: 'Junior Developer', joinDate: '2024-01-15', salary: 45000, status: 'Active', manager: 'Priya Nair', location: 'Bangalore', avatar: 'RV', skills: ['Python', 'Django', 'PostgreSQL', 'Git'], bloodGroup: 'O+', gender: 'Male', dob: '2000-03-20', address: '18 HSR Layout, Bangalore' },
];

// ──────────────────────────────────────────────────────────────────────────────
// ATTENDANCE
// ──────────────────────────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockAttendance: Attendance[] = [
  { empId: 'EMP001', date: today, checkIn: '09:02', checkOut: '18:30', status: 'Present', hoursWorked: 9.47 },
  { empId: 'EMP002', date: today, checkIn: '08:55', checkOut: '19:00', status: 'Present', hoursWorked: 10.08 },
  { empId: 'EMP003', date: today, checkIn: '09:20', checkOut: null, status: 'Present', hoursWorked: 0 },
  { empId: 'EMP004', date: today, checkIn: '10:15', checkOut: '18:15', status: 'Late', hoursWorked: 8 },
  { empId: 'EMP005', date: today, checkIn: null, checkOut: null, status: 'Absent', hoursWorked: 0 },
  { empId: 'EMP006', date: today, checkIn: '09:00', checkOut: '17:00', status: 'Present', hoursWorked: 8 },
  { empId: 'EMP007', date: today, checkIn: null, checkOut: null, status: 'On Leave', hoursWorked: 0 },
  { empId: 'EMP008', date: today, checkIn: '08:30', checkOut: '17:30', status: 'Present', hoursWorked: 9 },
  { empId: 'EMP009', date: today, checkIn: null, checkOut: null, status: 'On Leave', hoursWorked: 0 },
  { empId: 'EMP010', date: today, checkIn: '09:10', checkOut: '18:00', status: 'Present', hoursWorked: 8.83 },
  // Yesterday
  { empId: 'EMP001', date: yesterday, checkIn: '09:00', checkOut: '18:00', status: 'Present', hoursWorked: 9 },
  { empId: 'EMP002', date: yesterday, checkIn: '08:50', checkOut: '18:50', status: 'Present', hoursWorked: 10 },
  { empId: 'EMP003', date: yesterday, checkIn: '09:30', checkOut: '17:30', status: 'Late', hoursWorked: 8 },
  { empId: 'EMP004', date: yesterday, checkIn: '09:00', checkOut: '18:00', status: 'Present', hoursWorked: 9 },
  { empId: 'EMP005', date: yesterday, checkIn: '09:15', checkOut: '17:15', status: 'Present', hoursWorked: 8 },
];

// ──────────────────────────────────────────────────────────────────────────────
// LEAVES
// ──────────────────────────────────────────────────────────────────────────────
export const mockLeaves: LeaveRequest[] = [
  { id: 'LV001', empId: 'EMP001', empName: 'Arjun Sharma', type: 'Annual', from: '2025-06-25', to: '2025-06-27', days: 3, reason: 'Family trip to Goa', status: 'Approved', appliedOn: '2025-06-10', approvedBy: 'Priya Nair' },
  { id: 'LV002', empId: 'EMP007', empName: 'Ananya Singh', type: 'Sick', from: '2025-06-20', to: '2025-06-21', days: 2, reason: 'Fever and viral infection', status: 'Approved', appliedOn: '2025-06-20', approvedBy: 'Rahul Mehta' },
  { id: 'LV003', empId: 'EMP009', empName: 'Meena Joshi', type: 'Maternity', from: '2025-06-01', to: '2025-08-31', days: 90, reason: 'Maternity leave', status: 'Approved', appliedOn: '2025-05-15', approvedBy: 'Rahul Mehta' },
  { id: 'LV004', empId: 'EMP004', empName: 'Sunita Rao', type: 'Casual', from: '2025-06-28', to: '2025-06-28', days: 1, reason: 'Personal work', status: 'Pending', appliedOn: '2025-06-18', approvedBy: null },
  { id: 'LV005', empId: 'EMP010', empName: 'Rohit Verma', type: 'Annual', from: '2025-07-04', to: '2025-07-07', days: 4, reason: 'Vacation', status: 'Pending', appliedOn: '2025-06-20', approvedBy: null },
  { id: 'LV006', empId: 'EMP005', empName: 'Kiran Patel', type: 'Sick', from: '2025-06-15', to: '2025-06-15', days: 1, reason: 'Doctor appointment', status: 'Rejected', appliedOn: '2025-06-14', approvedBy: 'Deepak Kumar' },
  { id: 'LV007', empId: 'EMP008', empName: 'Vijay Reddy', type: 'Casual', from: '2025-07-10', to: '2025-07-11', days: 2, reason: 'Personal commitment', status: 'Pending', appliedOn: '2025-06-22', approvedBy: null },
];

export const mockLeaveBalances: LeaveBalance[] = mockEmployees.map(emp => ({
  empId: emp.id,
  annual: 18, sick: 12, casual: 6,
  remaining: { annual: Math.floor(Math.random() * 15) + 2, sick: Math.floor(Math.random() * 10) + 1, casual: Math.floor(Math.random() * 5) + 1 },
}));

// ──────────────────────────────────────────────────────────────────────────────
// PAYROLL
// ──────────────────────────────────────────────────────────────────────────────
export const mockPayroll: PayrollEntry[] = mockEmployees.map((emp, i) => {
  const base = emp.salary;
  const hra = Math.round(base * 0.2);
  const ta = 2000;
  const da = Math.round(base * 0.05);
  const bonus = i === 0 ? 10000 : 0;
  const pf = Math.round(base * 0.12);
  const tax = Math.round(base * 0.1);
  return {
    id: `PAY${String(i + 1).padStart(3, '0')}`,
    empId: emp.id, empName: emp.name, department: emp.department,
    month: 'June 2025',
    basicSalary: base, hra, allowances: ta + da + bonus, pf, tax, deductions: 0,
    netSalary: base + hra + ta + da + bonus - pf - tax,
    status: i < 7 ? 'Paid' : 'Processing',
  };
});

// ──────────────────────────────────────────────────────────────────────────────
// RECRUITMENT
// ──────────────────────────────────────────────────────────────────────────────
export const mockRecruitment: JobPosting[] = [
  { id: 'JOB001', title: 'Senior Frontend Developer', department: 'Engineering', location: 'Bangalore', type: 'Full-time', experience: '4-7 years', salary: '₹18–25 LPA', openings: 2, applicants: 48, postedOn: '2025-06-01', status: 'Active', skills: ['React', 'TypeScript', 'GraphQL'], description: 'Build and maintain scalable web applications.' },
  { id: 'JOB002', title: 'Data Analyst', department: 'Finance', location: 'Hyderabad', type: 'Full-time', experience: '2-4 years', salary: '₹8–14 LPA', openings: 1, applicants: 32, postedOn: '2025-06-05', status: 'Active', skills: ['Python', 'SQL', 'Power BI', 'Excel'] },
  { id: 'JOB003', title: 'HR Executive', department: 'HR', location: 'Mumbai', type: 'Full-time', experience: '1-3 years', salary: '₹5–8 LPA', openings: 1, applicants: 67, postedOn: '2025-05-28', status: 'Active', skills: ['Recruitment', 'HRIS', 'Payroll'] },
  { id: 'JOB004', title: 'Sales Development Rep', department: 'Sales', location: 'Delhi', type: 'Full-time', experience: '0-2 years', salary: '₹4–7 LPA', openings: 3, applicants: 89, postedOn: '2025-05-20', status: 'Active', skills: ['Communication', 'CRM', 'Cold Calling'] },
  { id: 'JOB005', title: 'Product Designer', department: 'Engineering', location: 'Bangalore', type: 'Full-time', experience: '3-5 years', salary: '₹12–18 LPA', openings: 1, applicants: 28, postedOn: '2025-06-10', status: 'Active', skills: ['Figma', 'UI/UX', 'Prototyping'] },
  { id: 'JOB006', title: 'Marketing Intern', department: 'Marketing', location: 'Bangalore', type: 'Internship', experience: '0 years', salary: '₹15,000/mo', openings: 2, applicants: 104, postedOn: '2025-06-12', status: 'Active', skills: ['Social Media', 'Content Writing'] },
];

export const mockCandidates: Candidate[] = [
  { id: 'CND001', jobId: 'JOB001', name: 'Aditya Kumar', email: 'aditya.k@gmail.com', phone: '+91 9000111222', experience: 5, skills: ['React', 'TypeScript', 'Redux'], stage: 'Interview', status: 'Active', appliedOn: '2025-06-03', resumeScore: 87, avatar: 'AK' },
  { id: 'CND002', jobId: 'JOB001', name: 'Neha Pillai', email: 'neha.p@gmail.com', phone: '+91 9000333444', experience: 6, skills: ['React', 'GraphQL', 'Next.js'], stage: 'Technical', status: 'Active', appliedOn: '2025-06-04', resumeScore: 92, avatar: 'NP' },
  { id: 'CND003', jobId: 'JOB002', name: 'Ravi Shankar', email: 'ravi.s@gmail.com', phone: '+91 9000555666', experience: 3, skills: ['Python', 'SQL', 'Tableau'], stage: 'HR Round', status: 'Active', appliedOn: '2025-06-06', resumeScore: 79, avatar: 'RS' },
  { id: 'CND004', jobId: 'JOB003', name: 'Pooja Gupta', email: 'pooja.g@gmail.com', phone: '+91 9000777888', experience: 2, skills: ['HR', 'Payroll', 'ATS'], stage: 'Offer', status: 'Active', appliedOn: '2025-05-30', resumeScore: 83, avatar: 'PG' },
  { id: 'CND005', jobId: 'JOB001', name: 'Suresh Babu', email: 'suresh.b@gmail.com', phone: '+91 9000999000', experience: 4, skills: ['Vue.js', 'React', 'CSS'], stage: 'Screening', status: 'Rejected', appliedOn: '2025-06-02', resumeScore: 61, avatar: 'SB' },
  { id: 'CND006', jobId: 'JOB004', name: 'Lakshmi Devi', email: 'lakshmi.d@gmail.com', phone: '+91 9001112233', experience: 1, skills: ['Communication', 'Excel', 'CRM'], stage: 'Applied', status: 'Active', appliedOn: '2025-06-13', resumeScore: 74, avatar: 'LD' },
];

// ──────────────────────────────────────────────────────────────────────────────
// TRAINING
// ──────────────────────────────────────────────────────────────────────────────
export const mockTraining: TrainingProgram[] = [
  { id: 'TRN001', title: 'Advanced React & TypeScript', category: 'Technical', instructor: 'Priya Nair', startDate: '2025-07-01', endDate: '2025-07-10', duration: '40 hrs', mode: 'Online', enrolled: 12, capacity: 20, status: 'Upcoming', department: ['Engineering'], level: 'Advanced' },
  { id: 'TRN002', title: 'Effective Leadership Skills', category: 'Soft Skills', instructor: 'Rahul Mehta', startDate: '2025-06-20', endDate: '2025-06-21', duration: '16 hrs', mode: 'Offline', enrolled: 8, capacity: 15, status: 'Ongoing', department: ['HR', 'Sales', 'Marketing'], level: 'Intermediate' },
  { id: 'TRN003', title: 'GST & Compliance 2025', category: 'Finance', instructor: 'Sunita Rao', startDate: '2025-06-10', endDate: '2025-06-12', duration: '24 hrs', mode: 'Hybrid', enrolled: 10, capacity: 10, status: 'Completed', department: ['Finance'], level: 'Intermediate' },
  { id: 'TRN004', title: 'AWS Cloud Practitioner', category: 'Technical', instructor: 'Vijay Reddy', startDate: '2025-07-15', endDate: '2025-07-25', duration: '32 hrs', mode: 'Online', enrolled: 6, capacity: 25, status: 'Upcoming', department: ['Engineering'], level: 'Beginner' },
  { id: 'TRN005', title: 'HR Analytics & Reporting', category: 'HR', instructor: 'Meena Joshi', startDate: '2025-08-01', endDate: '2025-08-05', duration: '20 hrs', mode: 'Online', enrolled: 4, capacity: 12, status: 'Upcoming', department: ['HR'], level: 'Intermediate' },
];

// ──────────────────────────────────────────────────────────────────────────────
// PERFORMANCE
// ──────────────────────────────────────────────────────────────────────────────
export const mockPerformance: PerformanceReview[] = [
  { id: 'PER001', empId: 'EMP001', empName: 'Arjun Sharma', reviewerId: 'EMP002', reviewerName: 'Priya Nair', period: 'H1 2025', overallRating: 4.2, ratings: { productivity: 4.5, communication: 4.0, teamwork: 4.3, leadership: 3.8, innovation: 4.5, attendance: 4.2 }, goals: ['Migrate legacy APIs to GraphQL', 'Mentor 2 junior developers'], achievements: ['Reduced page load by 40%', 'Delivered Project Alpha on time'], areasOfImprovement: ['Documentation', 'Client communication'], status: 'Completed', date: '2025-06-15' },
  { id: 'PER002', empId: 'EMP005', empName: 'Kiran Patel', reviewerId: 'EMP006', reviewerName: 'Deepak Kumar', period: 'H1 2025', overallRating: 3.5, ratings: { productivity: 3.8, communication: 3.5, teamwork: 3.7, leadership: 2.9, innovation: 3.2, attendance: 4.2 }, goals: ['Close 20 deals Q2', 'Improve CSAT score'], achievements: ['Exceeded quota by 15%'], areasOfImprovement: ['Follow-up discipline', 'CRM usage'], status: 'Completed', date: '2025-06-14' },
  { id: 'PER003', empId: 'EMP007', empName: 'Ananya Singh', reviewerId: 'EMP003', reviewerName: 'Rahul Mehta', period: 'H1 2025', overallRating: 4.6, ratings: { productivity: 4.8, communication: 4.7, teamwork: 4.5, leadership: 4.4, innovation: 4.9, attendance: 4.5 }, goals: ['Launch brand reboot', 'Grow social following by 30%'], achievements: ['Instagram reach +45%', 'Launched 3 campaigns'], areasOfImprovement: ['Budget management'], status: 'Submitted', date: '2025-06-16' },
  { id: 'PER004', empId: 'EMP010', empName: 'Rohit Verma', reviewerId: 'EMP002', reviewerName: 'Priya Nair', period: 'H1 2025', overallRating: 3.8, ratings: { productivity: 3.9, communication: 3.6, teamwork: 4.0, leadership: 3.2, innovation: 3.8, attendance: 4.5 }, goals: ['Complete Django certification', 'Deliver 3 feature modules'], achievements: ['On-boarded within 2 months'], areasOfImprovement: ['Code review participation', 'Unit testing'], status: 'Draft', date: '2025-06-17' },
];

// ──────────────────────────────────────────────────────────────────────────────
// ASSETS
// ──────────────────────────────────────────────────────────────────────────────
export const mockAssets: Asset[] = [
  { id: 'AST001', name: 'MacBook Pro 14"', category: 'Laptop', serialNo: 'C02X1234ABC', brand: 'Apple', value: 185000, condition: 'Excellent', assignedName: 'Arjun Sharma', assignedTo: 'EMP001', status: 'Assigned', location: 'Bangalore', assignedOn: '2023-01-10' },
  { id: 'AST002', name: 'Dell XPS 15', category: 'Laptop', serialNo: 'DLXPS5678', brand: 'Dell', value: 120000, condition: 'Good', assignedName: 'Priya Nair', assignedTo: 'EMP002', status: 'Assigned', location: 'Bangalore', assignedOn: '2022-08-15' },
  { id: 'AST003', name: 'iPhone 15 Pro', category: 'Mobile', serialNo: 'IPH15PRO9012', brand: 'Apple', value: 134900, condition: 'Excellent', assignedName: 'Deepak Kumar', assignedTo: 'EMP006', status: 'Assigned', location: 'Delhi', assignedOn: '2023-11-01' },
  { id: 'AST004', name: 'HP EliteBook 840', category: 'Laptop', serialNo: 'HP840G8-3456', brand: 'HP', value: 85000, condition: 'Good', assignedName: null, assignedTo: null, status: 'Available', location: 'Mumbai', assignedOn: null },
  { id: 'AST005', name: 'LG 27" 4K Monitor', category: 'Monitor', serialNo: 'LG27UL5-7890', brand: 'LG', value: 45000, condition: 'Good', assignedName: 'Rohit Verma', assignedTo: 'EMP010', status: 'Assigned', location: 'Bangalore', assignedOn: '2023-03-01' },
  { id: 'AST006', name: 'Lenovo ThinkPad X1', category: 'Laptop', serialNo: 'TP-X1C10-1234', brand: 'Lenovo', value: 100000, condition: 'Repair', assignedName: null, assignedTo: null, status: 'Repair', location: 'Bangalore', assignedOn: null },
];

// ──────────────────────────────────────────────────────────────────────────────
// TRAVEL & EXPENSES
// ──────────────────────────────────────────────────────────────────────────────
export const mockTravel: TravelRequest[] = [
  { id: 'TRV001', empId: 'EMP006', empName: 'Deepak Kumar', purpose: 'Client meeting – Infosys', destination: 'Pune', from: '2025-06-25', to: '2025-06-26', mode: 'Air', estimatedCost: 12500, status: 'Approved', approvedBy: 'Rahul Mehta' },
  { id: 'TRV002', empId: 'EMP001', empName: 'Arjun Sharma', purpose: 'Tech Conference 2025', destination: 'Delhi', from: '2025-07-10', to: '2025-07-12', mode: 'Air', estimatedCost: 18000, status: 'Pending' },
  { id: 'TRV003', empId: 'EMP004', empName: 'Sunita Rao', purpose: 'Audit – Regional Office', destination: 'Chennai', from: '2025-07-01', to: '2025-07-03', mode: 'Train', estimatedCost: 7500, status: 'Pending' },
  { id: 'TRV004', empId: 'EMP007', empName: 'Ananya Singh', purpose: 'Marketing Summit', destination: 'Mumbai', from: '2025-06-18', to: '2025-06-19', mode: 'Air', estimatedCost: 14000, status: 'Completed', approvedBy: 'Rahul Mehta' },
];

export const mockExpenses: ExpenseClaim[] = [
  { id: 'EXP001', empId: 'EMP006', empName: 'Deepak Kumar', category: 'Travel', amount: 11800, date: '2025-06-26', description: 'Air ticket + taxi for Pune client visit', status: 'Approved', approvedBy: 'Rahul Mehta' },
  { id: 'EXP002', empId: 'EMP007', empName: 'Ananya Singh', category: 'Meals', amount: 2450, date: '2025-06-19', description: 'Team lunch during Marketing Summit', status: 'Reimbursed', approvedBy: 'Rahul Mehta' },
  { id: 'EXP003', empId: 'EMP001', empName: 'Arjun Sharma', category: 'Office Supplies', amount: 1200, date: '2025-06-10', description: 'Laptop stand and cables', status: 'Pending' },
  { id: 'EXP004', empId: 'EMP010', empName: 'Rohit Verma', category: 'Training', amount: 5000, date: '2025-06-05', description: 'Udemy Python certification course', status: 'Approved', approvedBy: 'Priya Nair' },
];

// ──────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ──────────────────────────────────────────────────────────────────────────────
export const mockProjects: Project[] = [
  { id: 'PRJ001', name: 'HRMS Platform v2.0', client: 'Internal', manager: 'Priya Nair', team: ['Arjun Sharma', 'Vijay Reddy', 'Rohit Verma'], startDate: '2025-01-01', deadline: '2025-08-31', budget: 1500000, spent: 820000, progress: 68, status: 'Active', priority: 'Critical', tags: ['React', 'TypeScript', 'AWS'] },
  { id: 'PRJ002', name: 'ERP Integration – Infosys', client: 'Infosys', manager: 'Deepak Kumar', team: ['Kiran Patel', 'Ananya Singh'], startDate: '2025-03-15', deadline: '2025-07-15', budget: 3000000, spent: 2100000, progress: 82, status: 'Active', priority: 'High', tags: ['SAP', 'API', 'Integration'] },
  { id: 'PRJ003', name: 'Brand Refresh Campaign', client: 'Internal', manager: 'Ananya Singh', team: ['Ananya Singh'], startDate: '2025-05-01', deadline: '2025-06-30', budget: 500000, spent: 480000, progress: 95, status: 'Active', priority: 'Medium', tags: ['Marketing', 'Design'] },
  { id: 'PRJ004', name: 'Payroll Automation', client: 'Internal', manager: 'Sunita Rao', team: ['Sunita Rao', 'Rohit Verma'], startDate: '2024-11-01', deadline: '2025-03-31', budget: 800000, spent: 800000, progress: 100, status: 'Completed', priority: 'High', tags: ['Finance', 'Automation'] },
];

// ──────────────────────────────────────────────────────────────────────────────
// POLICIES
// ──────────────────────────────────────────────────────────────────────────────
export const mockPolicies: PolicyDocument[] = [
  { id: 'POL001', title: 'Code of Conduct & Ethics', category: 'Compliance', description: 'Standards of professional behavior expected from all employees.', version: 'v3.2', publishedOn: '2023-01-01', updatedOn: '2025-01-01', author: 'Rahul Mehta', fileSize: '2.4 MB', status: 'Active', applicableTo: ['All'] },
  { id: 'POL002', title: 'Leave & Attendance Policy', category: 'HR', description: 'Guidelines for leave types, application process, and attendance tracking.', version: 'v2.1', publishedOn: '2022-06-01', updatedOn: '2025-01-15', author: 'Meena Joshi', fileSize: '1.8 MB', status: 'Active', applicableTo: ['All'] },
  { id: 'POL003', title: 'Remote Work Policy', category: 'HR', description: 'Rules and expectations for employees working remotely.', version: 'v1.5', publishedOn: '2021-04-01', updatedOn: '2024-09-01', author: 'Rahul Mehta', fileSize: '1.2 MB', status: 'Active', applicableTo: ['Engineering', 'Marketing'] },
  { id: 'POL004', title: 'Data Privacy & Security', category: 'Compliance', description: 'Policies for handling sensitive company and customer data.', version: 'v4.0', publishedOn: '2020-05-20', updatedOn: '2025-03-01', author: 'Vijay Reddy', fileSize: '3.1 MB', status: 'Active', applicableTo: ['All'] },
  { id: 'POL005', title: 'Travel & Expense Reimbursement', category: 'Finance', description: 'Procedures and limits for business travel and expense claims.', version: 'v2.0', publishedOn: '2023-07-01', updatedOn: '2024-12-01', author: 'Sunita Rao', fileSize: '1.5 MB', status: 'Active', applicableTo: ['All'] },
  { id: 'POL006', title: 'Performance Review Framework', category: 'HR', description: 'Criteria and schedule for employee performance evaluations.', version: 'v1.8', publishedOn: '2022-01-01', updatedOn: '2025-02-01', author: 'Rahul Mehta', fileSize: '2.0 MB', status: 'Active', applicableTo: ['All'] },
];

// ──────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────────────────────────
export const mockNotifications: NotificationBroadcast[] = [
  { id: 'NOT001', title: 'Payroll Processed – June 2025', message: 'June 2025 salary has been credited to all active employees. Check payslips in the Payroll module.', type: 'success', targetRoles: ['all'], createdAt: '2025-06-25 09:00', createdBy: 'Sunita Rao', read: false, category: 'Payroll' },
  { id: 'NOT002', title: 'New HR Policy Update', message: 'The Work From Home policy has been updated effective July 1, 2025. Please review the updated document.', type: 'info', targetRoles: ['all'], createdAt: '2025-06-23 14:30', createdBy: 'Rahul Mehta', read: false, category: 'Policy' },
  { id: 'NOT003', title: 'Performance Review Deadline', message: 'H1 2025 performance reviews must be submitted by June 30. Managers please ensure timely completion.', type: 'warning', targetRoles: ['manager', 'admin'], createdAt: '2025-06-20 11:00', createdBy: 'Rahul Mehta', read: false, category: 'HR' },
  { id: 'NOT004', title: 'System Maintenance Window', message: 'HRMS will be unavailable on June 29, 2025 from 2:00 AM–4:00 AM IST for scheduled maintenance.', type: 'warning', targetRoles: ['all'], createdAt: '2025-06-18 16:00', createdBy: 'System', read: true, category: 'System' },
  { id: 'NOT005', title: 'Independence Day Holiday', message: 'August 15, 2025 (Friday) is a national holiday. The office will remain closed.', type: 'info', targetRoles: ['all'], createdAt: '2025-06-15 09:00', createdBy: 'Rahul Mehta', read: true, category: 'Event' },
  { id: 'NOT006', title: 'Pending Leave Approvals', message: '3 leave requests are pending your approval. Please review and action them at the earliest.', type: 'warning', targetRoles: ['manager', 'admin'], createdAt: '2025-06-22 08:00', createdBy: 'System', read: false, category: 'Leave' },
];

// ──────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITIES
// ──────────────────────────────────────────────────────────────────────────────
export const recentActivities: RecentActivity[] = [
  { id: 'ACT001', type: 'leave', message: 'Arjun Sharma applied for Annual Leave (Jun 25–27)', time: '2 hours ago', user: 'Arjun Sharma', avatar: 'AS' },
  { id: 'ACT002', type: 'attendance', message: 'Priya Nair clocked in at 08:55 AM', time: '4 hours ago', user: 'Priya Nair', avatar: 'PN' },
  { id: 'ACT003', type: 'recruitment', message: 'New candidate Neha Pillai moved to Technical round', time: '5 hours ago', user: 'Meena Joshi', avatar: 'MJ' },
  { id: 'ACT004', type: 'payroll', message: 'June 2025 payroll processed for 10 employees', time: '1 day ago', user: 'Sunita Rao', avatar: 'SR' },
  { id: 'ACT005', type: 'performance', message: 'Ananya Singh\'s performance review submitted', time: '1 day ago', user: 'Rahul Mehta', avatar: 'RM' },
  { id: 'ACT006', type: 'asset', message: 'MacBook Pro assigned to Arjun Sharma', time: '2 days ago', user: 'Admin', avatar: 'AD' },
  { id: 'ACT007', type: 'training', message: 'Advanced React training enrollment opened – 12 enrolled', time: '3 days ago', user: 'Priya Nair', avatar: 'PN' },
  { id: 'ACT008', type: 'employee', message: 'Rohit Verma profile updated', time: '3 days ago', user: 'Rahul Mehta', avatar: 'RM' },
];

// ──────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────
export const mockUsers: UserAccount[] = [
  { id: 'USR001', name: 'Rahul Mehta', email: 'admin@sevendor.com', role: 'admin', empId: 'EMP003', department: 'HR', status: 'Active', lastActive: '2025-06-25 09:30', permissions: ['all'], mfaEnabled: true, createdAt: '2018-01-10' },
  { id: 'USR002', name: 'Priya Nair', email: 'priya.nair@sevendor.com', role: 'manager', empId: 'EMP002', department: 'Engineering', status: 'Active', lastActive: '2025-06-25 08:55', permissions: ['employees', 'attendance', 'leaves', 'performance', 'projects'], mfaEnabled: false, createdAt: '2019-07-01' },
  { id: 'USR003', name: 'Arjun Sharma', email: 'employee@sevendor.com', role: 'employee', empId: 'EMP001', department: 'Engineering', status: 'Active', lastActive: '2025-06-25 09:02', permissions: ['self-service', 'attendance', 'leaves'], mfaEnabled: false, createdAt: '2021-03-15' },
  { id: 'USR004', name: 'Sunita Rao', email: 'sunita.rao@sevendor.com', role: 'finance', empId: 'EMP004', department: 'Finance', status: 'Active', lastActive: '2025-06-24 17:30', permissions: ['payroll', 'expenses', 'travel'], mfaEnabled: true, createdAt: '2020-02-20' },
  { id: 'USR005', name: 'Meena Joshi', email: 'meena.joshi@sevendor.com', role: 'hr', empId: 'EMP009', department: 'HR', status: 'Inactive', lastActive: '2025-06-01 10:00', permissions: ['employees', 'leaves', 'recruitment', 'training'], mfaEnabled: false, createdAt: '2023-03-01' },
  { id: 'USR006', name: 'Deepak Kumar', email: 'deepak.kumar@sevendor.com', role: 'manager', empId: 'EMP006', department: 'Sales', status: 'Active', lastActive: '2025-06-25 07:45', permissions: ['employees', 'attendance', 'leaves', 'recruitment'], mfaEnabled: false, createdAt: '2020-09-15' },
];

// ──────────────────────────────────────────────────────────────────────────────
// OKRs / GOALS
// ──────────────────────────────────────────────────────────────────────────────
export const mockOkrs: GoalOkr[] = [
  {
    id: 'OKR001', title: 'Achieve ₹50 Cr ARR', owner: 'Rahul Mehta', ownerDept: 'Leadership', quarter: 'Q2', year: 2025, type: 'Company', progress: 78, status: 'Active', dueDate: '2025-06-30',
    keyResults: [
      { id: 'KR001', title: 'Close 40 enterprise deals', target: 40, current: 31, unit: 'deals', progress: 77, status: 'On Track' },
      { id: 'KR002', title: 'Reduce churn below 5%', target: 5, current: 6.2, unit: '%', progress: 60, status: 'At Risk' },
      { id: 'KR003', title: 'Launch 2 new market verticals', target: 2, current: 2, unit: 'verticals', progress: 100, status: 'Completed' },
    ],
  },
  {
    id: 'OKR002', title: 'Improve Engineering Velocity', owner: 'Priya Nair', ownerDept: 'Engineering', quarter: 'Q2', year: 2025, type: 'Department', progress: 65, status: 'Active', dueDate: '2025-06-30',
    keyResults: [
      { id: 'KR004', title: 'Deploy 15 features to production', target: 15, current: 10, unit: 'features', progress: 67, status: 'On Track' },
      { id: 'KR005', title: 'Reduce bug backlog by 60%', target: 60, current: 42, unit: '%', progress: 70, status: 'On Track' },
      { id: 'KR006', title: 'Achieve 90% test coverage', target: 90, current: 72, unit: '%', progress: 80, status: 'At Risk' },
    ],
  },
  {
    id: 'OKR003', title: 'Build World-Class Talent', owner: 'Rahul Mehta', ownerDept: 'HR', quarter: 'Q2', year: 2025, type: 'Department', progress: 55, status: 'At Risk', dueDate: '2025-06-30',
    keyResults: [
      { id: 'KR007', title: 'Hire 8 engineers', target: 8, current: 3, unit: 'hires', progress: 37, status: 'Behind' },
      { id: 'KR008', title: 'Complete Q2 performance reviews', target: 10, current: 7, unit: 'reviews', progress: 70, status: 'On Track' },
      { id: 'KR009', title: 'Training completion rate 80%', target: 80, current: 68, unit: '%', progress: 85, status: 'On Track' },
    ],
  },
  {
    id: 'OKR004', title: 'Drive Digital Marketing Growth', owner: 'Ananya Singh', ownerDept: 'Marketing', quarter: 'Q2', year: 2025, type: 'Individual', progress: 88, status: 'Active', dueDate: '2025-06-30',
    keyResults: [
      { id: 'KR010', title: 'Grow organic traffic by 50%', target: 50, current: 47, unit: '%', progress: 94, status: 'On Track' },
      { id: 'KR011', title: 'Generate 500 MQLs', target: 500, current: 432, unit: 'leads', progress: 86, status: 'On Track' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// SHIFTS / ROSTER
// ──────────────────────────────────────────────────────────────────────────────
export const mockShifts: ShiftRoster[] = [
  {
    id: 'SHF001', week: '2025-06-23 to 2025-06-29', department: 'Engineering', publishedBy: 'Priya Nair', publishedOn: '2025-06-20', status: 'Published',
    slots: [
      { empId: 'EMP001', empName: 'Arjun Sharma', department: 'Engineering', shift: 'Morning', startTime: '09:00', endTime: '18:00' },
      { empId: 'EMP002', empName: 'Priya Nair', department: 'Engineering', shift: 'Morning', startTime: '09:00', endTime: '18:00' },
      { empId: 'EMP008', empName: 'Vijay Reddy', department: 'Engineering', shift: 'Evening', startTime: '14:00', endTime: '23:00' },
      { empId: 'EMP010', empName: 'Rohit Verma', department: 'Engineering', shift: 'Morning', startTime: '09:00', endTime: '18:00' },
    ],
  },
  {
    id: 'SHF002', week: '2025-06-23 to 2025-06-29', department: 'HR', publishedBy: 'Rahul Mehta', publishedOn: '2025-06-20', status: 'Published',
    slots: [
      { empId: 'EMP003', empName: 'Rahul Mehta', department: 'HR', shift: 'Morning', startTime: '09:00', endTime: '18:00' },
      { empId: 'EMP009', empName: 'Meena Joshi', department: 'HR', shift: 'Off', startTime: '--', endTime: '--' },
    ],
  },
  {
    id: 'SHF003', week: '2025-06-30 to 2025-07-06', department: 'Engineering', publishedBy: 'Priya Nair', publishedOn: '2025-06-25', status: 'Draft',
    slots: [
      { empId: 'EMP001', empName: 'Arjun Sharma', department: 'Engineering', shift: 'Morning', startTime: '09:00', endTime: '18:00' },
      { empId: 'EMP008', empName: 'Vijay Reddy', department: 'Engineering', shift: 'Morning', startTime: '09:00', endTime: '18:00' },
      { empId: 'EMP010', empName: 'Rohit Verma', department: 'Engineering', shift: 'Evening', startTime: '14:00', endTime: '23:00' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// OFFBOARDING
// ──────────────────────────────────────────────────────────────────────────────
export const mockOffboardings: OffboardingClearance[] = [
  {
    id: 'OFF001', empId: 'EMP009', empName: 'Meena Joshi', department: 'HR', designation: 'Talent Acquisition Specialist', lastWorkingDay: '2025-08-31', reason: 'Resignation', status: 'In Progress', exitInterviewDone: false, noDueCertificate: false, initiatedOn: '2025-06-01',
    clearanceStatus: { IT: 'Pending', Finance: 'Approved', HR: 'Pending', Admin: 'Pending', Manager: 'Approved' },
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ──────────────────────────────────────────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
  { id: 'AUD001', timestamp: '2025-06-25 09:30', user: 'Rahul Mehta', action: 'User Login', details: 'Admin logged in via admin@sevendor.com' },
  { id: 'AUD002', timestamp: '2025-06-25 09:05', user: 'System', action: 'Payroll Processed', details: 'June 2025 payroll for 10 employees – ₹8.55L total' },
  { id: 'AUD003', timestamp: '2025-06-24 17:30', user: 'Rahul Mehta', action: 'Leave Approved', details: 'Leave LV001 approved for Arjun Sharma' },
  { id: 'AUD004', timestamp: '2025-06-24 15:00', user: 'Priya Nair', action: 'Performance Submitted', details: 'Performance review PER003 submitted for Ananya Singh' },
  { id: 'AUD005', timestamp: '2025-06-23 11:20', user: 'Sunita Rao', action: 'Expense Approved', details: 'Expense EXP001 approved for Deepak Kumar – ₹11,800' },
  { id: 'AUD006', timestamp: '2025-06-22 10:00', user: 'Rahul Mehta', action: 'Policy Published', details: 'Policy POL003 (Remote Work) updated to v1.5' },
];

// ──────────────────────────────────────────────────────────────────────────────
// DEPARTMENTS & DESIGNATIONS (used by Employees, Recruitment, Projects forms)
// ──────────────────────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  'Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Design', 'Legal',
];

export const DESIGNATIONS: Record<string, string[]> = {
  Engineering: ['Junior Developer', 'Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager', 'VP Engineering', 'DevOps Engineer', 'QA Engineer'],
  HR: ['HR Executive', 'Talent Acquisition Specialist', 'HR Manager', 'HR Director', 'HRBP'],
  Finance: ['Accountant', 'Finance Analyst', 'Finance Manager', 'CFO'],
  Sales: ['Sales Executive', 'Sales Development Rep', 'Account Executive', 'Sales Manager', 'VP Sales'],
  Marketing: ['Marketing Executive', 'Digital Marketing Lead', 'Content Writer', 'Marketing Manager', 'CMO'],
  Operations: ['Operations Executive', 'Operations Manager', 'Business Analyst', 'COO'],
  Design: ['UI Designer', 'UX Researcher', 'Product Designer', 'Design Lead'],
  Legal: ['Legal Intern', 'Legal Counsel', 'General Counsel'],
};

// ──────────────────────────────────────────────────────────────────────────────
// CHART DATA (used by Dashboard and Reports pages)
// ──────────────────────────────────────────────────────────────────────────────
export const chartData = {
  attendanceTrend: [
    { month: 'Jan', present: 92, absent: 8 },
    { month: 'Feb', present: 88, absent: 12 },
    { month: 'Mar', present: 95, absent: 5 },
    { month: 'Apr', present: 90, absent: 10 },
    { month: 'May', present: 87, absent: 13 },
    { month: 'Jun', present: 93, absent: 7 },
  ],
  departmentDistribution: [
    { name: 'Engineering', value: 4, color: '#7c3aed' },
    { name: 'HR', value: 2, color: '#0ea5e9' },
    { name: 'Finance', value: 1, color: '#10b981' },
    { name: 'Sales', value: 2, color: '#f59e0b' },
    { name: 'Marketing', value: 1, color: '#ec4899' },
  ],
  payrollTrend: [
    { month: 'Jan', amount: 820000 },
    { month: 'Feb', amount: 835000 },
    { month: 'Mar', amount: 840000 },
    { month: 'Apr', amount: 855000 },
    { month: 'May', amount: 860000 },
    { month: 'Jun', amount: 878000 },
  ],
  leaveTrend: [
    { month: 'Jan', annual: 12, sick: 5, casual: 3 },
    { month: 'Feb', annual: 8, sick: 9, casual: 2 },
    { month: 'Mar', annual: 15, sick: 4, casual: 5 },
    { month: 'Apr', annual: 10, sick: 6, casual: 4 },
    { month: 'May', annual: 18, sick: 3, casual: 6 },
    { month: 'Jun', annual: 7, sick: 8, casual: 2 },
  ],
  headcountGrowth: [
    { year: '2020', count: 12 },
    { year: '2021', count: 20 },
    { year: '2022', count: 35 },
    { year: '2023', count: 52 },
    { year: '2024', count: 78 },
    { year: '2025', count: 95 },
  ],
  ratingsDistribution: [
    { rating: '1.0–2.0', count: 0 },
    { rating: '2.0–3.0', count: 1 },
    { rating: '3.0–3.5', count: 2 },
    { rating: '3.5–4.0', count: 3 },
    { rating: '4.0–4.5', count: 3 },
    { rating: '4.5–5.0', count: 1 },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// LEAVE BALANCES (used by LeaveManagement page)
// ──────────────────────────────────────────────────────────────────────────────
export { mockLeaveBalances as leaveBalances };

// ──────────────────────────────────────────────────────────────────────────────
// ORG CHART (hierarchical tree for OrgChart page)
// ──────────────────────────────────────────────────────────────────────────────
export const orgChartData = {
  id: 'EMP003',
  name: 'Rahul Mehta',
  designation: 'HR Director',
  department: 'HR',
  avatar: 'RM',
  children: [
    {
      id: 'EMP002',
      name: 'Priya Nair',
      designation: 'Engineering Manager',
      department: 'Engineering',
      avatar: 'PN',
      children: [
        {
          id: 'EMP001',
          name: 'Arjun Sharma',
          designation: 'Senior Software Engineer',
          department: 'Engineering',
          avatar: 'AS',
          children: [
            { id: 'EMP010', name: 'Rohit Verma', designation: 'Junior Developer', department: 'Engineering', avatar: 'RV', children: [] },
          ],
        },
        { id: 'EMP008', name: 'Vijay Reddy', designation: 'DevOps Engineer', department: 'Engineering', avatar: 'VR', children: [] },
      ],
    },
    {
      id: 'EMP004',
      name: 'Sunita Rao',
      designation: 'Finance Manager',
      department: 'Finance',
      avatar: 'SR',
      children: [],
    },
    {
      id: 'EMP006',
      name: 'Deepak Kumar',
      designation: 'Sales Manager',
      department: 'Sales',
      avatar: 'DK',
      children: [
        { id: 'EMP005', name: 'Kiran Patel', designation: 'Sales Executive', department: 'Sales', avatar: 'KP', children: [] },
      ],
    },
    {
      id: 'EMP007',
      name: 'Ananya Singh',
      designation: 'Digital Marketing Lead',
      department: 'Marketing',
      avatar: 'AS',
      children: [],
    },
    {
      id: 'EMP009',
      name: 'Meena Joshi',
      designation: 'Talent Acquisition Specialist',
      department: 'HR',
      avatar: 'MJ',
      children: [],
    },
  ],
};
