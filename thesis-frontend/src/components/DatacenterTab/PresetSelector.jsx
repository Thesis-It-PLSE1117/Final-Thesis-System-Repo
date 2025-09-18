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
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm max-w-full">
      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
        <Settings className="mr-2 text-blue-600" size={18} />
        {windowWidth > 400 ? 'Configuration' : 'Config'}
      </h3>
      
      {/* Preset Dropdown */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {windowWidth > 380 ? 'Workload Presets' : 'Presets'}
        </label>
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
        <div className={`mb-3 rounded-md p-2.5 border ${
          selectedPreset 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <h4 className={`text-xs font-medium mb-2 flex items-center ${
            selectedPreset ? 'text-blue-700' : 'text-green-700'
          }`}>
            <Server size={14} className="mr-1.5" />
            {selectedPreset ? `${getPresetInfo(selectedPreset).title} Active` : 'Default Active'}
          </h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`${selectedPreset ? 'text-blue-600' : 'text-green-600'}`}>
              <div className="font-medium mb-1">Infrastructure</div>
              <div className="space-y-0.5">
                <div>Hosts: <span className="font-semibold">{currentConfig.numHosts}</span></div>
                <div>VMs: <span className="font-semibold">{currentConfig.numVMs}</span></div>
                {windowWidth > 420 && (
                  <div>Ratio: <span className="font-semibold">{configSummary?.hostToVMRatio}:1</span></div>
                )}
              </div>
            </div>
            <div className={`${selectedPreset ? 'text-blue-600' : 'text-green-600'}`}>
              <div className="font-medium mb-1">Resources</div>
              <div className="space-y-0.5">
                <div>PEs: <span className="font-semibold">{configSummary?.totalPEs}</span></div>
                <div>RAM: <span className="font-semibold">{configSummary?.totalRAM}G</span></div>
                {windowWidth > 420 && (
                  <div>Storage: <span className="font-semibold">{configSummary?.totalStorage}T</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Research Information - Only show on larger screens */}
      {windowWidth > 640 && (
        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Info size={14} className="mr-1.5 text-indigo-600" />
            Research Standards
          </h4>
          <div className="text-xs text-gray-600 space-y-1.5">
            <p className="leading-tight">
              <strong>Task Counts:</strong> Standard benchmarks for algorithm evaluation.
            </p>
            <p className="leading-tight">
              <strong>Scalability:</strong> Assess performance as workloads grow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetSelector;