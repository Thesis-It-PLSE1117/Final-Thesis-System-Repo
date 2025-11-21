import { useEffect } from "react";
import { processVMData, interpolateVMState } from "../utils/animationUtils";

export const useAnimationEngine = ({
  dataCenterConfig,
  epsoResults,
  eacoResults,
  acoResults,
  psoResults,
  animationState,
  metricsState,
  setShowResultsButton,
}) => {
  const {
    isPlaying,
    setIsPlaying,
    setProgress,
    setActiveVMs,
    setTaskCounts,
    setCpuLoads,
    setHighlightedVM,
    animationRef,
    resetAnimationState,
  } = animationState;

  const { setMetrics, metrics } = metricsState;

  // Add console logs to see the structure of the results
  useEffect(() => {
    console.log('=== EPSO RESULTS STRUCTURE ===');
    console.log('Full EPSO results:', epsoResults);
    console.log('EPSO rawResults:', epsoResults?.rawResults);
    console.log('EPSO vmUtilization:', epsoResults?.rawResults?.vmUtilization);
    console.log('EPSO summary:', epsoResults?.rawResults?.summary);
    
    console.log('=== EACO RESULTS STRUCTURE ===');
    console.log('Full EACO results:', eacoResults);
    console.log('EACO rawResults:', eacoResults?.rawResults);
    console.log('EACO vmUtilization:', eacoResults?.rawResults?.vmUtilization);
    console.log('EACO summary:', eacoResults?.rawResults?.summary);

    // Log processed VM data
    if (epsoResults?.rawResults?.vmUtilization) {
      const processedEpso = processVMData(epsoResults.rawResults.vmUtilization);
      console.log('=== PROCESSED EPSO DATA ===');
      console.log('Active VMs:', processedEpso.activeVMs);
      console.log('Task counts:', processedEpso.counts);
      console.log('CPU loads:', processedEpso.loads);
      console.log('Max VM ID:', processedEpso.maxVmId);
    }

    if (eacoResults?.rawResults?.vmUtilization) {
      const processedEaco = processVMData(eacoResults.rawResults.vmUtilization);
      console.log('=== PROCESSED EACO DATA ===');
      console.log('Active VMs:', processedEaco.activeVMs);
      console.log('Task counts:', processedEaco.counts);
      console.log('CPU loads:', processedEaco.loads);
      console.log('Max VM ID:', processedEaco.maxVmId);
    }
  }, [epsoResults, eacoResults]);

  const handlePlayPause = () => {
    if (isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      startAnimation();
    }
  };

  const startAnimation = () => {
    if (!epsoResults && !eacoResults && !acoResults && !psoResults) return;

    setIsPlaying(true);
    setShowResultsButton(false);

    const epsoData = epsoResults?.rawResults || epsoResults || {};
    const eacoData = eacoResults?.rawResults || eacoResults || {};
    const acoData = acoResults?.rawResults || acoResults || {};
    const psoData = psoResults?.rawResults || psoResults || {};

    // Log data before processing
    console.log('=== STARTING ANIMATION WITH DATA ===');
    console.log('EPSO data for animation:', epsoData);
    console.log('EACO data for animation:', eacoData);
    console.log('ACO data for animation:', acoData);
    console.log('PSO data for animation:', psoData);

    // Process final state from backend for all algorithms
    const finalEpsoData = processVMData(epsoData.vmUtilization);
    const finalEacoData = processVMData(eacoData.vmUtilization);
    const finalAcoData = processVMData(acoData.vmUtilization);
    const finalPsoData = processVMData(psoData.vmUtilization);

    // Log processed data
    console.log('=== FINAL PROCESSED DATA ===');
    console.log('Final EPSO processed:', finalEpsoData);
    console.log('Final EACO processed:', finalEacoData);
    console.log('Final ACO processed:', finalAcoData);
    console.log('Final PSO processed:', finalPsoData);

    resetAnimationState();

    const startTime = performance.now();
    const duration = 10000; // 10 seconds
    const updateInterval = 1000 / 30; // 30fps
    let lastUpdateTime = 0;

    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);

      if (timestamp - lastUpdateTime < updateInterval && newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdateTime = timestamp;

      setProgress(newProgress);

      // Interpolate VM states for all algorithms
      const epsoState = interpolateVMState(newProgress, finalEpsoData, dataCenterConfig);
      const eacoState = interpolateVMState(newProgress, finalEacoData, dataCenterConfig);
      const acoState = interpolateVMState(newProgress, finalAcoData, dataCenterConfig);
      const psoState = interpolateVMState(newProgress, finalPsoData, dataCenterConfig);

      // Log interpolated states periodically
      if (newProgress % 25 === 0) {
        console.log(`=== PROGRESS ${newProgress}% ===`);
        console.log('EPSO interpolated state:', epsoState);
        console.log('EACO interpolated state:', eacoState);
      }

      // Update VM states for all algorithms
      setActiveVMs({
        EPSO: epsoState.currentActiveVMs,
        EACO: eacoState.currentActiveVMs,
        PSO: psoState.currentActiveVMs,
        ACO: acoState.currentActiveVMs,
      });
      setTaskCounts({
        EPSO: epsoState.currentCounts,
        EACO: eacoState.currentCounts,
        PSO: psoState.currentCounts,
        ACO: acoState.currentCounts,
      });
      setCpuLoads({
        EPSO: epsoState.currentLoads,
        EACO: eacoState.currentLoads,
        PSO: psoState.currentLoads,
        ACO: acoState.currentLoads,
      });

      // Update highlighted VMs for all algorithms
      updateHighlightedVMs(epsoState.currentLoads, eacoState.currentLoads, acoState.currentLoads, psoState.currentLoads);

      // Update metrics for all algorithms
      updateMetrics(newProgress, epsoData, eacoData, acoData, psoData);

      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        finishAnimation(finalEpsoData, finalEacoData, finalAcoData, finalPsoData, epsoData, eacoData, acoData, psoData);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const updateHighlightedVMs = (epsoLoads, eacoLoads, acoLoads, psoLoads) => {
    let maxEpsoLoad = 0;
    let maxEpsoVmId = null;
    let maxEacoLoad = 0;
    let maxEacoVmId = null;
    let maxAcoLoad = 0;
    let maxAcoVmId = null;
    let maxPsoLoad = 0;
    let maxPsoVmId = null;

    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      if (epsoLoads[i] > maxEpsoLoad) {
        maxEpsoLoad = epsoLoads[i];
        maxEpsoVmId = i;
      }
      if (eacoLoads[i] > maxEacoLoad) {
        maxEacoLoad = eacoLoads[i];
        maxEacoVmId = i;
      }
      if (acoLoads[i] > maxAcoLoad) {
        maxAcoLoad = acoLoads[i];
        maxAcoVmId = i;
      }
      if (psoLoads[i] > maxPsoLoad) {
        maxPsoLoad = psoLoads[i];
        maxPsoVmId = i;
      }
    }

    // Log highlighted VMs
    console.log('Highlighted VMs - EPSO:', maxEpsoVmId, 'Load:', maxEpsoLoad);
    console.log('Highlighted VMs - EACO:', maxEacoVmId, 'Load:', maxEacoLoad);

    setHighlightedVM({ 
      EPSO: maxEpsoVmId, 
      EACO: maxEacoVmId,
      ACO: maxAcoVmId,
      PSO: maxPsoVmId
    });
  };

  const updateMetrics = (progress, epsoData, eacoData, acoData, psoData) => {
    const newMetrics = {
      EPSO: progress >= 99 ? getFinalMetrics(epsoData) : getInterpolatedMetrics(epsoData, progress),
      EACO: progress >= 99 ? getFinalMetrics(eacoData) : getInterpolatedMetrics(eacoData, progress),
      PSO: progress >= 99 ? getFinalMetrics(psoData) : getInterpolatedMetrics(psoData, progress),
      ACO: progress >= 99 ? getFinalMetrics(acoData) : getInterpolatedMetrics(acoData, progress),
    };

    // Log metrics updates
    if (progress % 25 === 0) {
      console.log(`Metrics at ${progress}%:`, newMetrics);
    }

    setMetrics(newMetrics);
  };

  const getImbalanceValue = (data) => {
    return data.summary?.loadImbalance ?? 0;
  };

  const getEnergyConsumption = (data) => {
    return data.summary?.energyConsumption ?? 0;
  };

  const getResponseTime = (data) => {
    return data.summary?.responseTime ?? 0;
  };

  const getFinalMetrics = (data) => {
    const metrics = {
      imbalance: getImbalanceValue(data).toFixed(4),
      makespan: (data.summary?.makespan || 0).toFixed(2),
      utilization: (data.summary?.resourceUtilization || 0).toFixed(2),
      energyConsumption: getEnergyConsumption(data).toFixed(2),
      responseTime: getResponseTime(data).toFixed(2),
    };
    console.log('Final metrics for:', data, metrics);
    return metrics;
  };

  const getInterpolatedMetrics = (data, progress) => ({
    imbalance: (getImbalanceValue(data) * (progress / 100)).toFixed(4),
    makespan: ((data.summary?.makespan || 0) * (progress / 100)).toFixed(2),
    utilization: ((data.summary?.resourceUtilization || 0) * (progress / 100)).toFixed(2),
    energyConsumption: (getEnergyConsumption(data) * (progress / 100)).toFixed(2),
    responseTime: (getResponseTime(data) * (progress / 100)).toFixed(2),
  });

  const finishAnimation = (finalEpsoData, finalEacoData, finalAcoData, finalPsoData, epsoData, eacoData, acoData, psoData) => {
    console.log('=== ANIMATION FINISHED ===');
    console.log('Final EPSO state:', finalEpsoData);
    console.log('Final EACO state:', finalEacoData);
    console.log('Final EPSO metrics:', getFinalMetrics(epsoData));
    console.log('Final EACO metrics:', getFinalMetrics(eacoData));

    setIsPlaying(false);
    setShowResultsButton(true);
    
    setActiveVMs({
      EPSO: finalEpsoData.activeVMs,
      EACO: finalEacoData.activeVMs,
      PSO: finalPsoData.activeVMs,
      ACO: finalAcoData.activeVMs,
    });
    setTaskCounts({
      EPSO: finalEpsoData.counts,
      EACO: finalEacoData.counts,
      PSO: finalPsoData.counts,
      ACO: finalAcoData.counts,
    });
    setCpuLoads({
      EPSO: finalEpsoData.loads,
      EACO: finalEacoData.loads,
      PSO: finalPsoData.loads,
      ACO: finalAcoData.loads,
    });
    setHighlightedVM({
      EPSO: finalEpsoData.maxVmId,
      EACO: finalEacoData.maxVmId,
      PSO: finalPsoData.maxVmId,
      ACO: finalAcoData.maxVmId,
    });
    setMetrics({
      EPSO: getFinalMetrics(epsoData),
      EACO: getFinalMetrics(eacoData),
      PSO: getFinalMetrics(psoData),
      ACO: getFinalMetrics(acoData),
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { handlePlayPause };
};