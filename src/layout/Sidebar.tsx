import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  FileText, 
  Plane, 
  Wallet, 
  Handshake, 
  BarChart3, 
  Settings,
  GraduationCap,
  GitBranch,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Counseling Pipeline', href: '/counseling', icon: GitBranch },
  { name: 'Students', href: '/students', icon: UserRound },
  { name: 'Test Preparation', href: '/test-preparation', icon: GraduationCap },
  { name: 'Applications', href: '/applications', icon: FileText },
  { name: 'Visa Processing', href: '/visa-processing', icon: Plane },
  { name: 'Finance', href: '/finance', icon: Wallet },
  { name: 'Partners', href: '/partners', icon: Handshake },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <div className={`fixed left-0 top-0 h-full ${collapsed ? 'w-[72px]' : 'w-[260px]'} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 z-30`}>
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
        <span className="text-xl font-bold text-blue-600 tracking-tight whitespace-nowrap">
          {collapsed ? 'K' : 'KALNET'}
        </span>
      </div>
      
      <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span className="truncate">{item.name}</span>}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-gray-100 dark:border-gray-800`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3 px-2'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xs flex-shrink-0">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
