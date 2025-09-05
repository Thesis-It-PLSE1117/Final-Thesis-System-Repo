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
  
  

  if (results.rawResults && results.rawResults.totalIterations) {

    const bestResult = results.rawResults.bestResult || 
                      (results.rawResults.individualResults && results.rawResults.individualResults[0]) || {};
    
    

    const normalized = {
      ...bestResult,
      vmUtilization: Array.isArray(bestResult.vmUtilization)
        ? bestResult.vmUtilization.map(vm => ({
            ...vm,
            cpuUtilization: (Number(vm.cpuUtilization) || 0) / 100,
            numAPECloudlets: Number(vm.numAPECloudlets) || 0
          }))
        : [],
      
      summary: {
        ...(results.rawResults.averageMetrics || {}),
        loadBalancePercentage: (results.rawResults.averageMetrics && results.rawResults.averageMetrics.loadImbalance !== undefined)
          ? Math.max(0, (1 - results.rawResults.averageMetrics.loadImbalance) * 100).toFixed(2)
          : (results.rawResults.averageMetrics && results.rawResults.averageMetrics.loadBalance !== undefined)
            ? ((1 - results.rawResults.averageMetrics.loadBalance) * 100).toFixed(2)
            : 0,
        loadBalance: (results.rawResults.averageMetrics && results.rawResults.averageMetrics.loadBalance) || 0,
        resourceUtilization: results.rawResults.averageMetrics ? (results.rawResults.averageMetrics.resourceUtilization || results.rawResults.averageMetrics.utilization || 0) : 0,
        responseTime: results.rawResults.averageMetrics ? (results.rawResults.averageMetrics.responseTime || 0) : 0
      },

      plotData: results.plotData,

      iterationData: results.rawResults
    };
    
    return normalized;
  }
  
  const data = results.rawResults || results || {};
  

  const normalized = {
    ...data,
    vmUtilization: Array.isArray(data.vmUtilization)
      ? data.vmUtilization.map(vm => ({
          ...vm,
          cpuUtilization: (Number(vm.cpuUtilization) || 0) / 100,
          numAPECloudlets: Number(vm.numAPECloudlets) || 0
        }))
      : [],
    
    summary: (() => {
      const s = data.summary || {};
      const rawDI = s.loadImbalance !== undefined ? s.loadImbalance : (s.loadBalance !== undefined ? s.loadBalance : 0);
      return {
        ...s,
        loadBalancePercentage: Math.max(0, (1 - rawDI) * 100).toFixed(2),
        loadBalance: s.loadBalance !== undefined ? s.loadBalance : rawDI,
        resourceUtilization: s.resourceUtilization !== undefined ? s.resourceUtilization : (s.utilization !== undefined ? s.utilization : 0),
        responseTime: s.responseTime || s.averageResponseTime || 0
      };
    })(),
    plotData: results.plotData || data.plotData
  };
  
  return normalized;
};

export const getSummaryData = (results) => {
  if (!results || !results.summary) return null;

  return {
    makespan: (results.summary.makespan || 0).toFixed(2),

    imbalance: results.summary.loadBalancePercentage || 
               (results.summary.loadBalance !== undefined 
                 ? ((1 - results.summary.loadBalance) * 100).toFixed(2)
                 : '0'),
    utilization: (results.summary.resourceUtilization || results.summary.utilization || 0).toFixed(2),
    avgResponseTime: (results.summary.responseTime || results.summary.averageResponseTime || 0).toFixed(2),
    energyConsumption: (results.summary.energyConsumption || 0).toFixed(2)
  };
};

export const keyMetrics = [
  {
    title: "Makespan",
    description: "Total time taken to complete all tasks",
    unit: " secs",
    betterWhen: "lower",
    valueKey: "makespan",
    icon: Clock
  },
  {
    title: "Balance",
    description: "Load distribution balance across VMs (100% - DI)",
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
    unit: " secs",
    betterWhen: "lower",
    valueKey: "avgResponseTime",
    icon: Gauge
  },
  {
    title: "Energy Consumption",
    description: "Total energy used by all VMs",
    unit: " Wh",
    betterWhen: "lower",
    valueKey: "energyConsumption",
    icon: BatteryFull
  }
];
