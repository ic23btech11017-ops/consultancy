import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Globe,
  Moon,
} from 'lucide-react';

const BRANCHES = ['Hyderabad', 'Kolkata', 'Delhi'];
const ROLES = ['Admin', 'Counselor', 'Finance Manager', 'Visa Officer'];

const MyProfile: React.FC = () => {
  // Profile fields
  const [fullName, setFullName] = useState('Aarav Kumar');
  const [email, setEmail] = useState('aarav@kalnet.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [role, setRole] = useState('Admin');
  const [branch, setBranch] = useState('Hyderabad');
  const [bio, setBio] = useState('Managing student admissions, counseling pipelines and operations at KALNET');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password fields
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Preferences
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);
  const [notifLeads, setNotifLeads] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifBatches, setNotifBatches] = useState(false);

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const inputCls = 'w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all duration-200';
  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    if (newPwd.length < 8) { setPwdError('Password must be at least 8 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('New passwords do not match.'); return; }
    setPwdSaved(true);
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const ToggleRow: React.FC<{ label: string; sub: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, sub, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${value ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="My Profile" subtitle="Manage your personal information, password and notification preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Avatar card */}
        <Card className="flex flex-col items-center gap-4 py-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg select-none">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Online
            </span>
          </div>
          <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2 px-2"><Mail className="w-4 h-4 text-gray-400" />{email}</div>
            <div className="flex items-center gap-2 px-2"><Phone className="w-4 h-4 text-gray-400" />{phone}</div>
            <div className="flex items-center gap-2 px-2"><MapPin className="w-4 h-4 text-gray-400" />{branch}</div>
            <div className="flex items-center gap-2 px-2"><Globe className="w-4 h-4 text-gray-400" />kalnet.in</div>
          </div>
        </Card>

        {/* Right — Edit form + password + preferences */}
        <div className="lg:col-span-2 space-y-6">

          {/* Edit Profile */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Branch</label>
                  <select value={branch} onChange={e => setBranch(e.target.value)} className={inputCls}>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className={inputCls} />
              </div>
              <div className="flex items-center justify-end gap-3 pt-1">
                {profileSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />Profile saved
                  </span>
                )}
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                  <Save className="w-4 h-4" />Save Changes
                </button>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: 'Current Password', value: currentPwd, setter: setCurrentPwd, show: showCurrent, toggleShow: () => setShowCurrent(v => !v) },
                { label: 'New Password', value: newPwd, setter: setNewPwd, show: showNew, toggleShow: () => setShowNew(v => !v) },
                { label: 'Confirm New Password', value: confirmPwd, setter: setConfirmPwd, show: showConfirm, toggleShow: () => setShowConfirm(v => !v) },
              ].map(({ label, value, setter, show, toggleShow }) => (
                <div key={label}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <input
                      required
                      type={show ? 'text' : 'password'}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      className={`${inputCls} pr-10`}
                    />
                    <button type="button" onClick={toggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
              <div className="flex items-center justify-end gap-3 pt-1">
                {pwdSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />Password updated
                  </span>
                )}
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                  <Shield className="w-4 h-4" />Update Password
                </button>
              </div>
            </form>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
            </div>
            <div>
              <ToggleRow label="Email Notifications" sub="Receive updates via email" value={notifEmail} onChange={setNotifEmail} />
              <ToggleRow label="In-App Notifications" sub="Show alerts inside the app" value={notifApp} onChange={setNotifApp} />
              <ToggleRow label="New Leads & Walk-ins" sub="Notify when a new lead is added" value={notifLeads} onChange={setNotifLeads} />
              <ToggleRow label="Payment Alerts" sub="Notify on new payments received" value={notifPayments} onChange={setNotifPayments} />
              <ToggleRow label="Batch Reminders" sub="Notify before a batch starts" value={notifBatches} onChange={setNotifBatches} />
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;
