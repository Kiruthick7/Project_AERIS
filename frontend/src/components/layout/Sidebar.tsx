import React from 'react';
import { useCommandStore } from '@/store/useCommandStore';
import { Activity, Map, BarChart2, Settings, ShieldAlert } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-16 flex flex-col items-center py-4 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-20">
      <div className="mb-8">
        <ShieldAlert className="w-8 h-8 text-blue-500" />
      </div>
      
      <nav className="flex-1 w-full flex flex-col gap-4 px-2">
        <SidebarItem icon={<Map />} active />
      </nav>
      
      <div className="mt-auto px-2">
        <SidebarItem icon={<Settings />} />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={`w-full p-3 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-blue-600/10 text-blue-600 dark:text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
      {icon}
    </button>
  );
}
