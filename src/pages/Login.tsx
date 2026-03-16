import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Globe, GraduationCap, Users, Plane, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid email or password');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#0f172a]">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Soft glow accent */}
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-sky-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute -top-40 -right-40 w-[350px] h-[350px] bg-sky-500/[0.05] rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center gap-8 w-full min-h-full px-16 py-12 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <span className="text-white text-lg font-semibold tracking-tight">KALNET</span>
          </div>

          {/* Hero */}
          <div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">
              The Digital Operating System for Modern Enterprises
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Manage students, applications, visa processing, and partner institutions — all from one powerful dashboard.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: GraduationCap, label: 'Student & Counseling Management' },
              { icon: Globe, label: 'Application Tracking & Processing' },
              { icon: Plane, label: 'End-to-end Visa Processing' },
              { icon: Users, label: 'Partner Institution Network' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/[0.05]">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-sky-400" />
                </div>
                <span className="text-slate-300 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 pt-2">
            {[
              { value: '15+', label: 'Modules' },
              { value: '5+', label: 'Institutions' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white text-xl font-bold">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0a0a] px-6 py-12 relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500 text-white text-lg font-bold mb-3">
              K
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">KALNET ERP</h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <div className={shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#141414] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-sky-500 focus:ring-sky-500 dark:bg-[#141414]" />
                  <span className="text-gray-500 dark:text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={17} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-10">
            &copy; {new Date().getFullYear()} KALNET. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
