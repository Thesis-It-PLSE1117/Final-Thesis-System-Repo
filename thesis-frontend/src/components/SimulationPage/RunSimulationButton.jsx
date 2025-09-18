import { Play } from 'lucide-react';

export const RunSimulationButton = ({ 
  effectiveCloudletCount, 
  isSimulating, 
  simulationState, 
  isCoolingDown, 
  config,
  executeSimulation 
}) => {
  return (
    <div className="mt-8 flex justify-center">
      <button
        className="bg-[#319694] text-white px-8 py-3 rounded-2xl text-lg shadow hover:bg-[#267b79] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        onClick={executeSimulation}
        disabled={
          !effectiveCloudletCount || 
          isSimulating || 
          simulationState === 'loading' || 
          isCoolingDown ||
          (!config.workloadFile && !config.selectedPreset && !config.cloudletToggleEnabled)
        }
      >
        {isSimulating || simulationState === 'loading' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : isCoolingDown ? (
          'Please wait...'
        ) : (
          <>
            <Play size={18} />
            Run Simulation
          </>
        )}
      </button>
    </div>
  );
};