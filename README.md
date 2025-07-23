# Load Balancing Simulator

A modern web application for simulating and comparing load balancing algorithms in cloud computing environments. This simulator focuses on comparing the Round Robin (RR) and Enhanced Particle Swarm Optimization (EPSO) algorithms for task scheduling in cloud datacenters.

## About

The Load Balancing Simulator provides an interactive environment to:
- Simulate task scheduling using RR and EPSO algorithms
- Visualize resource allocation in real-time
- Compare performance metrics between algorithms
- Analyze scheduling logs and results
- Upload custom workload datasets
- Configure simulation parameters

## Features

- 🔄 Real-time animation of task scheduling
- 📊 Detailed performance metrics and comparisons
- 📈 Interactive charts and visualizations
- 📁 Custom workload file upload support
- ⚙️ Configurable simulation parameters
- 📝 Comprehensive scheduling logs
- 💾 Results export functionality

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Java 17 or higher (for backend)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thesis-system.git
```

2. Frontend setup:
```bash
cd thesis-frontend
npm install
```

3. Backend setup:
```bash
cd ../thesis-backend
mvn install
```

4. Start the backend server:
```bash
mvn spring-boot:run
```

5. In a new terminal, start the frontend:
```bash
cd ../thesis-frontend
npm run dev
```

6. Access the application at `http://localhost:5173`

## Configuration

1. Frontend:
   - Copy `.env.example` to `.env`
   - Update API endpoint if needed

2. Backend:
   - Configure `application.properties`
   - Set up database connection if required

## Verification

- Backend server should be running on port 8080
- Frontend dev server on port 5173
- No console errors in browser
- Successful API connection test

This frontend works with our Java-based backend simulation engine:

Backend Repository: https://github.com/kierre-yes/research_sim.git

Make sure to clone and run the backend server before using this frontend application.
Please read the README.md file in the root directory for further documentation.
## Support

For issues and feature requests, please create an issue in the repository.

## License

MIT License

Copyright (c) 2024 Load Balancing Simulator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
