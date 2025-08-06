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
  
  console.log('normalizeData input:', results);
  

  if (results.rawResults && results.rawResults.totalIterations) {

    const bestResult = results.rawResults.bestResult || 
                      (results.rawResults.individualResults && results.rawResults.individualResults[0]);
    
    if (!bestResult || !bestResult.vmUtilization) {
      console.warn('No valid bestResult found in iteration data');
      return null;
    }
    
    console.log('Processing iteration result, bestResult:', bestResult);
    

    const normalized = {
      ...bestResult,
      vmUtilization: bestResult.vmUtilization.map(vm => ({
        ...vm,

        cpuUtilization: vm.cpuUtilization / 100,

        numAPECloudlets: Number(vm.numAPECloudlets) || 0
      })),
      

      summary: {
        ...results.rawResults.averageMetrics,
     
        loadBalancePercentage: results.rawResults.averageMetrics.loadBalance !== undefined 
          ? ((1 - results.rawResults.averageMetrics.loadBalance) * 100).toFixed(2)
          : 0,

        loadBalance: results.rawResults.averageMetrics.loadBalance || 0,

        resourceUtilization: results.rawResults.averageMetrics.resourceUtilization,

        responseTime: results.rawResults.averageMetrics.responseTime || 0
      },

      plotData: results.plotData,

      iterationData: results.rawResults
    };
    
    console.log('Normalized iteration result:', normalized);
    return normalized;
  }
  
  const data = results.rawResults || results;
  
  if (!data.vmUtilization) {
    console.warn('No vmUtilization found in single run data');
    return null;
  }

  console.log('Processing single run result');

  const normalized = {
    ...data,
    vmUtilization: data.vmUtilization.map(vm => ({
      ...vm,
      cpuUtilization: vm.cpuUtilization / 100,
      numAPECloudlets: Number(vm.numAPECloudlets) || 0
    })),
    
    summary: {
      ...data.summary,
      loadBalancePercentage: data.summary.loadBalance !== undefined 
        ? ((1 - data.summary.loadBalance) * 100).toFixed(2)
        : 0,
      loadBalance: data.summary.loadBalance || 0,
      resourceUtilization: data.summary.resourceUtilization,
      responseTime: data.summary.responseTime || data.summary.averageResponseTime || 0
    },
    plotData: results.plotData || data.plotData
  };
  
  console.log('Normalized single run result:', normalized);
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
    unit: "sec",
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
