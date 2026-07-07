import { create } from 'zustand'
import toast from 'react-hot-toast';

export type TimelinePhase = 'Past' | 'Present' | 'Predicted'
export type IncidentStatus = 'New' | 'AI Processing' | 'Verified' | 'Assigned' | 'Resolved' | 'Rejected'

export interface WardHealth {
  id: string;
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'Assigned' | 'Maintenance';
  eta?: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  status: IncidentStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  locationName?: string;
  aiConfidence?: number;
  recommendedAction?: string;
  expectedImpact?: string;
  explainabilityTrace?: string;
  assignedResources?: string[];
  timestamp: string;
  reporterTrustScore?: number;
}

interface CommandState {
  timeSliderPhase: TimelinePhase;
  activeIncidentId: string | null;
  demoModeActive: boolean;
  liveFirmsMode: boolean;
  showOnboarding: boolean;
  isProcessing: boolean;
  aiPipelineStatus: {
    vision: boolean;
    geo: boolean;
    risk: boolean;
    decision: boolean;
  };
  incidents: Incident[];
  resources: Resource[];
  wardHealth: WardHealth[];
  mapLayers: {
    incidents: boolean;
    heatmap: boolean;
    riskCone: boolean;
    schools: boolean;
  };
  
  // Actions
  setTimeSliderPhase: (phase: TimelinePhase) => void;
  setActiveIncident: (id: string | null) => void;
  toggleLayer: (layer: keyof CommandState['mapLayers']) => void;
  startDemoMode: () => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  executeRecommendation: (id: string) => void;
  rejectRecommendation: (id: string) => void;
  stopDemoMode: () => void;
  injectLiveIncident: (incident: Incident) => void;
  setDemoMode: (active: boolean) => void;
  toggleLiveFirmsMode: () => void;
  setShowOnboarding: (show: boolean) => void;
  fetchLiveFirmsData: () => Promise<void>;
  runAIAnalysis: (id: string) => void;
}

