import React, { useState } from 'react';
import { FiInfo, FiDatabase, FiCpu, FiHash, FiCopy, FiCheck, FiChevronDown, FiChevronUp, FiSettings, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MetadataDisplay Component
 */
const MetadataDisplay = ({ metadata, algorithm }) => {
  const [copiedField, setCopiedField] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!metadata) return null;

  const { runId, seed, configSnapshot, datasetId } = metadata;
  
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
   * ISO 9241-110: Immediate feedback principle
   */
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Algorithm-specific styling for better visual distinction
  const algorithmStyles = {
    EACO: {
      gradient: 'from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      iconColor: 'text-teal-600',
      badgeColor: 'bg-teal-100 text-teal-700'
    },
    EPSO: {
      gradient: 'from-purple-50 to-pink-50',
      border: 'border-purple-200',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    default: {
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700'
    }
  };

  const style = algorithmStyles[algorithm] || algorithmStyles.default;

  return (
    <motion.div 
      className={`bg-gradient-to-r ${style.gradient} rounded-lg p-4 mb-4 border ${style.border} shadow-sm hover:shadow-md transition-shadow`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label={`${algorithm} simulation metadata`}
    >
      {/* Header with expand/collapse control */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FiSettings className={`${style.iconColor} mr-2`} />
          <h4 className="text-sm font-semibold text-gray-700">
            {algorithm} Simulation Metadata
          </h4>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${style.badgeColor}`}>
            {configSnapshot?.iterations > 1 ? `${configSnapshot.iterations} iterations` : 'Single run'}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/50 rounded transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      
      {/* Primary metadata grid - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {runId && (
          <div className="bg-white/60 rounded-md p-2 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start min-w-0 flex-1">
                <FiHash className="text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="font-medium text-gray-600 text-xs">Run ID</span>
                  <div
                    className="text-gray-800 font-mono text-xs leading-5 truncate whitespace-nowrap overflow-hidden w-full"
                    title={`Run ID: ${runId}`}
                  >
                    {runId.substring(0, 8)}...
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(runId, 'runId')}
                className="ml-1 p-0.5 hover:bg-gray-100 rounded transition-colors"
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
          <div className="bg-white/60 rounded-md p-2 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start min-w-0 flex-1">
                <FiCpu className="text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="font-medium text-gray-600 text-xs">Random Seed</span>
                  <div
                    className="text-gray-800 font-mono text-xs leading-5 truncate whitespace-nowrap overflow-hidden w-full"
                    title={`Full seed: ${seedText} | Used for reproducibility`}
                  >
                    {formattedSeed}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(seedText, 'seed')}
                className="ml-1 p-0.5 hover:bg-gray-100 rounded transition-colors"
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
          <div className="bg-white/60 rounded-md p-2 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start min-w-0 flex-1">
                <FiDatabase className="text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="font-medium text-gray-600 text-xs">Dataset</span>
                  <div
                    className="text-gray-800 font-mono text-xs leading-5 truncate whitespace-nowrap overflow-hidden w-full"
                    title={datasetId.startsWith('custom') ? 'Custom uploaded workload' : 'Synthetic generated workload'}
                  >
                    {datasetId}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(datasetId, 'dataset')}
                className="ml-1 p-0.5 hover:bg-gray-100 rounded transition-colors"
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
        <div className="bg-white/60 rounded-md p-2 border border-gray-100">
          <div className="flex items-start min-w-0 flex-1">
            <FiClock className="text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="font-medium text-gray-600 text-xs">Timestamp</span>
              <div
                className="text-gray-800 text-xs leading-5"
                title="Simulation execution time"
              >
                {formattedTime}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable section for detailed configuration */}
      <AnimatePresence>
        {isExpanded && configSnapshot && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h5 className="text-xs font-semibold text-gray-600 mb-2">Configuration Details</h5>
              
              {/* Configuration summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div className="bg-white/80 rounded p-2">
                  <span className="text-[10px] text-gray-500 block">Algorithm</span>
                  <span className="text-xs font-medium text-gray-700">{configSnapshot.algorithm || 'N/A'}</span>
                </div>
                <div className="bg-white/80 rounded p-2">
                  <span className="text-[10px] text-gray-500 block">Hosts</span>
                  <span className="text-xs font-medium text-gray-700">{configSnapshot.numHosts || 0}</span>
                </div>
                <div className="bg-white/80 rounded p-2">
                  <span className="text-[10px] text-gray-500 block">VMs</span>
                  <span className="text-xs font-medium text-gray-700">{configSnapshot.numVMs || 0}</span>
                </div>
                <div className="bg-white/80 rounded p-2">
                  <span className="text-[10px] text-gray-500 block">Cloudlets</span>
                  <span className="text-xs font-medium text-gray-700">{configSnapshot.numCloudlets || 0}</span>
                </div>
              </div>
              
              {/* Raw JSON with copy button */}
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(configSnapshot, null, 2), 'config')}
                  className="absolute top-2 right-2 p-1.5 bg-white hover:bg-gray-100 rounded border border-gray-200 transition-colors z-10"
                  aria-label="Copy configuration JSON"
                >
                  {copiedField === 'config' ? (
                    <FiCheck className="text-green-500 w-4 h-4" />
                  ) : (
                    <FiCopy className="text-gray-400 w-4 h-4" />
                  )}
                </button>
                <pre className="p-3 bg-white/80 rounded text-[10px] overflow-x-auto border border-gray-100 font-mono">
                  {JSON.stringify(configSnapshot, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MetadataDisplay;
