'use client';
import React, { useEffect, useState } from 'react';
import { useCommandStore } from '@/store/useCommandStore';
import { Play, Pause, AlertTriangle, Wind, Satellite, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const { incidents, demoModeActive, startDemoMode, stopDemoMode, liveFirmsMode, toggleLiveFirmsMode, setShowOnboarding } = useCommandStore();
  const [aqi, setAqi] = useState<number | null>(null);
  
  useEffect(() => {
    fetch('/api/v1/aqi')
      .then(res => res.json())
      .then(data => {
        if (data.aqi) setAqi(data.aqi);
      })
      .catch(console.error);
  }, []);
  
  const getAQILabel = (val: number) => {
    if (val <= 50) return 'Good';
    if (val <= 100) return 'Moderate';
    if (val <= 150) return 'Unhealthy for Sensitive Groups';
    if (val <= 200) return 'Poor';
    if (val <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const criticalCount = incidents.filter(i => i.priority === 'Critical' && i.status !== 'Resolved').length;

  return (
    <header className="h-14 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6">
          <ThemeToggle />
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 text-white p-1 rounded-md shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Wind className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold tracking-widest bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AERIS</h1>
          </Link>
        </div>
        
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {criticalCount} Critical
            </Badge>
          )}
          <Badge variant="secondary">
            {aqi ? `AQI: ${aqi} (${getAQILabel(aqi)})` : 'AQI: Loading...'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Help Button */}
        <button 
          onClick={() => setShowOnboarding(true)}
          className="group relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mr-2"
        >
          <Info className="w-5 h-5" />
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="pointer-events-none absolute right-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium whitespace-nowrap bg-slate-800 text-white px-2 py-1 rounded shadow-lg">
            Click for help
          </span>
        </button>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
           <Satellite className={`w-4 h-4 ${liveFirmsMode ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
           <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Live Satellite Data</span>
           <button onClick={toggleLiveFirmsMode} className={`ml-1 transition-colors ${liveFirmsMode ? 'text-amber-500' : 'text-slate-400'}`}>
             {liveFirmsMode ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
           </button>
        </div>

        {!demoModeActive ? (
          <Button variant="default" size="sm" onClick={startDemoMode} className="bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950">
            <Play className="w-4 h-4 mr-2" />
            Start Guided Demo
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={stopDemoMode} className="border-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-900/20">
            <Pause className="w-4 h-4 mr-2" />
            Stop Demo
          </Button>
        )}
      </div>
    </header>
  );
}
