import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen min-w-0">
        <div className="sticky top-0 z-20 flex-shrink-0">
          <Topbar />
        </div>
        <main className="p-6 flex-1 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
