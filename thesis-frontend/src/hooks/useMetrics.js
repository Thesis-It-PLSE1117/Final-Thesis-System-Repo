import { useState, useEffect } from "react";

export const useMetrics = (epsoResults, eacoResults, acoResults, psoResults) => {
  const [metrics, setMetrics] = useState({
    EPSO: { imbalance: 0, makespan: 0, utilization: 0, energyConsumption: 0, responseTime: 0 },
    EACO: { imbalance: 0, makespan: 0, utilization: 0, energyConsumption: 0, responseTime: 0 },
    PSO: { imbalance: 0, makespan: 0, utilization: 0, energyConsumption: 0, responseTime: 0 },
    ACO: { imbalance: 0, makespan: 0, utilization: 0, energyConsumption: 0, responseTime: 0 },
  });

  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    console.log('=== UPDATING METRICS FROM RESULTS ===');
    console.log('EPSO Results:', epsoResults);
    console.log('EACO Results:', eacoResults);
    console.log('ACO Results:', acoResults);
    console.log('PSO Results:', psoResults);

    if (epsoResults || eacoResults || acoResults || psoResults) {
      const epsoData = epsoResults?.rawResults || epsoResults || {};
      const eacoData = eacoResults?.rawResults || eacoResults || {};
      const acoData = acoResults?.rawResults || acoResults || {};
      const psoData = psoResults?.rawResults || psoResults || {};

      const newMetrics = {
        EPSO: {
          imbalance: getImbalanceValue(epsoData),
          makespan: getMakespanValue(epsoData),
          utilization: getUtilizationValue(epsoData),
          energyConsumption: getEnergyConsumptionValue(epsoData),
          responseTime: getResponseTimeValue(epsoData),
        },
        EACO: {
          imbalance: getImbalanceValue(eacoData),
          makespan: getMakespanValue(eacoData),
          utilization: getUtilizationValue(eacoData),
          energyConsumption: getEnergyConsumptionValue(eacoData),
          responseTime: getResponseTimeValue(eacoData),
        },
        PSO: {
          imbalance: getImbalanceValue(psoData),
          makespan: getMakespanValue(psoData),
          utilization: getUtilizationValue(psoData),
          energyConsumption: getEnergyConsumptionValue(psoData),
          responseTime: getResponseTimeValue(psoData),
        },
        ACO: {
          imbalance: getImbalanceValue(acoData),
          makespan: getMakespanValue(acoData),
          utilization: getUtilizationValue(acoData),
          energyConsumption: getEnergyConsumptionValue(acoData),
          responseTime: getResponseTimeValue(acoData),
        },
      };

      console.log('New Metrics:', newMetrics);
      setMetrics(newMetrics);

      // Use the first available result to set total tasks
      const firstResult = epsoData || eacoData || acoData || psoData;
      setTotalTasks(firstResult.summary?.totalCloudlets || 100);
    }
  }, [epsoResults, eacoResults, acoResults, psoResults]);

  const getImbalanceValue = (data) => {
    const imbalance = data.summary?.loadImbalance ?? 0;
    return imbalance.toFixed(4);
  };

  const getMakespanValue = (data) => {
    const makespan = data.summary?.makespan ?? 0;
    return makespan.toFixed(2);
  };

  const getUtilizationValue = (data) => {
    const utilization = data.summary?.resourceUtilization ?? data.summary?.utilization ?? 0;
    return utilization.toFixed(2);
  };

  const getEnergyConsumptionValue = (data) => {
    const energy = data.summary?.energyConsumption ?? 0;
    return energy.toFixed(2);
  };

  const getResponseTimeValue = (data) => {
    const responseTime = data.summary?.responseTime ?? 0;
    return responseTime.toFixed(2);
  };

  return { metrics, setMetrics, totalTasks, setTotalTasks };
};