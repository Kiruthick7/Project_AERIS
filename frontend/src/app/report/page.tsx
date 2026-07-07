'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCommandStore } from '@/store/useCommandStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Camera, MapPin, Send, ArrowRight, ToggleLeft, ToggleRight, Loader2, CheckCircle2, Edit3, Wind } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CitizenPortal() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [locationName, setLocationName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setPhotoUploaded(true);
        toast.success("Image attached successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (safeMode) {
      setLocation({ lat: 12.9690, lng: 77.5850 }); // Default Bangalore Mock
      setLocationName('Government Primary School, Ward 11 (Mock)');
      setLoadingLoc(false);
      return;
    }

    setLoadingLoc(true);
    setLocationName('Detecting location name...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            
            let name = data.display_name || "Unknown Location";
            // Make the name concise by taking the first two parts of the address
            if (name.includes(',')) {
              name = name.split(',').slice(0, 3).join(',');
            }
            setLocationName(name);
          } catch (e) {
            setLocationName("Current GPS Location");
          }
          
          setLoadingLoc(false);
        },
        (error) => {
          console.warn("Geolocation failed, falling back to mock.", error);
          let reason = error.message;
          if (error.code === 1) reason = "Permission Denied by OS";
          if (error.code === 2) reason = "Position Unavailable (Check Mac Wi-Fi)";
          if (error.code === 3) reason = "Timeout";

          toast.error(`GPS Error: ${reason}. Using fallback.`);
          setLocation({ lat: 12.9690, lng: 77.5850 }); // Fall back to Bangalore
          setLocationName('Bangalore (Fallback GPS)');
          setLoadingLoc(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLoadingLoc(false);
    }
  }, [safeMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <header className="h-16 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Wind className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
            AERIS
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/command">
            <Button variant="outline" size="sm" className="text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              Officer Login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center relative">
        {/* Presenter Toggle */}
        <div className="absolute top-0 right-6 flex items-center gap-2 mt-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-300 dark:border-slate-700">
           <span className="font-medium">Hackathon Safe Mode:</span>
           <button onClick={() => setSafeMode(!safeMode)} className={safeMode ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}>
             {safeMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
           </button>
        </div>

        <div className="text-center mb-8 mt-10">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Report an Incident</h2>
          <p className="text-slate-500 dark:text-slate-400">Help protect our environment. AI will verify and route your report instantly.</p>
        </div>

        <Card className="bg-white dark:bg-slate-900 shadow-xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-8 space-y-6">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                photoUploaded 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                photoUploaded ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
              }`}>
                {photoUploaded ? <CheckCircle2 className="w-8 h-8" /> : <Camera className="w-8 h-8" />}
              </div>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {photoUploaded ? 'Photo Attached Successfully' : 'Take a Photo or Upload'}
              </p>
              <p className="text-sm mt-1 opacity-70">
                {photoUploaded ? 'Ready for AI analysis.' : 'AI will automatically detect the issue.'}
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <MapPin className="text-blue-500 shrink-0" />
              <div className="flex-1 relative group">
                <input 
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Enter location manually..."
                  title="Click to edit location"
                  className="w-full bg-transparent border-b border-dashed border-slate-300 dark:border-slate-500 hover:border-blue-400 focus:border-blue-500 focus:border-solid focus:outline-none transition-colors text-base font-bold text-slate-900 dark:text-slate-100 pb-1 truncate pr-24 cursor-text placeholder:text-slate-400"
                />
                <div className="absolute right-0 top-0.5 flex items-center gap-1.5 pointer-events-none transition-opacity">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 animate-pulse hidden sm:inline-block font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 shadow-sm">Click to edit</span>
                  <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse drop-shadow-sm" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {loadingLoc ? (
                    <span className="flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Acquiring GPS...</span>
                  ) : location ? (
                    `${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E`
                  ) : (
                    <span className="text-red-400">GPS Unavailable</span>
                  )}
                </p>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 shadow-md hover:shadow-lg disabled:shadow-none" 
              disabled={!location || loadingLoc || !photoUploaded || isSubmitting}
              onClick={async () => {
                if (!imageBase64 || !location) return;
                setIsSubmitting(true);
                const toastId = toast.loading("Analyzing image with Groq Vision Engine...");
                
                try {
                  let liveIncident;
                  if (safeMode) {
                    await new Promise(r => setTimeout(r, 2000));
                    liveIncident = {
                      id: "INC-SAFE-" + Math.floor(Math.random() * 90000 + 10000),
                      title: "Illegal Garbage Burning",
                      description: "Thick, toxic black smoke billowing from an illegal dump site. Plastic and tires are burning.",
                      priority: "Critical",
                      aiConfidence: 98,
                      recommendedAction: "Dispatch Fire Engine and Hazmat Unit immediately. Issue shelter-in-place alert to Government Primary School.",
                      expectedImpact: "Prevents acute respiratory distress for ~450 students. Extinguishes fire within 30 minutes.",
                      explainabilityTrace: "# AI Reasoning Trace\n\n- **Vision Analysis:** Detected thick black smoke typical of burning polymers/tires (Confidence: 98%).\n- **Geo Context:** Incident is 150m upwind from Government Primary School in Ward 11.\n- **Risk Factor:** Critical. Time-decaying wind vector indicates smoke will engulf school playground in 12 minutes.",
                      lat: location.lat,
                      lng: location.lng,
                      locationName: locationName,
                      status: "Verified",
                      timestamp: new Date().toISOString(),
                      reporterTrustScore: 1450,
                    };
                  } else {
                    const res = await fetch('/api/v1/analyze', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        image: imageBase64,
                        lat: location.lat,
                        lng: location.lng,
                        locationName: locationName
                      })
                    });
                    
                    if (!res.ok) {
                      const err = await res.json();
                      throw new Error(err.error || "Failed to analyze image");
                    }
                    liveIncident = await res.json();
                  }
                  
                  useCommandStore.getState().injectLiveIncident(liveIncident);
                  
                  toast.success("AI Analysis Complete! Routing to Command Center.", { id: toastId });
                  setTimeout(() => router.push('/command'), 1500);
                } catch (e: any) {
                  toast.error(`Analysis failed: ${e.message}`, { id: toastId });
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
              {isSubmitting ? 'Analyzing...' : 'Submit Report'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-2">
            Your Trust Score: <strong className="text-emerald-600 dark:text-emerald-400">1250 (Verified Citizen)</strong>
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
            * Score is calculated using an AI ELO system. It increases when your reports are verified by officers and decreases for false alarms.
          </p>
        </div>
      </main>

      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' }}} />
    </div>
  );
}
