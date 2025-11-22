import { useMemo } from "react";

const STATUS_KEY_MAP = {
  'Overloaded': 'overloaded',
  'High Load': 'highLoad',
  'Medium Load': 'mediumLoad',
  'Normal': 'normal',
  'Low Load': 'lowLoad',
  'Idle': 'idle',
  'Critical Overload': 'criticalOverload'
};

export const useVMStatusDistribution = (
  activeVMs,
  taskCounts,
  cpuLoads,
  getVmStatus,
  algorithm
) => {
  return useMemo(() => {
    const distribution = {
      idle: 0,
      lowLoad: 0,
      normal: 0,
      mediumLoad: 0,
      highLoad: 0,
      overloaded: 0,
      criticalOverload: 0,
      total: 0
    };

    if (!activeVMs || activeVMs.length === 0) {
      return distribution;
    }

    activeVMs.forEach(vmId => {
      const status = getVmStatus(vmId, algorithm);
      const key = STATUS_KEY_MAP[status];
      
      if (key && Object.prototype.hasOwnProperty.call(distribution, key)) {
        distribution[key]++;
      }
    });

    distribution.total = activeVMs.length;

    return distribution;
  }, [activeVMs, getVmStatus, algorithm]);
};
