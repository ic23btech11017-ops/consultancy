import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200">
      <Sidebar collapsed={collapsed} />
      <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        <div className="sticky top-0 z-20 flex-shrink-0">
          <Topbar collapsed={collapsed} onToggleCollapse={() => setCollapsed(c => !c)} />
        </div>
        <main className="p-6 flex-1 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
