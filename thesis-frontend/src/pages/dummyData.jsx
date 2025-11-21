// Dummy data that matches your EPSO structure exactly
export const psoResults = {
  isIterationResult: false,
  rawResults: {
    summary: {
      makespan: 285.67,
      loadImbalance: 0.1276,
      resourceUtilization: 72.34,
      totalCloudlets: 1000,
      totalVms: 20
    },
    vmUtilization: [
      { vmId: 0, totalLoad: 0.92, cloudletCount: 47 },
      { vmId: 1, totalLoad: 0.88, cloudletCount: 45 },
      { vmId: 2, totalLoad: 0.95, cloudletCount: 49 },
      { vmId: 3, totalLoad: 0.84, cloudletCount: 43 },
      { vmId: 4, totalLoad: 0.97, cloudletCount: 53 },
      { vmId: 5, totalLoad: 0.99, cloudletCount: 57 },
      { vmId: 6, totalLoad: 0.96, cloudletCount: 55 },
      { vmId: 7, totalLoad: 0.89, cloudletCount: 48 },
      { vmId: 8, totalLoad: 0.87, cloudletCount: 47 },
      { vmId: 9, totalLoad: 0.86, cloudletCount: 46 },
      { vmId: 10, totalLoad: 0.90, cloudletCount: 48 },
      { vmId: 11, totalLoad: 0.94, cloudletCount: 54 },
      { vmId: 12, totalLoad: 0.82, cloudletCount: 40 },
      { vmId: 13, totalLoad: 0.98, cloudletCount: 59 },
      { vmId: 14, totalLoad: 0.87, cloudletCount: 47 },
      { vmId: 15, totalLoad: 0.93, cloudletCount: 52 },
      { vmId: 16, totalLoad: 0.95, cloudletCount: 53 },
      { vmId: 17, totalLoad: 0.92, cloudletCount: 52 },
      { vmId: 18, totalLoad: 0.97, cloudletCount: 57 },
      { vmId: 19, totalLoad: 0.93, cloudletCount: 52 }
    ],
    executionTime: 1450,
    convergenceData: {
      iterations: 50,
      bestFitness: 0.1276,
      convergenceHistory: Array.from({ length: 50 }, (_, i) => 0.18 - (i * 0.0012))
    }
  }
};

export const acoResults = {
  isIterationResult: false,
  rawResults: {
    summary: {
      makespan: 298.92,
      loadImbalance: 0.1421,
      resourceUtilization: 69.89,
      totalCloudlets: 1000,
      totalVms: 20
    },
    vmUtilization: [
      { vmId: 0, totalLoad: 0.94, cloudletCount: 48 },
      { vmId: 1, totalLoad: 0.91, cloudletCount: 46 },
      { vmId: 2, totalLoad: 0.96, cloudletCount: 51 },
      { vmId: 3, totalLoad: 0.83, cloudletCount: 42 },
      { vmId: 4, totalLoad: 0.98, cloudletCount: 55 },
      { vmId: 5, totalLoad: 0.99, cloudletCount: 58 },
      { vmId: 6, totalLoad: 0.95, cloudletCount: 53 },
      { vmId: 7, totalLoad: 0.88, cloudletCount: 47 },
      { vmId: 8, totalLoad: 0.85, cloudletCount: 45 },
      { vmId: 9, totalLoad: 0.87, cloudletCount: 46 },
      { vmId: 10, totalLoad: 0.89, cloudletCount: 47 },
      { vmId: 11, totalLoad: 0.93, cloudletCount: 52 },
      { vmId: 12, totalLoad: 0.81, cloudletCount: 41 },
      { vmId: 13, totalLoad: 0.97, cloudletCount: 56 },
      { vmId: 14, totalLoad: 0.86, cloudletCount: 46 },
      { vmId: 15, totalLoad: 0.92, cloudletCount: 51 },
      { vmId: 16, totalLoad: 0.94, cloudletCount: 52 },
      { vmId: 17, totalLoad: 0.90, cloudletCount: 49 },
      { vmId: 18, totalLoad: 0.96, cloudletCount: 54 },
      { vmId: 19, totalLoad: 0.91, cloudletCount: 50 }
    ],
    executionTime: 2170,
    convergenceData: {
      iterations: 75,
      bestFitness: 0.1421,
      convergenceHistory: Array.from({ length: 75 }, (_, i) => 0.22 - (i * 0.0011))
    }
  }
};