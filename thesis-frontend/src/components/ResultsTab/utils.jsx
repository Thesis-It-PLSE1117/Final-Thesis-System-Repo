import React from 'react';
import { 
  Clock,
  Scale,
  Cpu,
  Gauge,
  BatteryFull
} from 'lucide-react';

export const normalizeData = (results) => {
  if (!results || !results.vmUtilization) {
    return null;
  }

  // Create normalized data structure
  const normalized = {
    ...results,
    vmUtilization: results.vmUtilization.map(vm => ({
      ...vm,
      // Scale CPU utilization to 0-1 range
      cpuUtilization: vm.cpuUtilization / 100,
      // Ensure task count is a number
      numAPECloudlets: Number(vm.numAPECloudlets) || 0
    })),
    
    // Normalize summary metrics
    summary: {
      ...results.summary,
      // Convert imbalance degree to percentage
      imbalanceDegree: results.summary.imbalanceDegree * 100,
      // Convert resource utilization to percentage
      resourceUtilization: results.summary.resourceUtilization * 100
    }
  };

  return normalized;
};

export const getSummaryData = (results) => {
  if (!results) return null;

  return {
    makespan: results.summary.makespan.toFixed(2),
    imbalance: results.summary.imbalanceDegree.toFixed(2),
    utilization: results.summary.resourceUtilization.toFixed(2),
    avgResponseTime: results.summary.averageResponseTime.toFixed(2),
    energyConsumption: results.summary.energyConsumption?.toFixed(2) || '0.00' // Added optional chaining
  };
};

export const keyMetrics = [
  {
    title: "Makespan",
    description: "Total time taken to complete all tasks",
    unit: "seconds",
    betterWhen: "lower",
    valueKey: "makespan",
    icon: <Clock className="w-5 h-5" />
  },
  {
    title: "Imbalance Degree",
    description: "Measure of load imbalance across VMs",
    unit: "%",
    betterWhen: "lower",
    valueKey: "imbalance",
    icon: <Scale className="w-5 h-5" />
  },
  {
    title: "Resource Utilization",
    description: "Average utilization of VM resources",
    unit: "%",
    betterWhen: "higher",
    valueKey: "utilization",
    icon: <Cpu className="w-5 h-5" />
  },
  {
    title: "Average Response Time",
    description: "Mean time taken to respond to tasks",
    unit: "ms",
    betterWhen: "lower",
    valueKey: "avgResponseTime",
    icon: <Gauge className="w-5 h-5" />
  },
  {
    title: "Energy Consumption",
    description: "Total energy used by all VMs",
    unit: "kWh",
    betterWhen: "lower",
    valueKey: "energyConsumption",
    icon: <BatteryFull className="w-5 h-5" />
  }
];