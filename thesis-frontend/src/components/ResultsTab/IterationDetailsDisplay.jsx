import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  ChevronUp,
  Table,
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  EyeOff,
  Award,
  BarChart3,
  Info,
  Filter,
  ChartBar,
  Database,
  Activity,
  GitCompare
} from 'lucide-react';

const IterationDetailsDisplay = ({ eacoResults, epsoResults }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('summary');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showMiniChart, setShowMiniChart] = useState(true);

  // Helper to safely extract individual results
  const getIndividualResults = (results) => {
    if (!results || !results.individualResults) return [];
    return results.individualResults.filter(r => r && r.summary);
  };

  const eacoIterations = getIndividualResults(eacoResults);
  const epsoIterations = getIndividualResults(epsoResults);

  if (eacoIterations.length === 0 && epsoIterations.length === 0) {
    return null;
  }

  const availableMetrics = [
    { key: 'makespan', label: 'Makespan', unit: 's', format: (v) => v.toFixed(3), color: 'blue' },
    { key: 'energyConsumption', label: 'Energy', unit: 'Wh', format: (v) => v.toFixed(2), color: 'yellow' },
    { key: 'resourceUtilization', label: 'Resource Util', unit: '%', format: (v) => v.toFixed(2), color: 'green' },
    { key: 'responseTime', label: 'Response Time', unit: 's', format: (v) => v.toFixed(3), color: 'purple' },
    { key: 'loadBalance', label: 'Load Balance', unit: '', format: (v) => v.toFixed(4), color: 'indigo' },
    { key: 'fitness', label: 'Fitness Score', unit: '', format: (v) => v.toFixed(4), color: 'pink' }
  ];

  // Filter metrics based on selection
  const displayMetrics = selectedMetric === 'all' 
    ? availableMetrics 
    : availableMetrics.filter(m => m.key === selectedMetric);

  // Calculate differences for paired comparisons
  const calculateDifference = (eacoValue, epsoValue, metric) => {
    const diff = eacoValue - epsoValue;
    const percentDiff = epsoValue !== 0 ? (diff / epsoValue) * 100 : 0;
    
    const isLowerBetter = ['makespan', 'energyConsumption', 'responseTime', 'loadBalance', 'fitness'].includes(metric);
    
    let trend = 'neutral';
    if (diff < 0) trend = isLowerBetter ? 'better' : 'worse';
    if (diff > 0) trend = isLowerBetter ? 'worse' : 'better';
    
    return { diff, percentDiff, trend };
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (eacoIterations.length === 0 || epsoIterations.length === 0) return null;
    
    const stats = {};
    availableMetrics.forEach(metric => {
      const eacoValues = eacoIterations.map(iter => iter.summary[metric.key] || 0);
      const epsoValues = epsoIterations.map(iter => iter.summary[metric.key] || 0);
      
      const eacoAvg = eacoValues.reduce((a, b) => a + b, 0) / eacoValues.length;
      const epsoAvg = epsoValues.reduce((a, b) => a + b, 0) / epsoValues.length;
      
      const { trend, percentDiff } = calculateDifference(eacoAvg, epsoAvg, metric.key);
      
      stats[metric.key] = {
        eacoAvg,
        epsoAvg,
        winner: trend === 'better' ? 'EACO' : trend === 'worse' ? 'EPSO' : 'Tie',
        improvement: Math.abs(percentDiff),
        trend
      };
    });
    
    return stats;
  }, [eacoIterations, epsoIterations]);

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = ['Iteration', 'Algorithm', ...availableMetrics.map(m => m.label)].join(',');
    
    const rows = [];
    
    // Add EACO data
    eacoIterations.forEach((iter, idx) => {
      const values = [
        idx + 1,
        'EACO',
        ...availableMetrics.map(m => iter.summary[m.key] || 0)
      ];
      rows.push(values.join(','));
    });
    
    // Add EPSO data
    epsoIterations.forEach((iter, idx) => {
      const values = [
        idx + 1,
        'EPSO',
        ...availableMetrics.map(m => iter.summary[m.key] || 0)
      ];
      rows.push(values.join(','));
    });
    
    // Add paired differences
    const minIterations = Math.min(eacoIterations.length, epsoIterations.length);
    for (let i = 0; i < minIterations; i++) {
      const values = [
        i + 1,
        'Difference (EACO-EPSO)',
        ...availableMetrics.map(m => {
          const eacoVal = eacoIterations[i].summary[m.key] || 0;
          const epsoVal = epsoIterations[i].summary[m.key] || 0;
          return eacoVal - epsoVal;
        })
      ];
      rows.push(values.join(','));
    }
    
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `iteration_details_${Date.now()}.csv`;
    link.click();
  };

  // Mini sparkline chart component
  const MiniSparkline = ({ data, color = 'blue' }) => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="60" height="20" className="inline-block ml-2">
        <polyline
          fill="none"
          stroke={`var(--tw-colors-${color}-500)`}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      {/* Enhanced Header */}
      <div 
        className={`bg-gradient-to-r ${showDetails ? 'from-[#319694] to-[#4fd1c5]' : 'from-gray-50 to-gray-100'} 
                   rounded-t-xl border border-gray-200 transition-all duration-300 ${!showDetails && 'rounded-b-xl'}`}
      >
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-6 py-5 flex items-center justify-between hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${showDetails ? 'bg-white/20' : 'bg-[#319694]/10'}`}>
              <Database className={showDetails ? 'text-white' : 'text-[#319694]'} size={24} />
            </div>
            <div className="text-left">
              <h3 className={`font-bold text-lg ${showDetails ? 'text-white' : 'text-gray-800'}`}>
                Individual Iteration Results
              </h3>
              <p className={`text-sm mt-0.5 ${showDetails ? 'text-white/80' : 'text-gray-600'}`}>
                Detailed analysis of {Math.max(eacoIterations.length, epsoIterations.length)} iterations • Raw paired data used in t-test
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className={showDetails ? 'text-white' : 'text-gray-600'} size={24} />
            </motion.div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-x border-b border-gray-200 bg-white rounded-b-xl overflow-hidden"
          >
            {/* View Mode Tabs */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex gap-2">
                  {[
                    { id: 'summary', label: 'Summary', icon: Award },
                    { id: 'paired', label: 'Paired Differences', icon: GitCompare },
                    { id: 'both', label: 'All Data', icon: Table },
                    { id: 'eaco', label: 'EACO Only', icon: Activity },
                    { id: 'epso', label: 'EPSO Only', icon: Activity }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedAlgorithm(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                        ${selectedAlgorithm === tab.id 
                          ? 'bg-[#319694] text-white shadow-md' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Metric Filter */}
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#319694] bg-white"
                    >
                      <option value="all">All Metrics</option>
                      {availableMetrics.map(m => (
                        <option key={m.key} value={m.key}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Export Button */}
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {selectedAlgorithm === 'summary' ? (
                // Summary View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayMetrics.map(metric => {
                    const stats = summaryStats?.[metric.key];
                    if (!stats) return null;
                    
                    return (
                      <motion.div
                        key={metric.key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">{metric.label}</h4>
                          </div>
                          {stats.winner !== 'Tie' && (
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              stats.winner === 'EACO' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {stats.winner} ↑{stats.improvement.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">EACO Avg:</span>
                            <span className="font-mono font-medium text-gray-800">
                              {metric.format(stats.eacoAvg)} {metric.unit}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">EPSO Avg:</span>
                            <span className="font-mono font-medium text-gray-800">
                              {metric.format(stats.epsoAvg)} {metric.unit}
                            </span>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`absolute h-full ${stats.winner === 'EACO' ? 'bg-blue-500' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min(100, stats.improvement)}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Table View
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                          Iteration
                        </th>
                        {selectedAlgorithm !== 'paired' && (
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Algorithm</th>
                        )}
                        {displayMetrics.map(metric => (
                          <th key={metric.key} className="px-4 py-3 text-right font-semibold text-gray-700">
                            <div className="flex items-center justify-end gap-1">
                              <span>{metric.label}</span>
                              {metric.unit && <span className="font-normal text-gray-500">({metric.unit})</span>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedAlgorithm === 'paired' ? (
                        // Paired Differences View
                        Array.from({ length: Math.min(eacoIterations.length, epsoIterations.length) }).map((_, idx) => {
                          const eacoIter = eacoIterations[idx];
                          const epsoIter = epsoIterations[idx];
                          
                          return (
                            <motion.tr 
                              key={`paired-${idx}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.01 }}
                              className="hover:bg-blue-50/50 transition-colors"
                              onMouseEnter={() => setHoveredRow(idx)}
                              onMouseLeave={() => setHoveredRow(null)}
                            >
                              <td className="px-4 py-3 font-medium sticky left-0 bg-white">
                                {idx + 1}
                              </td>
                              {displayMetrics.map(metric => {
                                const eacoValue = eacoIter.summary[metric.key] || 0;
                                const epsoValue = epsoIter.summary[metric.key] || 0;
                                const { diff, percentDiff, trend } = calculateDifference(eacoValue, epsoValue, metric.key);
                                
                                return (
                                  <td key={metric.key} className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {trend === 'better' && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="p-1 bg-green-100 rounded-full"
                                        >
                                          <TrendingDown className="text-green-600" size={14} />
                                        </motion.div>
                                      )}
                                      {trend === 'worse' && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="p-1 bg-red-100 rounded-full"
                                        >
                                          <TrendingUp className="text-red-600" size={14} />
                                        </motion.div>
                                      )}
                                      {trend === 'neutral' && <Minus className="text-gray-400" size={14} />}
                                      
                                      <div className="text-right">
                                        <span className={`font-mono font-medium ${
                                          trend === 'better' ? 'text-green-700' :
                                          trend === 'worse' ? 'text-red-700' :
                                          'text-gray-600'
                                        }`}>
                                          {diff > 0 ? '+' : ''}{metric.format(diff)}
                                        </span>
                                        <div className="text-xs text-gray-500">
                                          {percentDiff !== 0 && `(${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}%)`}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}
                            </motion.tr>
                          );
                        })
                      ) : (
                        // Individual Algorithm Data
                        <>
                          {(selectedAlgorithm === 'both' || selectedAlgorithm === 'eaco') && 
                            eacoIterations.map((iter, idx) => (
                              <motion.tr 
                                key={`eaco-${idx}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.01 }}
                                className="hover:bg-blue-50/50 transition-colors"
                              >
                                <td className="px-4 py-3 font-medium sticky left-0 bg-white">{idx + 1}</td>
                                {selectedAlgorithm !== 'paired' && (
                                  <td className="px-4 py-3">
                                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">
                                      EACO
                                    </span>
                                  </td>
                                )}
                                {displayMetrics.map(metric => (
                                  <td key={metric.key} className="px-4 py-3 text-right font-mono text-gray-700">
                                    {metric.format(iter.summary[metric.key] || 0)}
                                    <span className="text-xs text-gray-500 ml-1">{metric.unit}</span>
                                  </td>
                                ))}
                              </motion.tr>
                            ))
                          }
                          {(selectedAlgorithm === 'both' || selectedAlgorithm === 'epso') && 
                            epsoIterations.map((iter, idx) => (
                              <motion.tr 
                                key={`epso-${idx}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.01 }}
                                className="hover:bg-orange-50/50 transition-colors"
                              >
                                <td className="px-4 py-3 font-medium sticky left-0 bg-white">{idx + 1}</td>
                                {selectedAlgorithm !== 'paired' && (
                                  <td className="px-4 py-3">
                                    <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-semibold">
                                      EPSO
                                    </span>
                                  </td>
                                )}
                                {displayMetrics.map(metric => (
                                  <td key={metric.key} className="px-4 py-3 text-right font-mono text-gray-700">
                                    {metric.format(iter.summary[metric.key] || 0)}
                                    <span className="text-xs text-gray-500 ml-1">{metric.unit}</span>
                                  </td>
                                ))}
                              </motion.tr>
                            ))
                          }
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer with Statistics */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">{eacoIterations.length}</span> EACO iterations
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">{epsoIterations.length}</span> EPSO iterations
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Info size={16} />
                  <span className="text-xs">
                    This data represents the paired observations used in the t-test statistical analysis
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IterationDetailsDisplay;
