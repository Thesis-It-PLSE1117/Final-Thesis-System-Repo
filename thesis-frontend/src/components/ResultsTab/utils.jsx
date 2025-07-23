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
      // Convert imbalance degree to percentage (if < 1, it's a decimal)
      imbalanceDegree: (data.summary.loadBalance || data.summary.imbalanceDegree || 0) < 1 
        ? (data.summary.loadBalance || data.summary.imbalanceDegree || 0) * 100
        : (data.summary.loadBalance || data.summary.imbalanceDegree || 0),
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
  if (!results) return null;

  return {
    makespan: results.summary.makespan.toFixed(2),
    imbalance: (results.summary.loadBalance || results.summary.imbalanceDegree || 0).toFixed(2),
    utilization: results.summary.resourceUtilization.toFixed(2),
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
