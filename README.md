<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg" alt="Project AERIS Logo" width="120" height="120" />
  <h1>Project AERIS</h1>
  <p><strong>AI-Powered Urban Environmental Intelligence & Decision Support Platform</strong></p>
  <p>
    <a href="#problem">Problem</a> • 
    <a href="#solution">Solution</a> • 
    <a href="#architecture">Architecture</a> • 
    <a href="#ai-pipeline">AI Pipeline</a> • 
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🌪️ The Problem

Every year, municipalities lose millions of dollars and compromise the health of hundreds of thousands of citizens due to delayed responses to localized environmental incidents (e.g., illegal industrial dumping, hazardous fires, chemical spills).

Traditional city dashboards are **reactive, fragmented, and passive**. They show raw data on a map, but they don't tell command center officers *what to do*, *why it matters*, or *how to respond*. The cognitive load during a crisis falls entirely on understaffed dispatchers.

## 🚀 The Solution: Project AERIS

Project AERIS is a proactive **Environmental Command Center**. It transforms raw citizen reports and IoT data into verifiable, actionable intelligence using an autonomous multi-agent AI architecture.

AERIS doesn't just put a pin on a map. It answers the only question that matters in a crisis: **"What should we do next?"**

### Key Features
- **Deterministic Multi-Agent Pipeline:** Orchestrates specialized AI agents (Vision, Geo, Risk, Decision) to verify incidents and formulate response plans.
- **Explainability Engine (CoT):** Generates transparent "Chain of Thought" reasoning for every AI recommendation, ensuring Human-in-the-Loop (HITL) trust.
- **Citizen Trust ELO:** Dynamically scores reporter credibility to filter out noise and prioritize verified crises.
- **Geospatial Digital Twin:** Real-time MapLibre integration with predictive Risk Cone simulations.
- **Zero-Latency UI:** Built with Next.js, Zustand, and Tailwind for a butter-smooth Command Center experience.

---

## 📸 Screenshots

### Light Theme
| Mission Control Landing | Citizen Reporting Portal | Command Center (Live Map) |
| :---: | :---: | :---: |
| <img src="assets/landing-light.png" alt="Mission Control Landing" /> | <img src="assets/report-light.png" alt="Citizen Report Portal" /> | <img src="assets/command-light.png" alt="Command Center" /> |

### Dark Theme
| Mission Control Landing | Citizen Reporting Portal | Command Center (Live Map) |
| :---: | :---: | :---: |
| <img src="assets/landing-dark.png" alt="Mission Control Landing" /> | <img src="assets/report-dark.png" alt="Citizen Report Portal" /> | <img src="assets/command-dark.png" alt="Command Center" /> |

---

## 🧠 The AI Pipeline

AERIS operates on a specialized multi-agent architecture to guarantee deterministic, high-confidence outputs.

1. **📷 Vision Agent:** Analyzes raw media (e.g., citizen photos of smoke or chemical spills) to verify the physical presence of a hazard.
2. **🗺️ Geo Intelligence:** Triangulates the incident against vulnerable municipal assets (schools, hospitals, water plants).
3. **🌪️ Risk Engine:** Calculates time-decaying risk vectors and simulates physical propagation (e.g., wind carrying smoke, water carrying chemicals).
4. **⚖️ Decision Engine:** Synthesizes the data into a concrete, executable recommended action (e.g., "Dispatch Hazmat Unit Alpha").
5. **🔍 Explainability Engine:** Wraps the entire process in a human-readable Chain of Thought trace for auditability.

---

## 🏗️ Architecture & Tech Stack

```mermaid
flowchart TD
    %% Styling
    classDef source fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#f8fafc,rx:10,ry:10;
    classDef engine fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#ffffff,rx:15,ry:15;
    classDef frontend fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc,rx:10,ry:10;
    classDef api fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#f8fafc,rx:10,ry:10;

    subgraph Inputs [Data Ingestion]
        C[👤 Citizen Portal]:::source
        S[🛰️ NASA VIIRS Data]:::source
    end

    subgraph Serverless [Next.js API Routes]
        Analyze[🧠 /api/v1/analyze]:::api
        Firms[🔥 /api/v1/firms]:::api
        Gemini((Google Gemini 2.5)):::engine
        Groq((Groq API / Llama-4)):::engine
    end

    subgraph CommandCenter [Client Command Center]
        Z[Zustand Global Store]:::frontend
        M[🗺️ MapLibre Digital Twin]:::frontend
        T[📋 Triage & AI Visualizer]:::frontend
    end

    C -- "Uploads Image/GPS" --> Analyze
    S -- "Polls Thermal Anomalies" --> Firms
    
    Analyze -- "1. Primary Inference" --> Gemini
    Analyze -- "2. HA Fallback" --> Groq
    Gemini -- "Returns Structured JSON & Explainability" --> Analyze
    Groq -- "Fallback JSON & Explainability" --> Analyze
    
    Analyze --> Z
    Firms --> Z
    
    Z --> M
    Z --> T
```

### Frontend (Command Center & Citizen Portal)
- **Framework:** Next.js 14 (App Router), React
- **Language:** TypeScript
- **State Management:** Zustand (In-memory application state)
- **Styling:** Tailwind CSS, Shadcn/UI, Framer Motion
- **Geospatial:** MapLibre GL, react-map-gl

### Backend (Serverless Edge)
- **Framework:** Next.js API Routes (Serverless)
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) for primary deterministic JSON generation and chain-of-thought extraction.
- **AI Fallback (HA):** Groq API (`llama-4-scout-17b`) for high-availability fallback if Gemini experiences downtime.
- **External APIs:** NASA FIRMS API (Simulated/Live Fire Data), WAQI API (World Air Quality Index)

### DevOps & Deployment
- **Containerization:** Docker (Optional for local testing of V2 Microservices)
- **Hosting Target:** Vercel (Optimized for Next.js Serverless MVP)

---

## 🎮 Demo

### Running Locally
To launch the entire stack locally for development or judging:

```bash
# Clone the repo
git clone https://github.com/Kiruthick7/Project_AERIS.git
cd Project_AERIS/frontend

# Setup Environment
cp ../.env.example .env.local
# (Fill in your GEMINI_API_KEY in .env.local)

# Install & Launch
npm install
npm run dev
```

Navigate to `http://localhost:3000` to access the Mission Control Landing.

---

## 🔮 Future Scope

While AERIS is highly capable today, the roadmap for V2 includes:
- **IoT Integration:** Direct ingestion pipelines for hyper-local air quality sensors and river flow meters.
- **Drone Dispatch Integration:** Automated API hooks to launch municipal recon drones to unverified incident coordinates.
- **Predictive Maintenance:** Analyzing historical incident clusters to recommend preventative infrastructure upgrades.
- **Multi-lingual Citizen Portal:** Ensuring accessibility for diverse urban populations using LLM-driven real-time translation.

---
<div align="center">
  <i>Built with ❤️ for Build With AI: Code for Communities</i>
</div>
