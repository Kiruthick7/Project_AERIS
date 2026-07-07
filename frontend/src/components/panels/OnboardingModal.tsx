'use client';
import React, { useState, useEffect } from 'react';
import { X, Map, Satellite, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommandStore } from '@/store/useCommandStore';

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding } = useCommandStore();

  useEffect(() => {
    // Show modal on first visit for the demo
    const hasSeen = localStorage.getItem('aeris-onboarding-seen');
    if (!hasSeen) {
      setShowOnboarding(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('aeris-onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-blue-400 opacity-10" />

        <div className="p-8 relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            Welcome to Command Center
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            AERIS aggregates environmental incidents into a single pane of glass and uses AI to formulate rapid response plans.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                <Map className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">1. Select an Incident</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Click on any incident on the map or in the Active Incidents triage panel on the left to begin analysis.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
                <BrainCircuit className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">2. Review AI Analysis</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Watch the AI pipeline process the incident in real-time in the Decision Panel on the right and execute its recommended action.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0">
                <Satellite className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">3. Activate Live Satellite Mode</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Toggle the "Live Satellite Data" switch in the top header to connect to NASA's FIRMS API and visualize active global thermal anomalies.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <Button onClick={handleClose} size="lg" className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
