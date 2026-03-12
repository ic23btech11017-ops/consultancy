import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, Search, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ collapsed, onToggleCollapse }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    const name = path.substring(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return name;
  };

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

        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer transition-colors duration-300"></div>
      </div>
    </header>
  );
};
