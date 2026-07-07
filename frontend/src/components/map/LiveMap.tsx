'use client';
import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { useCommandStore } from '@/store/useCommandStore';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function LiveMap() {
  const { incidents, activeIncidentId, setActiveIncident, mapLayers, isProcessing } = useCommandStore();
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 77.5946,
    latitude: 12.9716,
    zoom: 12,
    pitch: 45,
    bearing: -17.6
  });

  // Suppress harmless maplibre aborted fetch errors from spamming the console
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '');
      if (msg.includes('AJAXError: Failed to fetch (0)')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Smooth Camera FlyTo
  useEffect(() => {
    if (activeIncidentId && mapRef.current) {
      const incident = incidents.find(i => i.id === activeIncidentId);
      if (incident) {
        mapRef.current.flyTo({
          center: [incident.lng, incident.lat],
          zoom: 14,
          pitch: 60,
          duration: 2000,
          essential: true
        });
      }
    }
  }, [activeIncidentId, incidents]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={() => setActiveIncident(null)}
        mapStyle={resolvedTheme === 'light' ? "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" : "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"}
        attributionControl={false}
      >
        {mapLayers.incidents && incidents.map((incident) => {
          const isActive = activeIncidentId === incident.id;
          const isResolved = incident.status === 'Resolved';
          
          return (
            <Marker 
              key={incident.id} 
              longitude={incident.lng} 
              latitude={incident.lat}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setActiveIncident(incident.id);
              }}
            >
              <div className={`relative cursor-pointer group ${isActive ? 'scale-125 z-10' : 'scale-100'} transition-transform`}>
                
                {/* Processing Radar Effect */}
                {isActive && isProcessing && !isResolved && (
                   <div className="absolute -inset-16 border border-blue-500/30 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] bg-blue-500/10" />
                )}
                
                {/* Standard Ping */}
                {!isResolved && <div className={`absolute inset-0 rounded-full animate-ping opacity-20 group-hover:opacity-40 ${incident.status === 'New' ? 'bg-slate-400' : 'bg-red-500'}`} />}
                
                {/* Core Marker */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isResolved ? 'bg-emerald-500 text-white' :
                  incident.status === 'New' ? 'bg-slate-600 text-slate-300' :
                  incident.priority === 'Critical' ? 'bg-red-500 text-white' : 
                  incident.priority === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {isResolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                </div>
              </div>
            </Marker>
          );
        })}

        {activeIncidentId && !isProcessing && (
          <Popup
            longitude={incidents.find(i => i.id === activeIncidentId)?.lng || 0}
            latitude={incidents.find(i => i.id === activeIncidentId)?.lat || 0}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={20}
            className="rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm min-w-[200px]">
              <strong className="block mb-1 text-blue-600 dark:text-blue-400">{incidents.find(i => i.id === activeIncidentId)?.title}</strong>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className={incidents.find(i => i.id === activeIncidentId)?.status === 'Resolved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'}>
                  {incidents.find(i => i.id === activeIncidentId)?.status}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-slate-500 dark:text-slate-400">Reported:</span>
                <span className="text-slate-900 dark:text-slate-200" suppressHydrationWarning>
                  {incidents.find(i => i.id === activeIncidentId)?.timestamp ? formatDistanceToNow(new Date(incidents.find(i => i.id === activeIncidentId)!.timestamp), { addSuffix: true }) : ''}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
