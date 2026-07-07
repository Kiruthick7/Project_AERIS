'use client';
import React from 'react';
import { useCommandStore, TimelinePhase } from '@/store/useCommandStore';
import { Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const phases: TimelinePhase[] = ['Past', 'Present', 'Predicted'];

export default function TimelineSlider() {
  const { timeSliderPhase, setTimeSliderPhase } = useCommandStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[600px] bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full px-8 py-4 shadow-2xl flex items-center gap-6">
      <div className="flex items-center text-slate-400">
        <Clock className="w-5 h-5 mr-2" />
        <span className="text-xs font-semibold uppercase tracking-widest">Replay</span>
      </div>
      
      <div className="flex-1 relative h-2 bg-slate-800 rounded-full flex items-center justify-between">
        {phases.map((phase, index) => {
          const isActive = timeSliderPhase === phase;
          const isPassed = phases.indexOf(timeSliderPhase) >= index;
          
          return (
            <div key={phase} className="relative z-10">
              <button
                onClick={() => setTimeSliderPhase(phase)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-blue-500 scale-150 ring-4 ring-blue-500/20' : 
                  isPassed ? 'bg-blue-600' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500'
              }`}>
                {phase}
              </div>
            </div>
          );
        })}
        
        {/* Progress Bar Fill */}
        <div 
          className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${(phases.indexOf(timeSliderPhase) / (phases.length - 1)) * 100}%` }}
        />
      </div>

      <div className="flex items-center text-amber-500/80 pl-4 border-l border-slate-800">
        <TrendingUp className="w-4 h-4 mr-2" />
        <span className="text-xs font-semibold uppercase">Simulation</span>
      </div>
    </div>
  );
}
