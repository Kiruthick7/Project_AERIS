import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Activity, Cpu, Users, ChevronRight } from 'lucide-react';

export default function MissionControl() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-200 dark:border-slate-800/50 rounded-full animate-[spin_60s_linear_infinite] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-200 dark:border-blue-900/30 rounded-full animate-[spin_40s_linear_infinite_reverse] z-0" />

      <div className="z-10 text-center max-w-3xl px-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30 backdrop-blur-md">
            <ShieldAlert className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-slate-100 dark:to-slate-500">
          Project AERIS
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 font-light">
          AI-Powered Urban Environmental Intelligence & Decision Support Platform
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatusCard icon={<Activity className="text-emerald-400" />} label="Environmental Health" value="84/100" type="Mock" />
          <StatusCard icon={<ShieldAlert className="text-amber-400" />} label="Active Incidents" value="9" type="Mock" />
          <StatusCard icon={<Cpu className="text-blue-400" />} label="AI Systems" value="Operational" type="Live" />
          <StatusCard icon={<Users className="text-emerald-400" />} label="Response Teams" value="18 Ready" type="Mock" />
        </div>

        <Link href="/command?demo=true">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]">
            <span className="mr-2">Start Guided Demo</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link 
            href="/report" 
            className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase transition-all flex items-center gap-2 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-500 px-6 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Open Citizen Portal
          </Link>
          <span className="hidden sm:block text-slate-300 dark:text-slate-700 text-xl font-light">•</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 uppercase drop-shadow-sm">
              Google Public Sector
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon, label, value, type }: { icon: React.ReactNode, label: string, value: string, type: string }) {
  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none relative">
      <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        {type}
      </div>
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">{value}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">{label}</div>
    </div>
  );
}
