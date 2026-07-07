'use client';
import React from 'react';
import { useCommandStore } from '@/store/useCommandStore';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';

export default function TriagePanel() {
  const { incidents, activeIncidentId, setActiveIncident } = useCommandStore();

  const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };

  const sortedIncidents = [...incidents].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="absolute top-4 left-4 z-10 w-[320px] max-h-[calc(100vh-6rem)] overflow-y-auto bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-20 flex justify-between items-center">
        <h2 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-blue-500" />
          ACTIVE INCIDENTS
        </h2>
        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-transparent font-bold">
          {sortedIncidents.filter(i => i.status !== 'Resolved' && i.status !== 'Rejected').length} Pending
        </Badge>
      </div>
      
      <div className="flex-1 p-2 space-y-2">
        {sortedIncidents.map((incident, idx) => {
          const isActive = activeIncidentId === incident.id;
          const isResolved = incident.status === 'Resolved' || incident.status === 'Rejected';

          return (
            <div 
              key={incident.id}
              onClick={() => setActiveIncident(incident.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive 
                  ? 'bg-blue-50 dark:bg-slate-800 border-blue-400 dark:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : isResolved
                  ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50 opacity-60'
                  : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <Badge variant={incident.priority === 'Critical' ? 'destructive' : 'warning'} className="text-[10px] px-1.5 py-0">
                  {incident.priority}
                </Badge>
                <span className={`text-[10px] font-bold ${isResolved ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                  {incident.status}
                </span>
              </div>
              <h3 className={`text-sm font-medium leading-tight mb-1 ${isResolved ? 'text-slate-400 dark:text-slate-400 line-through decoration-slate-400 dark:decoration-slate-600' : 'text-slate-900 dark:text-slate-200'}`}>
                {incident.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {incident.locationName || `Ward ${(idx % 5) + 1}`}
                </span>
                <span className="flex items-center" suppressHydrationWarning>
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
