import React, { useState } from 'react';
import { FiDatabase, FiCpu, FiHash, FiCopy, FiCheck, FiSettings, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * MetadataDisplay Component
 */
const MetadataDisplay = ({ metadata, algorithm }) => {
  const [copiedField, setCopiedField] = useState(null);
  
  if (!metadata) return null;

  const { runId, seed, configSnapshot, datasetId } = metadata;
  
  // Enhanced algorithm detection with proper priority for EPSO
  const detectAlgorithm = () => {
    // Priority 1: Direct prop (if provided)
    if (algorithm) return algorithm;
    
    // Priority 2: From configSnapshot - check both algorithm and optimizationAlgorithm
    if (configSnapshot) {
      // Check for EPSO first in optimizationAlgorithm (older system)
      if (configSnapshot.optimizationAlgorithm) {
        const optAlgo = configSnapshot.optimizationAlgorithm.toString().toUpperCase();
        if (optAlgo.includes('EPSO')) return 'EPSO';
        if (optAlgo.includes('EACO')) return 'EACO';
      }
      
      // Then check regular algorithm field
      if (configSnapshot.algorithm) {
        const algo = configSnapshot.algorithm.toString().toUpperCase();
        if (algo.includes('EPSO')) return 'EPSO';
        if (algo.includes('EACO')) return 'EACO';
      }
      
      // Fallback to other possible fields
      const algo = 
        configSnapshot.schedulingAlgorithm ||
        configSnapshot.algo;
      
      if (algo) return algo;
    }
    
    // Priority 3: From metadata root
    const metaAlgo = 
      metadata.optimizationAlgorithm ||
      metadata.algorithm ||
      metadata.schedulingAlgorithm;
    
    return metaAlgo || 'Unknown';
  };

  const detectedAlgorithm = detectAlgorithm();
  
  // Normalize algorithm name for EACO and EPSO
  const normalizeAlgorithmName = (algo) => {
    if (!algo) return 'default';
    
    const normalized = algo.toString().toUpperCase().trim();
    
    // Match EACO and EPSO exactly or as substrings
    if (normalized.includes('EACO')) return 'EACO';
    if (normalized.includes('EPSO')) return 'EPSO';
    
    return 'default';
  };

  const algorithmKey = normalizeAlgorithmName(detectedAlgorithm);
  const displayAlgorithmName = algorithmKey === 'EACO' ? 'EACO' : 
                              algorithmKey === 'EPSO' ? 'EPSO' : 
                              detectedAlgorithm;

  // Format seed for display with proper null checking
  const seedText = seed !== undefined && seed !== null ? String(seed) : '';
  const formattedSeed = seedText.length > 12 
    ? `${seedText.slice(0, 8)}…${seedText.slice(-4)}` 
    : seedText;
  
  // Format timestamp if available
  const timestamp = metadata.timestamp || new Date().toISOString();
  const formattedTime = new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  
  if (!runId && !seed && !configSnapshot && !datasetId) {
    return null; // No metadata available
  }

  /**
   * Copy to clipboard with visual feedback
   */
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Algorithm-specific styling for EACO and EPSO
  const algorithmStyles = {
    EACO: {
      gradient: 'from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      iconColor: 'text-teal-600',
      badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
      displayName: 'EACO'
    },
    EPSO: {
      gradient: 'from-purple-50 to-indigo-50',
      border: 'border-purple-200',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      displayName: 'EPSO'
    },
    default: {
      gradient: 'from-gray-50 to-slate-50',
      border: 'border-gray-200',
      iconColor: 'text-gray-600',
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
      displayName: 'Algorithm'
    }
  };

  const style = algorithmStyles[algorithmKey] || algorithmStyles.default;

  // Configuration details in a list format with sections
  const renderConfigDetails = () => {
    if (!configSnapshot) return null;

    // Host Configuration
    const hostConfigItems = [
      { label: 'Number of Hosts', value: configSnapshot.numHosts || 0 },
      { label: 'PEs per Host', value: configSnapshot.numPesPerHost || 0 },
      { label: 'MIPS per PE', value: configSnapshot.peMips || 0, suffix: 'MIPS' },
      { label: 'RAM per Host', value: configSnapshot.ramPerHost || 0, suffix: 'MB' },
      { label: 'Bandwidth per Host', value: configSnapshot.bwPerHost || 0, suffix: 'Mbps' },
      { label: 'Storage per Host', value: configSnapshot.storagePerHost || 0, suffix: 'MB' },
    ];

    // VM Configuration
    const vmConfigItems = [
      { label: 'Number of VMs', value: configSnapshot.numVMs || 0 },
      { label: 'MIPS per VM', value: configSnapshot.vmMips || 0, suffix: 'MIPS' },
      { label: 'PEs per VM', value: configSnapshot.vmPes || 0 },
      { label: 'RAM per VM', value: configSnapshot.vmRam || 0, suffix: 'MB' },
      { label: 'Bandwidth per VM', value: configSnapshot.vmBw || 0, suffix: 'Mbps' },
      { label: 'Storage per VM', value: configSnapshot.vmSize || 0, suffix: 'MB' },
    ];

    // Workload & System Configuration
    const systemConfigItems = [
      { label: 'Number of Cloudlets', value: configSnapshot.numCloudlets || 0 },
      { label: 'Workload Type', value: configSnapshot.workloadType || 'CSV' },
      { label: 'Use Default Workload', value: configSnapshot.useDefaultWorkload ? 'Yes' : 'No' },
    ];

    // Iterations
    const iterationItems = [
      { label: 'Iterations', value: configSnapshot.iterations || 1 },
    ];

    const ConfigSection = ({ title, items }) => (
      <div className="mb-6 last:mb-0">
        <h6 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide border-b border-gray-200 pb-1">{title}</h6>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1 px-2 hover:bg-white/50 rounded">
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                {item.suffix && (
                  <span className="text-xs text-gray-500">{item.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="mt-4 pt-4 border-t border-gray-200/60">
        <h5 className="text-sm font-semibold text-gray-700 mb-4">Configuration Details</h5>
        
        <div className="space-y-4">
          <div className="bg-white/50 rounded-lg p-4 border border-gray-100">
            <ConfigSection title="Iterations" items={iterationItems} />
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 border border-gray-100">
            <ConfigSection title="Host Configuration" items={hostConfigItems} />
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 border border-gray-100">
            <ConfigSection title="VM Configuration" items={vmConfigItems} />
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 border border-gray-100">
            <ConfigSection title="System Configuration" items={systemConfigItems} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={`bg-gradient-to-r ${style.gradient} rounded-xl p-5 mb-4 border ${style.border} shadow-sm hover:shadow-md transition-all duration-300`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label={`${displayAlgorithmName} simulation metadata`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${style.badgeColor} border mr-3`}>
            <FiSettings className={`${style.iconColor} w-4 h-4`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">
              {displayAlgorithmName} Simulation
            </h4>
            <p className="text-xs text-gray-500">Run configuration and metadata</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${style.badgeColor} border`}>
          {configSnapshot?.iterations > 1 ? `${configSnapshot.iterations} iterations` : 'Single run'}
        </div>
      </div>
      
      {/* Primary metadata grid - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {runId && (
          <div className="bg-white/80 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start min-w-0 flex-1">
                <FiHash className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="font-medium text-gray-600 text-xs">Run ID</span>
                  <div
                    className="text-gray-800 font-mono text-sm leading-5 truncate"
                    title={`Run ID: ${runId}`}
                  >
                    {runId.substring(0, 10)}...
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(runId, 'runId')}
                className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Copy Run ID"
                title="Copy to clipboard"
              >
                {copiedField === 'runId' ? (
                  <FiCheck className="text-green-500 w-3 h-3" />
                ) : (
                  <FiCopy className="text-gray-400 w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        )}
        
        {seed && (
          <div className="bg-white/80 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start min-w-0 flex-1">
                <FiCpu className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="font-medium text-gray-600 text-xs">Random Seed</span>
                  <div
                    className="text-gray-800 font-mono text-sm leading-5 truncate"
                    title={`Full seed: ${seedText}`}
                  >
                    {formattedSeed}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(seedText, 'seed')}
                className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Copy Seed"
                title="Copy to clipboard"
              >
                {copiedField === 'seed' ? (
                  <FiCheck className="text-green-500 w-3 h-3" />
                ) : (
                  <FiCopy className="text-gray-400 w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        )}
        
        {datasetId && (
          <div className="bg-white/80 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start min-w-0 flex-1">
                <FiDatabase className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="font-medium text-gray-600 text-xs">Dataset</span>
                  <div
                    className="text-gray-800 font-mono text-sm leading-5 truncate"
                    title={datasetId}
                  >
                    {datasetId}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(datasetId, 'dataset')}
                className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Copy Dataset ID"
                title="Copy to clipboard"
              >
                {copiedField === 'dataset' ? (
                  <FiCheck className="text-green-500 w-3 h-3" />
                ) : (
                  <FiCopy className="text-gray-400 w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Timestamp display */}
        <div className="bg-white/80 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-start min-w-0 flex-1">
            <FiClock className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-medium text-gray-600 text-xs">Timestamp</span>
              <div
                className="text-gray-800 text-sm leading-5"
                title="Simulation execution time"
              >
                {formattedTime}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Configuration Details */}
      {renderConfigDetails()}
    </motion.div>
  );
};

export default MetadataDisplay;