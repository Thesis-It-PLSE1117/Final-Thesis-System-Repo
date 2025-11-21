import { useState, useRef } from "react";

export const useAnimationState = (dataCenterConfig) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVMs, setActiveVMs] = useState({ 
    EPSO: [], 
    EACO: [], 
    PSO: [], 
    ACO: [] 
  });
  const [taskCounts, setTaskCounts] = useState({ 
    EPSO: {}, 
    EACO: {}, 
    PSO: {}, 
    ACO: {} 
  });
  const [cpuLoads, setCpuLoads] = useState({ 
    EPSO: {}, 
    EACO: {}, 
    PSO: {}, 
    ACO: {} 
  });
  const [highlightedVM, setHighlightedVM] = useState({ 
    EPSO: null, 
    EACO: null, 
    PSO: null, 
    ACO: null 
  });
  const animationRef = useRef(null);

  const resetAnimationState = () => {
    const resetCounts = { 
      EPSO: {}, 
      EACO: {}, 
      PSO: {}, 
      ACO: {} 
    };
    const resetLoads = { 
      EPSO: {}, 
      EACO: {}, 
      PSO: {}, 
      ACO: {} 
    };
    
    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      resetCounts.EPSO[i] = 0;
      resetLoads.EPSO[i] = 0;
      resetCounts.EACO[i] = 0;
      resetLoads.EACO[i] = 0;
      resetCounts.PSO[i] = 0;
      resetLoads.PSO[i] = 0;
      resetCounts.ACO[i] = 0;
      resetLoads.ACO[i] = 0;
    }

    setTaskCounts(resetCounts);
    setCpuLoads(resetLoads);
    setActiveVMs({ 
      EPSO: [], 
      EACO: [], 
      PSO: [], 
      ACO: [] 
    });
    setProgress(0);
    setHighlightedVM({ 
      EPSO: null, 
      EACO: null, 
      PSO: null, 
      ACO: null 
    });
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