# Sentinel

**AI-Powered Urban Environmental Intelligence & Decision Support Platform**

Sentinel enables municipalities to detect, verify, predict, and respond to localized pollution incidents using AI, citizen reports, weather intelligence, and geospatial analytics. It is designed to act as an intelligent command center, offering explainable recommendations and insights for urban environmental management.

## Architecture

Sentinel is built using a modern, scalable tech stack:

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, MapLibre GL
- **Backend:** FastAPI, Python, SQLAlchemy, Alembic, Celery
- **Database:** PostgreSQL with PostGIS (for geospatial querying)
- **Cache & Queues:** Redis
- **AI/ML:** Google Gemini API (Multimodal reasoning for vision and decision generation)

## Project Structure

- `frontend/` - Next.js client application
- `backend/` - FastAPI service layer and AI agents
- `docker-compose.yml` - Local infrastructure configuration (PostgreSQL, PostGIS, Redis)

## Local Development Setup

### 1. Prerequisites

- Docker & Docker Compose
- Node.js (v18+)
- Python (v3.11+)

### 2. Start Infrastructure

```bash
docker compose up -d
```

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start API
fastapi dev app/main.py
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Features

- **Multi-Agent Pipeline:** Coordinates Vision, Geo Intelligence, Forecast, Risk, and Decision agents to generate explainable recommendations.
- **Geospatial Processing:** Live environmental risk mapping powered by PostGIS and MapLibre GL.
- **Explainable AI:** Every system recommendation is backed by a structured reasoning summary and confidence score.
- **Role-Based Access Control:** Distinct workflows for Citizens, Municipality Officers, and System Admins.
