import { useEffect } from "react";
import { processVMData, interpolateVMState } from "../utils/animationUtils";

export const useAnimationEngine = ({
  dataCenterConfig,
  epsoResults,
  eacoResults,
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

  const handlePlayPause = () => {
    if (isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      startAnimation();
    }
  };

  const startAnimation = () => {
    if (!epsoResults || !eacoResults) return;

    setIsPlaying(true);
    setShowResultsButton(false);

    const epsoData = epsoResults.rawResults || epsoResults;
    const eacoData = eacoResults.rawResults || eacoResults;

    // Process final state from backend
    const finalEpsoData = processVMData(epsoData.vmUtilization);
    const finalEacoData = processVMData(eacoData.vmUtilization);

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

      // Interpolate VM states
      const epsoState = interpolateVMState(newProgress, finalEpsoData, dataCenterConfig);
      const eacoState = interpolateVMState(newProgress, finalEacoData, dataCenterConfig);

      // Update VM states
      setActiveVMs({
        EPSO: epsoState.currentActiveVMs,
        EACO: eacoState.currentActiveVMs,
      });
      setTaskCounts({
        EPSO: epsoState.currentCounts,
        EACO: eacoState.currentCounts,
      });
      setCpuLoads({
        EPSO: epsoState.currentLoads,
        EACO: eacoState.currentLoads,
      });

      // Update highlighted VMs
      updateHighlightedVMs(epsoState.currentLoads, eacoState.currentLoads);

      // Update metrics
      updateMetrics(newProgress, epsoData, eacoData);

      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        finishAnimation(finalEpsoData, finalEacoData, epsoData, eacoData);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const updateHighlightedVMs = (epsoLoads, eacoLoads) => {
    let maxEpsoLoad = 0;
    let maxEpsoVmId = null;
    let maxEacoLoad = 0;
    let maxEacoVmId = null;

    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      if (epsoLoads[i] > maxEpsoLoad) {
        maxEpsoLoad = epsoLoads[i];
        maxEpsoVmId = i;
      }
      if (eacoLoads[i] > maxEacoLoad) {
        maxEacoLoad = eacoLoads[i];
        maxEacoVmId = i;
      }
    }

    setHighlightedVM({ EPSO: maxEpsoVmId, EACO: maxEacoVmId });
  };

  const updateMetrics = (progress, epsoData, eacoData) => {
    const epsoImbalance = getImbalanceValue(epsoData);
    const eacoImbalance = getImbalanceValue(eacoData);

    setMetrics({
      EPSO: progress >= 99 ? getFinalMetrics(epsoData) : getInterpolatedMetrics(epsoData, progress),
      EACO: progress >= 99 ? getFinalMetrics(eacoData) : getInterpolatedMetrics(eacoData, progress),
    });
  };

  const getImbalanceValue = (data) => {
    return data.summary?.loadImbalance ?? 0;
  };

  const getFinalMetrics = (data) => ({
    imbalance: getImbalanceValue(data).toFixed(4),
    makespan: (data.summary?.makespan || 0).toFixed(2),
    utilization: (data.summary?.resourceUtilization || 0).toFixed(2),
  });

  const getInterpolatedMetrics = (data, progress) => ({
    imbalance: (getImbalanceValue(data) * (progress / 100)).toFixed(4),
    makespan: ((data.summary?.makespan || 0) * (progress / 100)).toFixed(2),
    utilization: ((data.summary?.resourceUtilization || 0) * (progress / 100)).toFixed(2),
  });

  const finishAnimation = (finalEpsoData, finalEacoData, epsoData, eacoData) => {
    setIsPlaying(false);
    setShowResultsButton(true);
    
    setActiveVMs({
      EPSO: finalEpsoData.activeVMs,
      EACO: finalEacoData.activeVMs,
    });
    setTaskCounts({
      EPSO: finalEpsoData.counts,
      EACO: finalEacoData.counts,
    });
    setCpuLoads({
      EPSO: finalEpsoData.loads,
      EACO: finalEacoData.loads,
    });
    setHighlightedVM({
      EPSO: finalEpsoData.maxVmId,
      EACO: finalEacoData.maxVmId,
    });
    setMetrics({
      EPSO: getFinalMetrics(epsoData),
      EACO: getFinalMetrics(eacoData),
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