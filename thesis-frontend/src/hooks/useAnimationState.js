import { useState, useRef } from "react";

export const useAnimationState = (dataCenterConfig) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVMs, setActiveVMs] = useState({ EPSO: [], EACO: [] });
  const [taskCounts, setTaskCounts] = useState({ EPSO: {}, EACO: {} });
  const [cpuLoads, setCpuLoads] = useState({ EPSO: {}, EACO: {} });
  const [highlightedVM, setHighlightedVM] = useState({ EPSO: null, EACO: null });
  const animationRef = useRef(null);

  const resetAnimationState = () => {
    const resetCounts = { EPSO: {}, EACO: {} };
    const resetLoads = { EPSO: {}, EACO: {} };
    
    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      resetCounts.EPSO[i] = 0;
      resetLoads.EPSO[i] = 0;
      resetCounts.EACO[i] = 0;
      resetLoads.EACO[i] = 0;
    }

    setTaskCounts(resetCounts);
    setCpuLoads(resetLoads);
    setActiveVMs({ EPSO: [], EACO: [] });
    setProgress(0);
    setHighlightedVM({ EPSO: null, EACO: null });
  };

  return {
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    activeVMs,
    setActiveVMs,
    taskCounts,
    setTaskCounts,
    cpuLoads,
    setCpuLoads,
    highlightedVM,
    setHighlightedVM,
    animationRef,
    resetAnimationState
  };
};