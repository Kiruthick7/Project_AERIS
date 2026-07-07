import React from 'react';
import { useCommandStore } from '@/store/useCommandStore';
import { CheckCircle2, Circle, Eye, MapPin, Wind, BrainCircuit, ListChecks, Zap } from 'lucide-react';

export default function AIPipelineVisualizer({ forceComplete = false }: { forceComplete?: boolean }) {
  const { aiPipelineStatus } = useCommandStore();
  
  const steps = [
    { key: 'vision', label: 'Vision Agent', icon: <Eye className="w-4 h-4" />, desc: 'Analyzing reported imagery' },
    { key: 'geo', label: 'Geo Intelligence', icon: <MapPin className="w-4 h-4" />, desc: 'Triangulating municipal assets' },
    { key: 'risk', label: 'Risk Engine', icon: <Wind className="w-4 h-4" />, desc: 'Simulating propagation' },
    { key: 'decision', label: 'Decision Engine', icon: <BrainCircuit className="w-4 h-4" />, desc: 'Formulating action plan' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
        <Zap className="w-3 h-3 mr-2 text-blue-500" /> AI Pipeline Execution
      </h4>
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isComplete = forceComplete || aiPipelineStatus[step.key as keyof typeof aiPipelineStatus];
          const isCurrent = !forceComplete && (
            idx === 0 ? !aiPipelineStatus[steps[0].key as keyof typeof aiPipelineStatus] : 
            aiPipelineStatus[steps[idx - 1].key as keyof typeof aiPipelineStatus] && !isComplete
          );
                            
          return (
            <div key={step.key} className={`flex items-start gap-3 transition-opacity duration-500 ${isComplete ? 'opacity-100' : isCurrent ? 'opacity-100 animate-pulse' : 'opacity-30'}`}>
              <div className={`mt-0.5 ${isComplete ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`}>
                {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isComplete ? 'text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step.label}
                  </span>
                  {isCurrent && <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Processing</span>}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
