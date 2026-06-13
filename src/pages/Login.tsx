import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrms } from '../context/HrmsContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function Login() {
  const { login } = useHrms();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 4) e.password = 'Minimum 4 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setApiError('');
    // Simulate a brief network delay
    await new Promise(r => setTimeout(r, 800));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/');
    else setApiError(result.message || 'An error occurred');
  };

  const quickFill = (role: string) => {
    if (role === 'admin') setForm(f => ({ ...f, email: 'admin@sevendor.com', password: 'admin123' }));
    else setForm(f => ({ ...f, email: 'employee@sevendor.com', password: 'emp123' }));
    setErrors({});
    setApiError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-4xl mx-4 flex rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/50 animate-scale-in">
        {/* Left panel — brand */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 p-10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
              <img src={logo} alt="SevenDor Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-lg">SevenDor</p>
              <p className="text-xs text-violet-200">HRMS Portal</p>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Manage Your <br /><span className="text-violet-200">Workforce</span><br /> Smarter
            </h1>
            <p className="text-violet-200 text-sm leading-relaxed mb-8">
              A modern, unified platform for all your HR needs — from attendance tracking to payroll processing, recruitment, and performance reviews.
            </p>
            <div className="space-y-3">
              {['Employees & Payroll', 'Leave & Attendance', 'Recruitment & Training', 'Performance Reviews'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-violet-100">
                  <CheckCircle size={16} className="text-violet-300 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-violet-300">Innovate. Build. Deliver. © 2024</p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 bg-white/10 backdrop-blur-2xl border-l border-white/10 p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                <img src={logo} alt="SevenDor Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-white">SevenDor HRMS</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-300 mb-6">Sign in to continue to your dashboard</p>

            {/* Quick fill buttons */}
            <div className="flex gap-2 mb-6">
              <button type="button" onClick={() => quickFill('admin')} className="flex-1 py-2 rounded-xl text-xs font-semibold border border-violet-400/30 text-violet-300 hover:bg-violet-500/20 transition-colors">
                👤 Admin Login
              </button>
              <button type="button" onClick={() => quickFill('employee')} className="flex-1 py-2 rounded-xl text-xs font-semibold border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/20 transition-colors">
                👤 Employee Login
              </button>
            </div>

            {/* Error alert */}
            {apiError && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@sevendor.com"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/10 border ${errors.password ? 'border-red-400' : 'border-white/20'} text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-violet-500 focus:ring-violet-500"
                  />
                  <span className="text-xs text-slate-300">Remember me</span>
                </label>
                <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-xs text-center text-slate-400 mt-6">
              Demo: <span className="text-violet-400">admin@sevendor.com</span> / <span className="text-violet-400">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
