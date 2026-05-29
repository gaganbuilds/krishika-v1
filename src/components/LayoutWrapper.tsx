'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const hideSidebar = pathname === '/' || pathname === '/register';

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 flex flex-col min-h-0 overflow-y-auto ${hideSidebar ? 'p-0' : 'px-4 py-6 md:px-8 md:py-8'}`}>
        {children}
      </main>
    </div>
  );
};
export default LayoutWrapper;
