import { Play, AlertTriangle } from "lucide-react";
import { ICON_SIZES } from "../../constants/designSystem";

export const RunSimulationButton = ({
  effectiveCloudletCount,
  isSimulating,
  simulationState,
  isCoolingDown,
  config,
  executeSimulation,
  isStorageFull,
}) => {
  // Check valid config
  const hasValidConfig = 
    config.workloadFile || 
    config.cloudletToggleEnabled;

  // CRITICAL: Storage full check takes absolute priority
  // If storage is full, button is ALWAYS disabled regardless of other conditions
  const isDisabled = isStorageFull || 
    !effectiveCloudletCount ||
    isSimulating ||
    simulationState === "loading" ||
    isCoolingDown ||
    !hasValidConfig;

  // Determine button text and appearance
  const getButtonContent = () => {    
    if (isSimulating || simulationState === "loading") {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          Processing...
        </>
      );
    }
    
    if (isCoolingDown) {
      return "Please wait...";
    }
    
    return (
      <>
        <Play size={ICON_SIZES.sm} />
        Run Simulation
      </>
    );
  };

  // Get appropriate title/tooltip text
  const getButtonTitle = () => {
    if (isStorageFull) {
      return "Storage full/Nearly full - clear history before running new simulations";
    }
    if (!hasValidConfig) {
      return "Enable synthetic workload or upload a workload file";
    }
    if (!effectiveCloudletCount) {
      return "No tasks configured";
    }
    if (isSimulating || simulationState === "loading") {
      return "Simulation in progress";
    }
    if (isCoolingDown) {
      return "Cooling down between simulations";
    }
    return "Run simulation with current configuration";
  };

  return (
    <div className="mt-6 flex justify-center flex-col items-center">
      <button
        className="bg-[#319694] text-white px-6 py-2.5 rounded-xl text-base shadow-lg hover:bg-[#267b79] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        onClick={executeSimulation}
        disabled={isDisabled}
        title={getButtonTitle()}
      >
        {getButtonContent()}
      </button>
    </div>
  );
}