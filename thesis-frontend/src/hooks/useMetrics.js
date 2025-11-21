import { useState, useEffect } from "react";

export const useMetrics = (epsoResults, eacoResults, acoResults, psoResults) => {
  const [metrics, setMetrics] = useState({
    EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
    EACO: { imbalance: 0, makespan: 0, utilization: 0 },
    PSO: { imbalance: 0, makespan: 0, utilization: 0 },
    ACO: { imbalance: 0, makespan: 0, utilization: 0 },
  });

  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    if (epsoResults || eacoResults || acoResults || psoResults) {
      const epsoData = epsoResults?.rawResults || epsoResults || {};
      const eacoData = eacoResults?.rawResults || eacoResults || {};
      const acoData = acoResults?.rawResults || acoResults || {};
      const psoData = psoResults?.rawResults || psoResults || {};

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
        PSO: {
          imbalance: getImbalanceValue(psoData),
          makespan: (psoData.summary?.makespan || 0).toFixed(2),
          utilization: getUtilizationValue(psoData),
        },
        ACO: {
          imbalance: getImbalanceValue(acoData),
          makespan: (acoData.summary?.makespan || 0).toFixed(2),
          utilization: getUtilizationValue(acoData),
        },
      });

      // Use the first available result to set total tasks
      const firstResult = epsoData || eacoData || acoData || psoData;
      setTotalTasks(firstResult.summary?.totalCloudlets || 100);
    }
  }, [epsoResults, eacoResults, acoResults, psoResults]);

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