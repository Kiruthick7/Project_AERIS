'use client';
import React, { useState } from 'react';
import { useCommandStore } from '@/store/useCommandStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, ArrowRight, ShieldCheck, Search, Loader2, X, Star, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import ExplainabilityPanel from './ExplainabilityPanel';
import AIPipelineVisualizer from './AIPipelineVisualizer';

export default function DecisionPanel() {
  const { activeIncidentId, incidents, executeRecommendation, rejectRecommendation, isProcessing, setActiveIncident, runAIAnalysis } = useCommandStore();
  const [showExplain, setShowExplain] = useState(false);
  const [isPipelineExpanded, setIsPipelineExpanded] = useState(false);
  
  if (!activeIncidentId) return null;
  
  const incident = incidents.find(i => i.id === activeIncidentId);
  if (!incident) return null;

  const isResolved = incident.status === 'Resolved';
  const isRejected = incident.status === 'Rejected';

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 shadow-2xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
        <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800/50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                {incident.title}
                {isProcessing && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
              </CardTitle>
              {incident.locationName && (
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 mb-3">
                  <MapPin className="w-4 h-4 mr-1.5" /> {incident.locationName}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant={incident.priority === 'Critical' ? 'destructive' : 'warning'}>
                  {incident.priority} Priority
                </Badge>
                {incident.status === 'Verified' || isResolved || isRejected ? (
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 font-bold">
                    <Bot className="w-3 h-3 mr-1" /> {incident.aiConfidence}% Verified
                  </Badge>
                ) : incident.status === 'New' && !isProcessing ? (
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <Bot className="w-3 h-3 mr-1 opacity-50" /> AI Queued
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 animate-pulse border border-amber-200 dark:border-amber-900/50 font-bold">
                    <Bot className="w-3 h-3 mr-1" /> AI Analyzing...
                  </Badge>
                )}
                {incident.reporterTrustScore && (
                  <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                    <Star className="w-3 h-3 mr-1" /> Trust Score: {incident.reporterTrustScore}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" onClick={() => setActiveIncident(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 space-y-6">
          {isProcessing || incident.status === 'New' ? (
            incident.status === 'New' && !isProcessing ? (
              <div className="flex flex-col items-center justify-center h-56 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
                <Bot className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Engine Queued</h4>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 mb-4 max-w-[200px]">
                  Awaiting verification triage...
                </p>
                <Button 
                  onClick={() => runAIAnalysis(incident.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  Run AI Analysis
                </Button>
              </div>
            ) : (
              <AIPipelineVisualizer />
            )
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Collapsible AI Pipeline Visualizer */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setIsPipelineExpanded(!isPipelineExpanded)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    AI Analysis Complete
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isPipelineExpanded ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${isPipelineExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <AIPipelineVisualizer forceComplete={true} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-[11px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Recommended Action
                </h4>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed shadow-sm">
                  {incident.recommendedAction}
                </p>
              </div>

              <div className="space-y-3 mt-4">
                <h4 className="text-[11px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Expected Impact
                </h4>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed px-1">
                  {incident.expectedImpact}
                </p>
              </div>

              {!isResolved && !isRejected && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md hover:shadow-lg transition-all" 
                    onClick={() => executeRecommendation(incident.id)}
                  >
                    Execute Action <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 text-red-600 dark:text-slate-400 font-bold transition-all"
                    onClick={() => rejectRecommendation(incident.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all"
                    onClick={() => setShowExplain(!showExplain)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Why?
                  </Button>
                </div>
              )}
              {isResolved && (
                <div className="bg-emerald-900/20 text-emerald-400 p-3 rounded-lg border border-emerald-900/50 text-sm text-center">
                  Action Executed. Resources Dispatched.
                </div>
              )}
              {isRejected && (
                <div className="bg-red-900/20 text-red-400 p-3 rounded-lg border border-red-900/50 text-sm text-center">
                  Recommendation Rejected by Officer Override.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showExplain && !isProcessing && (
        <div className="mt-4">
          <ExplainabilityPanel trace={incident.explainabilityTrace || "No trace available."} />
        </div>
      )}
    </>
  );
}
