import { useState, useEffect } from "react";

export const useMetrics = (epsoResults, eacoResults) => {
  const [metrics, setMetrics] = useState({
    EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
    EACO: { imbalance: 0, makespan: 0, utilization: 0 },
  });

  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    if (epsoResults && eacoResults) {
      const epsoData = epsoResults.rawResults || epsoResults;
      const eacoData = eacoResults.rawResults || eacoResults;

      setMetrics({
        EPSO: {
          imbalance: getImbalanceValue(epsoData),
          makespan: (epsoData.summary?.makespan || 0).toFixed(2),
          utilization: getUtilizationValue(epsoData),
        },
        EACO: {
          imbalance: getImbalanceValue(eacoData),
          makespan: (eacoData.summary?.makespan || 0).toFixed(2),
          utilization: getUtilizationValue(eacoData),
        },
      });

      setTotalTasks(epsoData.summary?.totalCloudlets || 100);
    }
  }, [epsoResults, eacoResults]);

  const getImbalanceValue = (data) => {
    // Always use raw loadImbalance value, never the normalized loadBalance
    const imbalance = data.summary?.loadImbalance ?? 0;
    return imbalance.toFixed(4);
  };

  const getUtilizationValue = (data) => {
    const utilization = data.summary?.resourceUtilization ?? data.summary?.utilization ?? 0;
    return utilization.toFixed(2);
  };

  return { metrics, setMetrics, totalTasks, setTotalTasks };
};