// Seeded Data for the MVP Demo
const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-101",
    title: "Illegal Garbage Burning",
    description: "Thick, toxic black smoke billowing from an illegal dump site. Plastic and tires are burning.",
    lat: 12.9716,
    lng: 77.5946,
    status: "New", // Starts as New for demo
    priority: "Critical",
    locationName: "Ward 11 (Near Govt Primary School)",
    aiConfidence: 96,
    reporterTrustScore: 1450,
    recommendedAction: "Dispatch Fire Engine and Hazmat Unit immediately. Issue shelter-in-place alert to Government Primary School (Ward 11).",
    expectedImpact: "Prevents acute respiratory distress for ~450 students. Extinguishes fire within 30 minutes.",
    explainabilityTrace: `AI REASONING TRACE\n==================\n> Vision Analysis: Detected thick black smoke typical of burning polymers/tires (98% Conf)\n> Geo Context: Incident is 150m upwind from Govt Primary School\n> Risk Factor: Critical. Wind vector indicates smoke will engulf school in 12 mins.\n> Recommendation: Requires rapid extinguishment and immediate notification.`,
    timestamp: new Date(Date.now() - 180000).toISOString() // 3 mins ago
  },
  {
    id: "INC-102",
    title: "Industrial Smoke Emission",
    description: "Unfiltered yellow smoke venting from factory roof.",
    lat: 13.0285,
    lng: 77.5197, // Peenya Industrial Area
    status: "Verified",
    priority: "High",
    locationName: "Peenya Industrial Area",
    aiConfidence: 89,
    reporterTrustScore: 980,
    recommendedAction: "Dispatch Pollution Control Board Inspection Team. Log violation for Factory ID #884.",
    expectedImpact: "Enforces emissions compliance and reduces particulate matter (PM2.5) by 25% locally.",
    explainabilityTrace: `AI REASONING TRACE\n==================\n> Vision Analysis: Chemical plume detected, likely sulfur/nitrogen compounds\n> Geo Context: Peenya Industrial Zone. Known repeat offender.\n> Risk Factor: High. Chronic exposure risk for nearby residential colonies.`,
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: "INC-103",
    title: "Construction Dust",
    description: "Massive dust cloud from Metro Phase II excavation, no water sprinkling observed.",
    lat: 12.9141,
    lng: 77.5993, // Near Silk Board / Metro
    status: "New",
    priority: "Medium",
    locationName: "Metro Phase II Construction Zone",
    aiConfidence: 82,
    reporterTrustScore: 650,
    recommendedAction: "Dispatch Water Tanker to suppress dust. Issue automated warning to contractor.",
    expectedImpact: "Improves visibility and lowers localized PM10 spike.",
    explainabilityTrace: `AI REASONING TRACE\n==================\n> Vision Analysis: High opacity dust cloud.\n> Geo Context: Metro Phase II construction zone.\n> Risk Factor: Medium. Traffic hazard and respiratory irritant.`,
    timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    id: "INC-104",
    title: "Illegal Waste Dumping",
    description: "Truck dumping construction debris and chemical barrels near the lake bed.",
    lat: 12.9249,
    lng: 77.6499, // Agara Lake area
    status: "Verified",
    priority: "High",
    locationName: "Agara Lake Buffer Zone",
    aiConfidence: 91,
    reporterTrustScore: 1100,
    recommendedAction: "Dispatch Patrol Unit 4 to intercept truck. Deploy environmental cleanup crew.",
    expectedImpact: "Prevents toxic runoff into the lake ecosystem, protecting local water table.",
    explainabilityTrace: `AI REASONING TRACE\n==================\n> Vision Analysis: Detected heavy vehicle and blue chemical barrels on shoreline.\n> Geo Context: 20m from Lake Agara buffer zone.\n> Risk Factor: High. High risk of water contamination if barrels leak.`,
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

const MOCK_RESOURCES: Resource[] = [
  { id: "R-1", name: "Hazmat Unit Alpha", type: "Specialized", status: "Available" },
  { id: "R-2", name: "Water Cannon 1", type: "Equipment", status: "Available" },
  { id: "R-3", name: "Cleanup Crew Beta", type: "Personnel", status: "Assigned" },
];

const MOCK_WARDS: WardHealth[] = [
  { id: "W-1", name: "Ward 4 (Central)", score: 62, trend: "down", riskLevel: "High" },
  { id: "W-2", name: "Ward 5 (East)", score: 85, trend: "up", riskLevel: "Low" },
];

export const useCommandStore = create<CommandState>((set, get) => ({
  timeSliderPhase: 'Present',
  activeIncidentId: null,
  demoModeActive: false,
  liveFirmsMode: false,
  showOnboarding: false,
  isProcessing: false,
  aiPipelineStatus: {
    vision: false,
    geo: false,
    risk: false,
    decision: false,
  },
  incidents: MOCK_INCIDENTS,
  resources: MOCK_RESOURCES,
  wardHealth: MOCK_WARDS,
  mapLayers: {
    incidents: true,
    heatmap: false,
    riskCone: false,
    schools: false,
  },
  
  setTimeSliderPhase: (phase) => set({ timeSliderPhase: phase }),
  setActiveIncident: (id) => set({ activeIncidentId: id }),
  toggleLayer: (layer) => set((state) => ({
    mapLayers: { ...state.mapLayers, [layer]: !state.mapLayers[layer] }
  })),
  showToast: (msg, type = 'success') => {
    if (type === 'success') {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  },
  updateIncidentStatus: (id, status) => set((state) => ({
    incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status } : inc)
  })),
  executeRecommendation: (id) => {
    get().updateIncidentStatus(id, 'Resolved');
    get().showToast("Success: Recommended resources dispatched. Status set to Resolved.");
  },
  rejectRecommendation: (id) => {
    get().updateIncidentStatus(id, 'Rejected');
    get().showToast("Human Override: AI Recommendation rejected.", "error");
  },
  injectLiveIncident: (incident) => set((state) => ({
    incidents: [incident, ...state.incidents],
    activeIncidentId: incident.id,
    mapLayers: { ...state.mapLayers, incidents: true }
  })),
  setDemoMode: (active) => set({ demoModeActive: active }),
  
  setShowOnboarding: (show) => set({ showOnboarding: show }),

  stopDemoMode: () => {
    set({
      demoModeActive: false,
      isProcessing: false,
      activeIncidentId: null,
      aiPipelineStatus: { vision: false, geo: false, risk: false, decision: false },
    });
    get().updateIncidentStatus("INC-101", "New");
    set((state) => ({ mapLayers: { ...state.mapLayers, riskCone: false } }));
  },
  toggleLiveFirmsMode: () => {
    const isLive = !get().liveFirmsMode;
    set({ liveFirmsMode: isLive });
    if (isLive) {
      get().fetchLiveFirmsData();
    } else {
      // Revert to MOCK_INCIDENTS when turning off
      set({ incidents: MOCK_INCIDENTS });
    }
  },
  fetchLiveFirmsData: async () => {
    const toastId = toast.loading("Syncing live satellite telemetry from NASA FIRMS...");
    try {
      const res = await fetch('/api/v1/firms');
      const data = await res.json();
      
      if (!res.ok || data.error) {
         toast.error(data.error || "Failed to fetch FIRMS data", { id: toastId });
         set({ liveFirmsMode: false }); // Revert
         return;
      }
      
      if (data.length === 0) {
         toast.success("No active thermal anomalies found in Bangalore today.", { id: toastId });
      } else {
         toast.success(`Successfully fetched ${data.length} live thermal anomalies.`, { id: toastId });
      }
      set({ incidents: data });
    } catch (e) {
      toast.error("Network error fetching live FIRMS data.", { id: toastId });
      set({ liveFirmsMode: false });
    }
  },
  startDemoMode: () => {
    if (get().demoModeActive) return;
    set({ demoModeActive: true });
    get().runAIAnalysis("INC-101");
  },
  runAIAnalysis: (id) => {
    // Simulate backend ping (just a fire and forget)
    fetch('/api/v1/health').catch(() => console.log('Backend simulated'));
    
    set({ activeIncidentId: id, isProcessing: true });
    get().updateIncidentStatus(id, "AI Processing");
    
    set({ aiPipelineStatus: { vision: true, geo: false, risk: false, decision: false } });
    
    setTimeout(() => {
      if (!get().demoModeActive) return;
      set({ aiPipelineStatus: { vision: true, geo: true, risk: false, decision: false } });
    }, 1000);

    setTimeout(() => {
      get().updateIncidentStatus(id, "Verified");
      set((state) => ({ 
        mapLayers: { ...state.mapLayers, riskCone: true },
        aiPipelineStatus: { vision: true, geo: true, risk: true, decision: false }
      }));
    }, 2500);
    
    setTimeout(() => {
      set({ 
        isProcessing: false,
        aiPipelineStatus: { vision: true, geo: true, risk: true, decision: true }
      });
    }, 4000);
  }
}));
