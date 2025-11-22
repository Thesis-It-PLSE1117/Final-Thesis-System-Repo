import { useMemo } from "react";

export const useVMStatus = (activeVMs, taskCounts, cpuLoads) => {
  const getVmStatus = (vmId, algorithm) => {
    const cpuLoad = (cpuLoads[algorithm] && cpuLoads[algorithm][vmId]) || 0;
    const cpuPercentage = cpuLoad * 100;

    const vmTaskCount = taskCounts[algorithm][vmId] || 0;

    const activeVMsForAlgorithm = activeVMs[algorithm];
    const totalTasksForAlgorithm = Object.values(taskCounts[algorithm]).reduce(
      (sum, count) => sum + count,
      0,
    );
    
    const avgTasksPerVm = activeVMsForAlgorithm.length > 0 
      ? totalTasksForAlgorithm / activeVMsForAlgorithm.length 
      : 0;
    
    const taskOverloadThreshold = avgTasksPerVm > 0 ? avgTasksPerVm * 1.5 : 8;

    const isCpuOverloaded = cpuPercentage > 80;
    const isTaskOverloaded = vmTaskCount > taskOverloadThreshold;

    if (cpuPercentage > 100) return "Critical Overload";
    if (isCpuOverloaded && isTaskOverloaded) return "Overloaded";
    if (cpuPercentage > 65) return "High Load";
    if (cpuPercentage > 30) return "Medium Load";
    if (cpuPercentage > 10) return "Normal";
    if (cpuPercentage > 0) return "Low Load";
    return "Idle";
  };


  const getStatusColor = (status) => {
    const statusColors = {
      "Critical Overload": "bg-purple-100 text-purple-800 border-purple-300",
      "Overloaded": "bg-red-100 text-red-800 border-red-300",
      "High Load": "bg-orange-100 text-orange-800 border-orange-300",
      "Medium Load": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Normal": "bg-blue-100 text-blue-800 border-blue-300",
      "Low Load": "bg-green-100 text-green-800 border-green-300",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return { getVmStatus, getStatusColor };
};