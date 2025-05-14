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
    avgResponseTime: results.summary.averageResponseTime.toFixed(2)
  };
};
