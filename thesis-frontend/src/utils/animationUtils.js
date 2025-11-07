export const processVMData = (vmUtilization) => {
  const loads = {};
  const counts = {};
  const activeVMs = [];
  let maxLoad = 0;
  let maxVmId = null;

  if (vmUtilization) {
    vmUtilization.forEach((vm) => {
      const vmId = vm.vmId;
      loads[vmId] = vm.cpuUtilization / 100 || 0;
      counts[vmId] = vm.numAPECloudlets || 0;
      
      if (vm.cpuUtilization > 0) activeVMs.push(vmId);
      if (vm.cpuUtilization > maxLoad) {
        maxLoad = vm.cpuUtilization;
        maxVmId = vmId;
      }
    });
  }

  return { loads, counts, activeVMs, maxVmId };
};

export const interpolateVMState = (progress, finalData, dataCenterConfig) => {
  const currentLoads = {};
  const currentCounts = {};
  const currentActiveVMs = [];

  const percentPerVM = 95 / Math.max(finalData.activeVMs.length, 1);

  for (let i = 0; i < dataCenterConfig.numVMs; i++) {
    const revealThreshold = finalData.activeVMs.indexOf(i) * percentPerVM;

    if (finalData.activeVMs.includes(i) && progress >= revealThreshold) {
      currentActiveVMs.push(i);
      const vmVisibleProgress = Math.min(
        100,
        (progress - revealThreshold) * (100 / percentPerVM),
      ) / 100;
      
      currentLoads[i] = finalData.loads[i] * vmVisibleProgress;
      currentCounts[i] = Math.round(finalData.counts[i] * vmVisibleProgress);
    } else {
      currentLoads[i] = 0;
      currentCounts[i] = 0;
    }
  }

  return { currentLoads, currentCounts, currentActiveVMs };
};