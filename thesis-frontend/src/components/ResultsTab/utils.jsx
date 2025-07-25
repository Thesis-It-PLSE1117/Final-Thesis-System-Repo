import React from 'react';
import { 
  Clock,
  Scale,
  Cpu,
  Gauge,
  BatteryFull,
  CheckCircle
} from 'lucide-react';

export const normalizeData = (results) => {
  if (!results) {
    return null;
  }
  
  // Handle new API structure (results.rawResults) and old structure
  const data = results.rawResults || results;
  
  if (!data.vmUtilization) {
    return null;
  }

  // Create normalized data structure
  const normalized = {
    ...data,
    vmUtilization: data.vmUtilization.map(vm => ({
      ...vm,
      // Scale CPU utilization to 0-1 range
      cpuUtilization: vm.cpuUtilization / 100,
      // Ensure task count is a number
      numAPECloudlets: Number(vm.numAPECloudlets) || 0
    })),
    
    // Normalize summary metrics
    summary: {
      ...data.summary,
      // Backend returns loadBalance (0 = perfect balance, 1 = worst imbalance)
      // Convert to load balance percentage (100% = perfect balance)
      loadBalancePercentage: data.summary.loadBalance !== undefined 
        ? ((1 - data.summary.loadBalance) * 100).toFixed(2)
        : 0,
      // Keep the raw loadBalance value for calculations
      loadBalance: data.summary.loadBalance || 0,
      // Resource utilization is already in percentage from backend
      resourceUtilization: data.summary.resourceUtilization,
      // Ensure responseTime field exists
      responseTime: data.summary.responseTime || data.summary.averageResponseTime || 0
    },
    // Include plotData if it exists at the root level
    plotData: results.plotData || data.plotData
  };

  return normalized;
};

export const getSummaryData = (results) => {
  if (!results || !results.summary) return null;

  return {
    makespan: (results.summary.makespan || 0).toFixed(2),
    // Use the load balance percentage (100% = perfect balance)
    imbalance: results.summary.loadBalancePercentage || 
               (results.summary.loadBalance !== undefined 
                 ? ((1 - results.summary.loadBalance) * 100).toFixed(2)
                 : '0'),
    utilization: (results.summary.resourceUtilization || 0).toFixed(2),
    avgResponseTime: (results.summary.responseTime || results.summary.averageResponseTime || 0).toFixed(2),
    energyConsumption: (results.summary.energyConsumption || 0).toFixed(2)
  };
};

export const keyMetrics = [
  {
    title: "Makespan",
    description: "Total time taken to complete all tasks",
    unit: "sec",
    betterWhen: "lower",
    valueKey: "makespan",
    icon: Clock
  },
  {
    title: "Load Balance",
    description: "Measure of load balance across VMs",
    unit: "%",
    betterWhen: "higher",
    valueKey: "imbalance",
    icon: Scale
  },
  {
    title: "Resource Utilization",
    description: "Average utilization of VM resources",
    unit: "%",
    betterWhen: "higher",
    valueKey: "utilization",
    icon: Cpu
  },
  {
    title: "Average Response Time",
    description: "Mean time taken to respond to tasks",
    unit: "secs",
    betterWhen: "lower",
    valueKey: "avgResponseTime",
    icon: Gauge
  },
  {
    title: "Energy Consumption",
    description: "Total energy used by all VMs",
    unit: "Wh",
    betterWhen: "lower",
    valueKey: "energyConsumption",
    icon: BatteryFull
  }
];
