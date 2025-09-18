import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, ChevronUp, X, Info, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

const PresetSelector = ({
  presetConfigs,
  selectedPreset,
  presetDropdownOpen,
  setPresetDropdownOpen,
  handlePresetSelect,
  clearPreset,
  handleClearPreset
}) => {
  const onClearPreset = clearPreset || handleClearPreset;
  const displayPresets = presetConfigs ? 
    Object.keys(presetConfigs).filter(key => key !== 'default') : [];
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPresetInfo = (presetKey) => {
    const presetData = {
      '1k-tasks': {
        title: windowWidth < 768 ? '1K' : 'Small (1K)',
        description: windowWidth < 500 ? 'Testing' : 'Initial testing',
        taskCount: '1,000',
        icon: '🔬'
      },
      '5k-tasks': {
        title: windowWidth < 768 ? '5K' : 'Medium (5K)',
        description: windowWidth < 500 ? 'Evaluation' : 'Workload evaluation',
        taskCount: '5,000',
        icon: '⚖️'
      },
      '10k-tasks': {
        title: windowWidth < 768 ? '10K' : 'Large (10K)',
        description: windowWidth < 500 ? 'Cloud workloads' : 'Cloud workloads',
        taskCount: '10,000',
        icon: '🏢'
      },
      '20k-tasks': {
        title: windowWidth < 768 ? '20K' : 'Enterprise (20K)',
        description: windowWidth < 500 ? 'Stress testing' : 'Stress testing',
        taskCount: '20,000',
        icon: '🌐'
      }
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
      hostToVMRatio: Math.round((config.numVMs / config.numHosts) * 10) / 10
    };
  };

  const currentConfig = selectedPreset && presetConfigs ? presetConfigs[selectedPreset] : 
                       (presetConfigs ? presetConfigs['default'] : null);
  const configSummary = getConfigSummary(currentConfig);

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-[#f0fdfa] rounded-xl p-4 border border-[#319694]/15 shadow-md hover:shadow-lg transition-all duration-300 max-w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-[#319694]/10 rounded-lg mr-3">
          <Settings className="text-[#319694]" size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          {windowWidth > 400 ? 'Workload Presets' : 'Presets'}
        </h3>
      </div>
      
      {/* Preset Dropdown */}
      <div className="mb-3">
        <div className="relative">
          <button
            className="w-full flex items-center justify-between p-2.5 bg-gray-50 border border-gray-300 rounded-md text-left hover:bg-blue-50 hover:border-blue-300 transition-colors duration-150 text-sm"
            onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
          >
            <div className="flex-1 truncate">
              {selectedPreset ? (
                <>
                  <div className="flex items-center">
                    <span className="text-base mr-1.5">{getPresetInfo(selectedPreset).icon}</span>
                    <span className="font-medium text-gray-800 truncate">
                      {getPresetInfo(selectedPreset).title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 block truncate">
                    {getPresetInfo(selectedPreset).description}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <span className="text-base mr-1.5">⚡</span>
                    <span className="font-medium text-gray-800">Default</span>
                  </div>
                  <span className="text-xs text-gray-600 block">
                    {windowWidth > 400 ? 'Balanced setup' : 'Balanced'}
                  </span>
                </>
              )}
            </div>
            <div className="ml-2 flex-shrink-0">
              {presetDropdownOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
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
                {displayPresets.map(presetKey => {
                  const info = getPresetInfo(presetKey);
                  return (
                    <button
                      key={presetKey}
                      className={`w-full p-2.5 text-left transition-colors duration-100 border-b border-gray-100 last:border-b-0 text-sm ${
                        selectedPreset === presetKey
                          ? 'bg-blue-50 text-blue-800 border-blue-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        handlePresetSelect(presetKey);
                        setPresetDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-base mr-2">{info.icon}</span>
                        <div className="font-medium truncate">{info.title}</div>
                      </div>
                      <div className={`text-xs mt-0.5 ${selectedPreset === presetKey ? 'text-blue-600' : 'text-gray-600'} truncate`}>
                        {info.description}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {selectedPreset && (
          <button
            className="mt-2 flex items-center text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded"
            onClick={() => {
              onClearPreset();
              setPresetDropdownOpen(false);
            }}
          >
            <X size={14} className="mr-1" />
            {windowWidth > 350 ? 'Reset to Default' : 'Reset'}
          </button>
        )}
      </div>
      
      {/* Configuration Details */}
      {currentConfig && (
        <motion.div
          className={`mb-4 rounded-xl p-4 border-2 shadow-sm ${
            selectedPreset
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              : 'bg-gradient-to-br from-[#319694]/10 to-[#319694]/20 border-[#319694]/30'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-lg mr-3 ${
              selectedPreset ? 'bg-blue-100' : 'bg-[#319694]/20'
            }`}>
              <Server className={`${
                selectedPreset ? 'text-blue-600' : 'text-[#319694]'
              }`} size={16} />
            </div>
            <h4 className={`text-sm font-bold ${
              selectedPreset ? 'text-blue-800' : 'text-[#319694]'
            }`}>
              {selectedPreset ? `${getPresetInfo(selectedPreset).title} Active` : 'Default Active'}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Infrastructure Column */}
            <div className={`p-3 rounded-lg border ${
              selectedPreset
                ? 'bg-white/60 border-blue-200'
                : 'bg-white/70 border-[#319694]/20'
            }`}>
              <div className={`flex items-center mb-2 ${
                selectedPreset ? 'text-blue-700' : 'text-[#319694]'
              }`}>
                <Server size={14} className="mr-1.5" />
                <span className="text-xs font-semibold">Infrastructure</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hosts:</span>
                  <span className={`font-bold ${
                    selectedPreset ? 'text-blue-800' : 'text-[#319694]'
                  }`}>
                    {currentConfig.numHosts}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">VMs:</span>
                  <span className={`font-bold ${
                    selectedPreset ? 'text-blue-800' : 'text-[#319694]'
                  }`}>
                    {currentConfig.numVMs}
                  </span>
                </div>
                {windowWidth > 420 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ratio:</span>
                    <span className={`font-bold ${
                      selectedPreset ? 'text-blue-800' : 'text-[#319694]'
                    }`}>
                      {configSummary?.hostToVMRatio}:1
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Resources Column */}
            <div className={`p-3 rounded-lg border ${
              selectedPreset
                ? 'bg-white/60 border-blue-200'
                : 'bg-white/70 border-[#319694]/20'
            }`}>
              <div className={`flex items-center mb-2 ${
                selectedPreset ? 'text-blue-700' : 'text-[#319694]'
              }`}>
                <Settings size={14} className="mr-1.5" />
                <span className="text-xs font-semibold">Resources</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">PEs:</span>
                  <span className={`font-bold ${
                    selectedPreset ? 'text-blue-800' : 'text-[#319694]'
                  }`}>
                    {configSummary?.totalPEs}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">RAM:</span>
                  <span className={`font-bold ${
                    selectedPreset ? 'text-blue-800' : 'text-[#319694]'
                  }`}>
                    {configSummary?.totalRAM}G
                  </span>
                </div>
                {windowWidth > 420 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Storage:</span>
                    <span className={`font-bold ${
                      selectedPreset ? 'text-blue-800' : 'text-[#319694]'
                    }`}>
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
                <span className="font-semibold text-indigo-700">Task Counts:</span> Standard benchmarks for algorithm evaluation.
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <span className="font-semibold text-indigo-700">Scalability:</span> Assess performance as workloads grow.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PresetSelector;
