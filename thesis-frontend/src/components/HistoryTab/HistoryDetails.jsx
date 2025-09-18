import { useState } from 'react';
import { BarChart2, Clock, Cpu, Zap, Activity, TrendingUp, Award, Eye, FileText, Calendar, Settings, Database, CheckCircle, AlertCircle, Info, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryDetails = ({ result, onViewResults }) => {
  const [openSections, setOpenSections] = useState({
    performance: true,
    configuration: true,
    visualization: true,
    statistical: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center text-gray-500">
          <Database size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Simulation Selected</p>
          <p className="text-sm">Select a simulation from the history list to view its details</p>
        </div>
      </div>
    );
  }

  // Safely access properties with defaults
  let summary = result.summary || {};
  if (typeof summary === 'string') {
    try {
      summary = JSON.parse(summary);
    } catch (e) {
      console.warn('Failed to parse summary:', e);
      summary = {};
    }
  }
  const config = result.config || {};
  
  // Calculate metrics from individualResults since averageMetrics is null
  const calculateMetricFromIndividual = (metricName) => {
    const individualResults = result.rawResults?.individualResults;
    if (!individualResults || !Array.isArray(individualResults) || individualResults.length === 0) {
      return 0;
    }
    
    // Get all values for this metric from individual results
    const values = individualResults
      .map(item => item.summary?.[metricName] || 0)
      .filter(val => typeof val === 'number' && !isNaN(val));
    
    if (values.length === 0) return 0;
    
    // Return the average
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };
  
  const getMetric = (metricName) => {
    return summary[metricName] || 
           summary.averageMetrics?.[metricName] || 
           result.rawResults?.summary?.[metricName] || 
           result.rawResults?.averageMetrics?.[metricName] || 
           result[metricName] || 
           calculateMetricFromIndividual(metricName) ||
           0;
  };
  
  const metrics = [
    {
      icon: <Clock size={20} className="text-[#319694]" />,
      title: "Makespan",
      value: getMetric('makespan').toFixed(2),
      unit: "s"
    },
    {
      icon: <Timer size={20} className="text-[#319694]" />,
      title: "Response Time",
      value: (getMetric('responseTime') || getMetric('avgResponseTime')).toFixed(2),
      unit: "ms"
    },
    {
      icon: <Cpu size={20} className="text-[#319694]" />,
      title: "Resource Utilization",
      value: getMetric('resourceUtilization').toFixed(2),
      unit: "%"
    },
    {
      icon: <Zap size={20} className="text-[#319694]" />,
      title: "Energy Consumption",
      value: getMetric('energyConsumption').toFixed(3),
      unit: "Wh"
    },
    {
      icon: <Activity size={20} className="text-[#319694]" />,
      title: "Load Imbalance",
      value: getMetric('loadImbalance').toFixed(4),
      unit: ""
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Extract key statistical insights in readable format
  const getStatisticalSummary = (tTestResults) => {
    if (!tTestResults) return null;

    const summary = [];
    
    if (tTestResults.overallWinner && tTestResults.overallWinner !== 'No clear winner') {
      summary.push(`${tTestResults.overallWinner} shows superior performance overall`);
    }
    
    if (tTestResults.significantDifferences && tTestResults.metricTests) {
      const totalMetrics = Object.keys(tTestResults.metricTests).length;
      summary.push(`Significant differences found in ${tTestResults.significantDifferences} out of ${totalMetrics} metrics`);
    }
    
    if (tTestResults.sampleSize) {
      summary.push(`Analysis based on ${tTestResults.sampleSize} iterations`);
    }

    // Extract specific metric winners if available
    if (tTestResults.metricTests) {
      Object.entries(tTestResults.metricTests).forEach(([metric, test]) => {
        if (test.significant && test.winner) {
          const metricName = metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          summary.push(`${test.winner} performs better in ${metricName.toLowerCase()}`);
        }
      });
    }

    return summary;
  };

  const statisticalSummary = getStatisticalSummary(result.tTestResults);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BarChart2 size={24} className="text-[#319694]" />
              Simulation Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">{result.algorithm} Algorithm Results</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {formatDate(result.timestamp)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Performance Metrics - Collapsible Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('performance')}
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#319694]" />
              Performance Metrics
            </h4>
            {openSections.performance ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {openSections.performance && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center">
                    <div className="bg-[#e0f7f6] p-2 rounded-full mr-4">
                      {metric.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate">{metric.title}</p>
                      <p className="text-xl font-semibold">
                        {metric.value} 
                        {metric.unit && <span className="text-sm font-normal ml-1">{metric.unit}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuration - Collapsible Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('configuration')}
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Settings size={16} className="text-[#319694]" />
              Configuration
            </h4>
            {openSections.configuration ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {openSections.configuration && (
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Hosts</p>
                    <p className="font-semibold text-gray-800">{config.numHosts || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">VMs</p>
                    <p className="font-semibold text-gray-800">{config.numVMs || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Cloudlets</p>
                    <p className="font-semibold text-gray-800">{config.numCloudlets || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Algorithm</p>
                    <p className="font-semibold text-gray-800">{result.algorithm || config.optimizationAlgorithm || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">VM Scheduler</p>
                    <p className="font-semibold text-gray-800">{config.vmScheduler || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Workload</p>
                    <p className="font-semibold text-gray-800">{config.workloadType || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plot Analysis - Collapsible Section */}
        {result.plotAnalysis && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection('visualization')}
            >
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Eye size={16} className="text-[#319694]" />
                Visualization Summary
              </h4>
              {openSections.visualization ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openSections.visualization && (
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-[#319694]">
                        {result.plotAnalysis.plotCount || 0}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Plots Generated</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-[#319694]">
                        {result.plotAnalysis.plotTypes ? result.plotAnalysis.plotTypes.length : 0}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Chart Types</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-[#319694]">
                        {result.plotAnalysis.plotMetadata && 
                         result.plotAnalysis.plotMetadata.some(p => p.interpretation) ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Interpretations</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-3">
                      <div className="text-2xl font-bold text-[#319694]">
                        {result.plotAnalysis.analysis ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Analysis</div>
                    </div>
                  </div>
                  
                  {/* Available Visualizations */}
                  {result.plotAnalysis.plotTypes && result.plotAnalysis.plotTypes.length > 0 && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Available Charts:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.plotAnalysis.plotTypes.map((type, index) => (
                          <span key={index} className="bg-white px-3 py-1 rounded-full text-xs text-gray-700 border shadow-sm">
                            {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Statistical Analysis - Collapsible Section */}
        {statisticalSummary && statisticalSummary.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection('statistical')}
            >
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Award size={16} className="text-[#319694]" />
                Statistical Insights
              </h4>
              {openSections.statistical ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openSections.statistical && (
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {statisticalSummary.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3">
                        <CheckCircle size={16} className="text-[#319694] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={() => onViewResults(result)}
            className="w-full bg-[#319694] text-white px-6 py-4 rounded-lg hover:bg-[#267b79] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <BarChart2 size={18} />
            <span className="font-medium">View Detailed Results</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryDetails;