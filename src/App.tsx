import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HrmsProvider, useHrms } from './context/HrmsContext';
import DashboardLayout from './layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import LeaveManagement from './pages/LeaveManagement';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Training from './pages/Training';
import Performance from './pages/Performance';
import SelfService from './pages/SelfService';
import Notifications from './pages/Notifications';
import HelpSupport from './pages/HelpSupport';
import Assets from './pages/Assets';
import TravelExpenses from './pages/TravelExpenses';
import Projects from './pages/Projects';
import Compliance from './pages/Compliance';
import OrgChart from './pages/OrgChart';
import UserManagement from './pages/UserManagement';
import GoalsOkrs from './pages/GoalsOkrs';
import ShiftRoster from './pages/ShiftRoster';
import Offboarding from './pages/Offboarding';
import AuditLog from './pages/AuditLog';
import type { ReactNode } from 'react';

function Protected({ children }: { children: ReactNode }) {
  const { user } = useHrms();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useHrms();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={
        <Protected>
          <DashboardLayout />
        </Protected>
      }>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<LeaveManagement />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="training" element={<Training />} />
        <Route path="performance" element={<Performance />} />
        <Route path="goals" element={<GoalsOkrs />} />
        <Route path="assets" element={<Assets />} />
        <Route path="travel" element={<TravelExpenses />} />
        <Route path="projects" element={<Projects />} />
        <Route path="shifts" element={<ShiftRoster />} />
        <Route path="offboarding" element={<Offboarding />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="org-chart" element={<OrgChart />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="self-service" element={<SelfService />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<HelpSupport />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HrmsProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HrmsProvider>
  );
}
