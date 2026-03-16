import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Search, PanelLeftClose, PanelLeft, Check, Users, CreditCard, GraduationCap, CalendarClock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const NOTIFICATIONS = [
  { id: 1, icon: Users, color: 'blue', message: 'New walk-in enquiry from Rohan Sharma', time: '5m ago', unread: true },
  { id: 2, icon: CreditCard, color: 'emerald', message: 'Payment of ₹45,000 received from Priya Patel', time: '1h ago', unread: true },
  { id: 3, icon: CalendarClock, color: 'indigo', message: 'IELTS Batch A starts tomorrow at 9:00 AM', time: '3h ago', unread: true },
  { id: 4, icon: GraduationCap, color: 'purple', message: 'Meera Nair completed IELTS prep — score 7.5', time: '1d ago', unread: false },
];

export const Topbar: React.FC<TopbarProps> = ({ collapsed, onToggleCollapse }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    const name = path.substring(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return name;
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 dark:text-gray-100"
          />
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 transition-all duration-300 rotate-0 scale-100" />
          ) : (
            <Sun className="w-5 h-5 transition-all duration-300 rotate-0 scale-100 text-yellow-500" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-gray-900 leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Check className="w-3 h-3" />Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${n.unread ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}
                    onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                  >
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-${n.color}-100 dark:bg-${n.color}-900/30`}>
                      <n.icon className={`w-4 h-4 text-${n.color}-600 dark:text-${n.color}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${n.unread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                        {n.message}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold select-none shadow-sm">
              AK
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight">Aarav Kumar</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Admin</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 border border-white dark:border-gray-900 -ml-1 mt-3 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Aarav Kumar</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">aarav@kalnet.in</p>
              </div>
              <div className="py-1">
                {[
                  { label: 'My Profile', path: '/my-profile' },
                  { label: 'Settings', path: '/settings' },
                  { label: 'Help & Support', path: '/help-support' },
                ].map((item) => (
                  <button key={item.label} onClick={() => { navigate(item.path); setShowProfile(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors duration-150">
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
