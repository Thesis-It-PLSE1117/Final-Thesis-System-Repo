# Cloud Simulation Platform - Frontend

A modern web interface for cloud computing simulation and load balancing research, built with React and Vite.

## 🚀 Features

- **Interactive Simulation Configuration**: Configure data centers, VMs, and workloads
- **Real-time Animation**: Visualize task distribution and VM utilization
- **Algorithm Comparison**: Compare EACO and EPSO load balancing algorithms
- **MATLAB Integration**: Generate advanced plots and visualizations
- **Results Analysis**: Comprehensive metrics and performance charts
- **History Management**: Save and review past simulation results

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/thesis-frontend.git
cd thesis-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8081
```

4. Start the development server:
```bash
npm run dev
```

## 🔗 Backend Repository

This frontend works with our Java-based backend simulation engine:

**Backend Repository**: [https://github.com/kierre-yes/research_sim.git](https://github.com/kierre-yes/research_sim.git)

Make sure to clone and run the backend server before using this frontend application.

## 🏗 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── AnimationTab/    # Task distribution visualization
│   ├── DatacenterTab/   # Data center configuration
│   ├── ResultsTab/      # Results analysis and charts
│   ├── WorkloadTab/     # Workload configuration
│   └── HistoryTab/      # Simulation history
├── pages/           # Page components
├── assets/          # Static assets
├── services/        # API services
└── utils/           # Utility functions
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

The application can be configured through environment variables:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8081)

## 📝 License

This project is part of academic research on cloud computing load balancing strategies.
