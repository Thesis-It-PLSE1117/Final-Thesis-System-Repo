<a href="#">
  <img width="1024" alt="Cloud Load Balancer Simulator preview" src="https://github.com/user-attachments/assets/f719a4d1-2d0b-4080-8203-032f951600d9" />
</a>

<p align="center">
  <a href="#about">About</a>
  ·
  <a href="#installation">Installation</a>
  ·
  <a href="#tech-stack">Tech Stack</a>
  ·
  <a href="#scripts">Scripts</a>
  ·
  <a href="#configuration">Configuration</a>
  ·
  <a href="#backend">Backend</a>
</p>

<h1></h1>

## About

A modern web interface for the Cloud Load Balancer Simulator, built with React + Vite. It lets you configure data centers and workloads, run EPSO/EACO simulations via the backend, and visualize results with interactive charts and animations.

Key features:
- Interactive Simulation Configuration (data centers, VMs, workloads)
- Real-time Animation of task distribution and VM utilization
- Algorithm Comparison for EACO and EPSO
- MATLAB-driven visualizations when backend is MATLAB-enabled
- Results Analysis with comprehensive metrics and charts
- History Management to save and review runs

## Installation

Clone and install:
```bash
git clone https://github.com/kierre-yes/research_sim.git
cd Final-Thesis-System-Repo/thesis-frontend
npm install
```

Create a .env file:
```env
VITE_API_BASE_URL=http://localhost:8081
```

Start development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS 4
- Chart.js via react-chartjs-2
- Framer Motion animations
- Lucide React / react-icons
- PapaParse for CSV
data

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview dist/
- `npm run lint` – run ESLint
- `npm run build:production` – production mode build
- `npm run build:analyze` – bundle visualizer (outputs dist/stats.html)

## Configuration

Set environment variables in `.env`:
- `VITE_API_BASE_URL` – backend API (default http://localhost:8081)

Vite config highlights (vite.config.js):
- Tailwind integration
- Gzip + Brotli compression during build
- Vendor chunk splitting for faster loads
- Optional bundle analyzer (ANALYZE=true)

## Backend

This UI talks to the Spring Boot backend:
- Repository: https://github.com/kierre-yes/research_sim.git
- Ensure the backend is running on the URL in `VITE_API_BASE_URL` before starting the UI.

## Project Structure

```
src/
├── components/
│   ├── AnimationTab/
│   ├── DatacenterTab/
│   ├── ResultsTab/
│   ├── WorkloadTab/
│   └── HistoryTab/
├── pages/
├── assets/
├── services/
└── utils/
```

---

This project is part of academic research on cloud computing load balancing strategies.
