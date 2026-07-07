import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function ExplainabilityPanel({ trace }: { trace: string }) {
  return (
    <Card className="border-blue-900/50 bg-slate-900/90 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
      <CardHeader className="py-3 bg-blue-950/20">
        <CardTitle className="text-sm font-medium flex items-center text-blue-400">
          <BrainCircuit className="w-4 h-4 mr-2" />
          Chain of Thought (CoT) Trace
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
        {trace}
      </CardContent>
    </Card>
  );
}
