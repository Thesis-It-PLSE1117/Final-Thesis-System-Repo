import { useMemo } from 'react';

//flag for matlab ui
export const useFeatureFlags = () => {
  const featureFlags = useMemo(() => {
    return {
      enableMatlabPlots: import.meta.env.VITE_ENABLE_MATLAB_PLOTS === 'true',
      enableMatlabToggle: import.meta.env.VITE_ENABLE_MATLAB_TOGGLE === 'true',
      
      enableHistory: import.meta.env.VITE_ENABLE_HISTORY === 'true',
      maxHistoryEntries: parseInt(import.meta.env.VITE_MAX_HISTORY_ENTRIES || '50', 10),
      
      enableDebugMode: import.meta.env.MODE === 'development',
      
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
    };
  }, []);

  return featureFlags;
};

export const useMatlabFeatures = () => {
  const flags = useFeatureFlags();
  
  return {
    showMatlabToggle: flags.enableMatlabToggle,
    allowMatlabPlots: flags.enableMatlabPlots,
    showMatlabUI: flags.enableMatlabToggle && flags.enableMatlabPlots
  };
};

export default useFeatureFlags;
