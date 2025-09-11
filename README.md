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

# MATLAB Feature Flags
VITE_ENABLE_MATLAB_PLOTS=true
VITE_ENABLE_MATLAB_TOGGLE=true
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

## MATLAB Configuration

The frontend supports MATLAB integration through environment variables. MATLAB features are controlled by feature flags that can be enabled or disabled based on your setup.

### Enable MATLAB Features (Local Development)

To enable MATLAB plots and analysis features:

**Step 1: Configure Environment Variables**
Create or update your `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8081

# Enable MATLAB Features
VITE_ENABLE_MATLAB_PLOTS=true
VITE_ENABLE_MATLAB_TOGGLE=true
VITE_ENABLE_HISTORY=true
```

**Step 2: Ensure Backend MATLAB Support**
- Backend must be running with MATLAB profile enabled
- See backend documentation for MATLAB setup

**Step 3: Restart Development Server**
```bash
npm run dev
```

**Step 4: Use MATLAB Features**
1. Navigate to any simulation tab
2. Look for "Generate Plots with MATLAB" toggle
3. **Enable the toggle** before running simulation
4. Run simulation and view results in Results tab

### Disable MATLAB Features (Production)

For production deployment without MATLAB:

**Option 1: Use .env.production**
The included `.env.production` automatically disables MATLAB:
```env
VITE_API_BASE_URL=https://your-backend.railway.app

# MATLAB Features Disabled
VITE_ENABLE_MATLAB_PLOTS=false
VITE_ENABLE_MATLAB_TOGGLE=false
```

**Option 2: Manual Configuration**
Set environment variables to false:
```env
VITE_ENABLE_MATLAB_PLOTS=false
VITE_ENABLE_MATLAB_TOGGLE=false
```

### Environment Variable Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_ENABLE_MATLAB_PLOTS` | `false` | Shows/hides MATLAB plot visualizations |
| `VITE_ENABLE_MATLAB_TOGGLE` | `false` | Shows/hides "Generate Plots" toggle |
| `VITE_ENABLE_HISTORY` | `true` | Enable simulation history feature |
| `VITE_MAX_HISTORY_ENTRIES` | `50` | Maximum number of history entries |

### UI Behavior Based on Configuration

**When MATLAB is ENABLED:**
- "Generate Plots with MATLAB" toggle appears
- Plot galleries display MATLAB-generated visualizations
- Plot interpretation cards show detailed analysis
- Advanced statistical charts are available
- Full feature set is accessible

**When MATLAB is DISABLED:**
- MATLAB toggle is hidden
- Uses Chart.js fallback visualizations
- Basic charts and metrics still work
- Simulation functionality remains intact
- Clean UI without unused features

### Testing Your Configuration

**Check if MATLAB features are enabled:**
1. Start the development server
2. Open browser developer console
3. Check for MATLAB-related UI elements
4. Look for "Generate Plots" toggles in simulation tabs

**Verify environment variables:**
```bash
# In your terminal, check if variables are set
echo $VITE_ENABLE_MATLAB_PLOTS
echo $VITE_ENABLE_MATLAB_TOGGLE
```

### Troubleshooting

**MATLAB toggle not appearing:**
- Check `VITE_ENABLE_MATLAB_TOGGLE=true` in .env
- Restart development server after .env changes
- Verify .env file is in project root

**Plots not generating:**
- Ensure `VITE_ENABLE_MATLAB_PLOTS=true`
- Verify backend has MATLAB support enabled
- Check browser console for API errors

**Environment changes not taking effect:**
- Restart development server completely
- Check .env file syntax (no spaces around =)
- Ensure .env is not gitignored if sharing configuration

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
