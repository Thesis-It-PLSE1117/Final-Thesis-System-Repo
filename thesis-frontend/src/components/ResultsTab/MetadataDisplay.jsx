import React from 'react';
import { FiInfo, FiDatabase, FiCpu, FiHash } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MetadataDisplay = ({ metadata, algorithm }) => {
  if (!metadata) return null;

  const { runId, seed, configSnapshot, datasetId } = metadata;
  
  if (!runId && !seed && !configSnapshot && !datasetId) {
    return null; // No metadata available
  }

  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-3">
        <FiInfo className="text-blue-600 mr-2" />
        <h4 className="text-sm font-semibold text-gray-700">
          {algorithm} Run Metadata
        </h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {runId && (
          <div className="flex items-start">
            <FiHash className="text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-600">Run ID:</span>
              <div className="text-gray-800 break-all font-mono text-[10px]">
                {runId.substring(0, 8)}...
              </div>
            </div>
          </div>
        )}
        
        {seed && (
          <div className="flex items-start">
            <FiCpu className="text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-600">Seed:</span>
              <div className="text-gray-800 font-mono">
                {seed}
              </div>
            </div>
          </div>
        )}
        
        {datasetId && (
          <div className="flex items-start">
            <FiDatabase className="text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-600">Dataset:</span>
              <div className="text-gray-800">
                {datasetId}
              </div>
            </div>
          </div>
        )}
        
        {configSnapshot && (
          <div className="flex items-start">
            <FiInfo className="text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-600">Config:</span>
              <div className="text-gray-800">
                {configSnapshot.algorithm || 'N/A'} | 
                {configSnapshot.numHosts || 0} hosts | 
                {configSnapshot.numVMs || 0} VMs
              </div>
            </div>
          </div>
        )}
      </div>
      
      {configSnapshot && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-medium">
            View Full Configuration
          </summary>
          <pre className="mt-2 p-2 bg-white rounded text-[10px] overflow-x-auto">
            {JSON.stringify(configSnapshot, null, 2)}
          </pre>
        </details>
      )}
    </motion.div>
  );
};

export default MetadataDisplay;
