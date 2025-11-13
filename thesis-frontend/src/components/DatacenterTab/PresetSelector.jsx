import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Server,
  Microscope,
  Scale,
  Building2,
  Trash2,
  RotateCcw,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";

const PresetSelector = ({
  presetConfigs,
  selectedPreset,
  presetDropdownOpen,
  setPresetDropdownOpen,
  handlePresetSelect,
  clearPreset,
  handleClearPreset,
}) => {
  const onClearPreset = clearPreset || handleClearPreset;
  const displayPresets = presetConfigs
    ? Object.keys(presetConfigs).filter((key) => key !== "default")
    : [];
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPresetInfo = (presetKey) => {
    const presetData = {
      "small-scale": {
        title: windowWidth < 768 ? "SS" : "Small Scale",
        description:
          windowWidth < 500
            ? "Quick test"
            : "Test algorithms quickly",
        taskCount: "1,000",
        icon: Microscope,
        iconColor: "text-blue-600",
      },
      "medium-scale": {
        title: windowWidth < 768 ? "MS" : "Medium Scale",
        description:
          windowWidth < 500 ? "Compare speed" : "Compare performance | Real-world test",
        taskCount: "5,000",
        icon: Scale,
        iconColor: "text-purple-600",
      },
      "large-scale": {
        title: windowWidth < 768 ? "RS" : "Research Setup",
        description:
          windowWidth < 500 ? "Real scenario" : "For Production Grade",
        taskCount: "10,000",
        icon: Building2,
        iconColor: "text-orange-600",
      },
    };
    return presetData[presetKey] || {};
  };

  const getConfigSummary = (config) => {
    if (!config) return null;

    const totalPEs = config.numHosts * config.numPesPerHost;
    const totalRAM = (config.numHosts * config.ramPerHost) / 1024;
    const totalStorage = (config.numHosts * config.storagePerHost) / 1000000;

    return {
      totalPEs,
      totalRAM: Math.round(totalRAM * 10) / 10,
      totalStorage: Math.round(totalStorage * 10) / 10,
      hostToVMRatio: Math.round((config.numVMs / config.numHosts) * 10) / 10,
    };
  };

  const currentConfig =
    selectedPreset && presetConfigs
      ? presetConfigs[selectedPreset]
      : presetConfigs
        ? presetConfigs["default"]
        : null;
  const configSummary = getConfigSummary(currentConfig);

  const handleClearConfig = () => {
    onClearPreset();
    setPresetDropdownOpen(false);
    setShowClearModal(false);
  };

  // Check if there's anything to clear (either preset is selected or custom config exists)
  const hasConfigToClear = selectedPreset || true; // Always true since we want it always active

  return (
    <>
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm w-full mx-auto shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {selectedPreset ? 'Clear Preset?' : 'Reset Configuration?'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedPreset 
                    ? 'This will reset all settings to default and remove the current preset.'
                    : 'This will reset all settings to their default values.'
                  }
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setShowClearModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleClearConfig}
                >
                  <RotateCcw size={16} />
                  {selectedPreset ? 'Clear Preset' : 'Reset'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-gradient-to-br from-white to-[#f0fdfa] rounded-xl p-4 border border-[#319694]/15 shadow-md hover:shadow-lg transition-all duration-300 max-w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#319694]/10 rounded-lg mr-3">
              <Settings className="text-[#319694]" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {windowWidth > 400 ? "Workload Presets" : "Presets"}
            </h3>
          </div>
          
          {/* Always Active Clear Button */}
          <motion.button
            className={`p-2 rounded-lg border transition-all duration-200 ${
              selectedPreset 
                ? "text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setShowClearModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={selectedPreset ? "Clear preset configuration" : "Reset to default settings"}
          >
            <RotateCcw size={18} />
          </motion.button>
        </div>

        {/* Preset Status Indicator - Minimalist */}
        {selectedPreset && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                {getPresetInfo(selectedPreset).title}
              </span>
            </div>
            <span className="text-xs font-semibold text-green-700 px-2 py-1 bg-green-100 rounded">
              ACTIVE
            </span>
          </motion.div>
        )}

        {/* Preset Dropdown */}
        <div className="mb-3">
          <div className="relative">
            <button
              className={`w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#319694]/30 ${
                selectedPreset
                  ? "bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 border-2 border-[#319694]/40 hover:border-[#319694]/60"
                  : "bg-white border border-[#319694]/30 hover:border-[#319694]"
              }`}
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {selectedPreset ? (
                    <div>
                      <div className="flex items-center">
                        {(() => {
                          const info = getPresetInfo(selectedPreset);
                          const IconComponent = info.icon;
                          return IconComponent ? (
                            <IconComponent
                              size={16}
                              className={`mr-1.5 ${info.iconColor}`}
                            />
                          ) : null;
                        })()}
                        <span className="font-semibold text-[#267b79] truncate">
                          {getPresetInfo(selectedPreset).title}
                        </span>
                      </div>
                      <span className="text-sm text-[#319694] block mt-0.5">
                        {getPresetInfo(selectedPreset).description}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Server size={16} className="text-gray-400 mr-1.5" />
                        <span className="font-medium text-gray-800">
                          Select a Preset
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 block">
                        {windowWidth > 400
                          ? "Pick a ready-made setup"
                          : "Choose preset"}
                      </span>
                    </>
                  )}
                </div>
                <div className="ml-2 flex items-center gap-2">
                  <div className="flex-shrink-0">
                    {presetDropdownOpen ? (
                      <ChevronUp size={16} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {presetDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden"
                >
                  {displayPresets.map((presetKey) => {
                    const info = getPresetInfo(presetKey);
                    const IconComponent = info.icon;
                    return (
                      <button
                        key={presetKey}
                        className={`w-full p-2.5 text-left transition-colors duration-100 border-b border-gray-100 last:border-b-0 text-sm ${
                          selectedPreset === presetKey
                            ? "bg-[#319694]/10 text-[#319694] border-[#319694]/20"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          handlePresetSelect(presetKey);
                          setPresetDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          {IconComponent && (
                            <IconComponent
                              size={16}
                              className={`mr-2 ${info.iconColor}`}
                            />
                          )}
                          <div className="font-medium truncate">{info.title}</div>
                        </div>
                        <div
                          className={`text-sm mt-0.5 ${selectedPreset === presetKey ? "text-[#267b79]" : "text-gray-600"} truncate`}
                        >
                          {info.description}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Configuration Details */}
        {currentConfig && (
          <motion.div
            className={`mb-4 rounded-xl p-4 border-2 shadow-md ${
              selectedPreset
                ? "bg-gradient-to-br from-[#319694]/8 to-[#4fd1c5]/8 border-[#319694]/30 ring-2 ring-[#319694]/20"
                : "bg-white border-gray-200"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg mr-3 ${
                    selectedPreset
                      ? "bg-gradient-to-br from-[#319694]/20 to-[#4fd1c5]/20"
                      : "bg-gray-100"
                  }`}
                >
                  <Server
                    className={
                      selectedPreset ? "text-[#319694]" : "text-gray-500"
                    }
                    size={16}
                  />
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${selectedPreset ? "text-[#319694]" : "text-gray-700"}`}
                  >
                    {selectedPreset
                      ? `${getPresetInfo(selectedPreset).title} Configuration`
                      : "Default Configuration"}
                  </h4>
                  {/* {selectedPreset && (
                    <p className="text-sm text-[#267b79] mt-0.5">
                      Optimized for {getPresetInfo(selectedPreset).taskCount}{" "}
                      tasks
                    </p>
                  )} */}
                </div>
              </div>
              {/* Minimalist Active Indicator */}
              {selectedPreset && (
                <span className="text-xs font-semibold text-green-700 px-2 py-1 bg-green-100 rounded">
                  ACTIVE
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Infrastructure Column */}
              <div className="p-3 rounded-lg border bg-white/70 border-[#319694]/20">
                <div className="flex items-center mb-2 text-[#319694]">
                  <Server size={14} className="mr-1.5" />
                  <span className="text-sm font-semibold">Infrastructure</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hosts:</span>
                    <span
                      className={`font-bold ${
                        selectedPreset ? "text-blue-800" : "text-[#319694]"
                      }`}
                    >
                      {currentConfig.numHosts}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">VMs:</span>
                    <span className="font-bold text-[#319694]">
                      {currentConfig.numVMs}
                    </span>
                  </div>
                  {windowWidth > 420 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ratio:</span>
                      <span className="font-bold text-[#319694]">
                        {configSummary?.hostToVMRatio}:1
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources Column */}
              <div className="p-3 rounded-lg border bg-white/70 border-[#319694]/20">
                <div className="flex items-center mb-2 text-[#319694]">
                  <Settings size={14} className="mr-1.5" />
                  <span className="text-sm font-semibold">Resources</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">PEs:</span>
                    <span
                      className={`font-bold ${
                        selectedPreset ? "text-blue-800" : "text-[#319694]"
                      }`}
                    >
                      {configSummary?.totalPEs}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">RAM:</span>
                    <span className="font-bold text-[#319694]">
                      {configSummary?.totalRAM}G
                    </span>
                  </div>
                  {windowWidth > 420 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-bold text-[#319694]">
                        {configSummary?.totalStorage}T
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Research Information - Only show on larger screens */}
        {windowWidth > 640 && (
          <div className="space-y-4">
            {/* Research Standards Card */}
            <motion.div
              className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <Info className="text-indigo-600" size={16} />
                </div>
                <h4 className="text-sm font-bold text-gray-800">
                  Research Standards
                </h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-semibold text-indigo-700">
                      Task Counts:
                    </span>{" "}
                    Standard benchmarks for algorithm evaluation.
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-semibold text-indigo-700">
                      Scalability:
                    </span>{" "}
                    Assess performance as workloads grow.
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Clock className="text-amber-600" size={16} />
                </div>
                <h4 className="text-sm font-bold text-gray-800">
                  Time Estimates (Simulation)
                </h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-semibold text-amber-700">Large Scale:</span>{" "}
                    ~10 min/iteration • 30 Iterations: 1-4 hrs • 50 Iterations: 2-8 hrs.
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-semibold text-amber-700">Medium Scale:</span>{" "}
                    ~1 min/iteration • 30 Iteration: ~40 min • 50 Iteration: ~1 hr.
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <span className="font-semibold text-amber-700">Small Scale:</span>{" "}
                    ~1-20 min total runtime.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default PresetSelector;