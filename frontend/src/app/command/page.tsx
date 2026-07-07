import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import LiveMap from '@/components/map/LiveMap';
import DecisionPanel from '@/components/panels/DecisionPanel';
import TriagePanel from '@/components/panels/TriagePanel';
import OnboardingModal from '@/components/panels/OnboardingModal';
import { Toaster } from 'react-hot-toast';

export default function CommandCenter() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Header />
        
        <main className="flex-1 relative">
          <LiveMap />
          
          <TriagePanel />
          
          <div className="absolute top-4 right-4 z-10 w-[400px] max-h-[calc(100vh-6rem)] overflow-y-auto">
            <DecisionPanel />
          </div>
        </main>
      </div>
      
      <OnboardingModal />
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
          }
        }}
      />
    </div>
  );
}
