import { FiActivity, FiClock, FiZap, FiServer, FiLayers } from 'react-icons/fi';

export const normalizeData = (data) => {
  if (!data) return null;
  
  console.group('🔄 Normalizing Data');
  console.log('📥 Raw data input:', data);
  
  const cloudlets = data.cloudlets?.map(c => ({
    ...c,
    finishTime: c.finishTime || 0,
    responseTime: c.responseTime || 0
  })) || [];
  
  const makespan = cloudlets.length > 0 
    ? Math.max(...cloudlets.map(c => c.finishTime)) 
    : 0;
    
  console.log('⏱️ Calculated makespan:', makespan);
  
  const averageResponseTime = cloudlets.length > 0
    ? (cloudlets.reduce((sum, c) => sum + (c.responseTime || 0), 0) / cloudlets.length)
    : 0;
    
  console.log('⏱️ Calculated average response time:', averageResponseTime);
  
  const normalized = {
    ...data,
    cloudlets,
    summary: {
      ...data.summary,
      totalCloudlets: data.summary?.totalCloudlets || cloudlets.length,
      finishedCloudlets: data.summary?.finishedCloudlets || cloudlets.length,
      averageResponseTime: data.summary?.averageResponseTime || averageResponseTime
    },
    makespan
  };
  
  console.log('📤 Normalized output:', normalized);
  console.groupEnd();
  
  return normalized;
};

export const getSummaryData = (results) => {
  if (!results) return {
    totalTasks: 0,
    completedTasks: 0,
    makespan: 0,
    avgResponseTime: 0,
    cpuUtilization: 0,
    energyConsumption: 0,
    loadImbalance: 0
  };

  console.group('📊 Generating Summary Data');
  console.log('📥 Input results:', results);

  const cloudlets = results.cloudlets || [];
  const vmUtilization = results.vmUtilization || [];
    
  const avgResponseTime = cloudlets.length > 0
    ? (cloudlets.reduce((sum, c) => sum + (c.responseTime || 0), 0) / cloudlets.length)
    : 0;
    
  const cpuUtilization = results.summary?.resourceUtilization != null
    ? results.summary.resourceUtilization * 100
    : vmUtilization.length > 0
      ? vmUtilization.reduce((acc, vm) => acc + (vm.cpuUtilization || 0), 0) / vmUtilization.length
      : 0;
  
  const summary = {
    totalTasks: results.summary?.totalCloudlets || cloudlets.length,
    completedTasks: results.summary?.finishedCloudlets || cloudlets.length,
    makespan: results.makespan || 0,
    avgResponseTime: results.summary?.averageResponseTime || avgResponseTime,
    cpuUtilization: cpuUtilization,
    energyConsumption: results.energyConsumption?.totalEnergyWh || 0

  };
  
  console.log('📤 Generated summary:', summary);
  console.groupEnd();
  
  return summary;
};

export const keyMetrics = [
  {
    title: "Resource Utilization",
    description: "Average CPU utilization across all VMs",
    icon: FiActivity,
    unit: "%",
    betterWhen: "higher"
  },
  {
    title: "Response Time",
    description: "Average task response time",
    icon: FiClock,
    unit: "s",
    betterWhen: "lower"
  },
  {
    title: "Energy Efficiency",
    description: "Total energy consumed",
    icon: FiZap,
    unit: "Wh",
    betterWhen: "lower"
  },
  {
    title: "Load Imbalance",
    description: "Standard deviation of VM utilization",
    icon: FiServer,
    unit: "%",
    betterWhen: "lower"
  },
  {
    title: "Makespan",
    description: "Total time to complete all tasks",
    icon: FiLayers,
    unit: "s",
    betterWhen: "lower"
  }
];