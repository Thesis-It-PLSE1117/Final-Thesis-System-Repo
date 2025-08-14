import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw,
  FiArrowLeft,
  FiSearch,
  FiDownload,
  FiPrinter,
  FiGrid,
  FiBarChart2,
  FiFileText,
  FiActivity,
  FiEye
} from 'react-icons/fi';
import MetricCard from './MetricCard';
import SchedulingLogTable from './SchedulingLogTable';
import IterationBadge from './IterationBadge';
import StatisticsDisplay from './StatisticsDisplay';
import PairedTTestDisplay from './PairedTTestDisplay';
import MetadataDisplay from './MetadataDisplay';
import AnalysisDisplay from './AnalysisDisplay';
import AnalysisComparison from './AnalysisComparison';
import { normalizeData, getSummaryData, keyMetrics } from './utils';
import ImageModal from '../modals/ImageModal';

const ResultsTab = ({ onBackToAnimation, onNewSimulation, eacoResults, epsoResults, plotData, plotsGenerating }) => {
  const [resultsRR, setResultsRR] = useState(null);
  const [resultsEPSO, setResultsEPSO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // New state for main tabs
  const [activeLogTab, setActiveLogTab] = useState('eaco');
  const [isExiting, setIsExiting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalImage, setModalImage] = useState({ isOpen: false, src: '', alt: '' });
  const [plotLoadErrors, setPlotLoadErrors] = useState({
    eaco: {},
    epso: {}
  });
  
  /**
   * I check if MATLAB plots are available or being generated
   * This determines if Visualizations tab should be enabled
   * For simulate/raw and run-compare without MATLAB, plotData will be null/undefined
   */
  const hasMatlabPlots = plotData && Object.keys(plotData).length > 0 && 
    (plotData.eaco?.plotPaths?.length > 0 || plotData.epso?.plotPaths?.length > 0);
  const matlabPlotsExpected = plotsGenerating === true || hasMatlabPlots;
  
  // Debug logging for plot data
  console.log('=== Plot Data Debug ===');
  console.log('plotData:', plotData);
  console.log('plotsGenerating:', plotsGenerating);
  console.log('hasMatlabPlots:', hasMatlabPlots);
  console.log('matlabPlotsExpected:', matlabPlotsExpected);
  
  /**
   * I define tabs following UI/UX best practices for progressive disclosure
   * This reduces cognitive load and improves focus
   */
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FiEye className="w-4 h-4" />,
      description: 'High-level summary and key insights',
      enabled: true
    },
    {
      id: 'metrics',
      label: 'Metrics',
      icon: <FiGrid className="w-4 h-4" />,
      description: 'Detailed performance metrics comparison',
      enabled: true
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <FiBarChart2 className="w-4 h-4" />,
      description: 'Statistical analysis and interpretations',
      enabled: true
    },
    {
      id: 'visualizations',
      label: 'Visualizations',
      icon: <FiActivity className="w-4 h-4" />,
      description: matlabPlotsExpected ? 'MATLAB plots and charts' : 'MATLAB plots not available for this simulation',
      enabled: matlabPlotsExpected
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: <FiFileText className="w-4 h-4" />,
      description: 'Detailed execution logs',
      enabled: true
    }
  ];
  
  /**
   * I add debug logging to see what data we're receiving
   */
  useEffect(() => {
    console.log('=== ResultsTab Debug ===');
    console.log('eacoResults:', eacoResults);
    console.log('eacoResults.analysis:', eacoResults?.analysis);
    console.log('epsoResults:', epsoResults);
    console.log('epsoResults.analysis:', epsoResults?.analysis);
    
    /**
     * I auto-switch to analysis tab when t-test results are available
     */
    if ((eacoResults?.tTestResults || epsoResults?.tTestResults) && activeTab === 'overview') {
      setActiveTab('analysis');
    }
  }, [eacoResults, epsoResults]);

  useEffect(() => {
    try {
      if (!eacoResults || !epsoResults) {
        setError('No simulation results available. Please run a simulation first.');
        setLoading(false);
        return;
      }
      
      const normalizedRR = normalizeData(eacoResults);
      const normalizedEPSO = normalizeData(epsoResults);
      
      if (!normalizedRR || !normalizedEPSO) {
        setError('Failed to normalize simulation results. Data may be incomplete.');
        setLoading(false);
        return;
      }

      setResultsRR(normalizedRR);
      setResultsEPSO(normalizedEPSO);
      setLoading(false);
    } catch (err) {
      console.error('Error processing results:', err);
      setError(`Failed to process simulation results: ${err.message}`);
      setLoading(false);
    }
  }, [eacoResults, epsoResults]);

  const handleBackToAnimation = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBackToAnimation();
    }, 500);
  };

  const filteredLogs = (logs) => {
    if (!logs) return [];
    if (!searchTerm) return logs;
    
    return logs.filter(log => 
      Object.values(log).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getPlotTitle = (filename, index) => {
    if (!filename) return `Plot ${index + 1}`;
    
    const fname = filename.toLowerCase();
    
    if (fname.includes('metrics')) return 'Performance Metrics Overview';
    if (fname.includes('detailed')) return 'Detailed Performance Analysis';
    if (fname.includes('vm_utilization')) return 'VM Resource Utilization';
    if (fname.includes('energy')) return 'Energy Consumption Analysis';
    if (fname.includes('comparison')) return 'Algorithm Comparison';
    if (fname.includes('radar')) return 'Multi-Metric Radar Analysis';
    if (fname.includes('timeline')) return 'Task Scheduling Timeline';
    
    return `Analysis Plot ${index + 1}`;
  };

  const handleDownloadImage = async (imageUrl, filename, algo) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${algo}_${filename}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handlePrintImage = (imageUrl, title) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
              img { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" alt="${title}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const PlotFallback = ({ plotType, algorithm }) => {
    const fallbackMessages = {
      metrics: `No ${algorithm} metrics plot available`,
      detailed: `Detailed analysis plot not generated for ${algorithm}`,
      vm_utilization: `VM utilization data not available for ${algorithm}`,
      energy: `Energy consumption plot missing for ${algorithm}`,
      comparison: `Comparison plot not generated`,
      radar: `Radar chart data not available for ${algorithm}`,
      timeline: `Scheduling timeline not generated for ${algorithm}`
    };

    return (
      <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-500 rounded-lg">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">{fallbackMessages[plotType] || `Plot data not available`}</p>
        <p className="text-xs mt-1 text-gray-400">Try regenerating the simulation results</p>
      </div>
    );
  };

  const handleImageError = (algorithm, plotType) => {
    setPlotLoadErrors(prev => ({
      ...prev,
      [algorithm]: {
        ...prev[algorithm],
        [plotType]: true
      }
    }));
  };

  const rrSummary = getSummaryData(resultsRR);
  const epsoSummary = getSummaryData(resultsEPSO);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#319694] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 rounded-lg max-w-2xl mx-auto mt-8">
      <div className="text-red-600 font-medium mb-2 text-lg">Error loading results</div>
      <p className="text-gray-700 mb-4">{error}</p>
      <button
        className="mt-4 bg-[#319694] text-white px-6 py-2 rounded-lg hover:bg-[#2a827f] transition-colors shadow-md"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
  
  if (!resultsRR && !resultsEPSO) return (
    <div className="p-6 text-center max-w-2xl mx-auto mt-8">
      <p className="text-gray-600 mb-4 text-lg">No results available for comparison</p>
      <button
        className="bg-[#319694] text-white px-6 py-2 rounded-lg hover:bg-[#2a827f] transition-colors shadow-md"
        onClick={onNewSimulation}
      >
        Run New Simulation
      </button>
    </div>
  );

  /**
   * I render tab content based on active tab
   * This follows progressive disclosure principle
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#319694]/10 to-[#4fd1c5]/10 rounded-lg p-4 border border-[#319694]/20">
                <p className="text-sm text-gray-600 mb-1">Best Makespan</p>
                <p className="text-xl font-bold text-[#319694]">
                  {Math.min(rrSummary?.makespan || Infinity, epsoSummary?.makespan || Infinity).toFixed(2)}s
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(rrSummary?.makespan || 0) < (epsoSummary?.makespan || 0) ? 'EACO' : 'EPSO'} wins
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-lg p-4 border border-blue-500/20">
                <p className="text-sm text-gray-600 mb-1">Best Energy</p>
                <p className="text-xl font-bold text-blue-600">
                  {Math.min(rrSummary?.energyConsumption || Infinity, epsoSummary?.energyConsumption || Infinity).toFixed(2)} Wh
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(rrSummary?.energyConsumption || 0) < (epsoSummary?.energyConsumption || 0) ? 'EACO' : 'EPSO'} wins
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-400/10 rounded-lg p-4 border border-purple-500/20">
                <p className="text-sm text-gray-600 mb-1">Best Utilization</p>
                <p className="text-xl font-bold text-purple-600">
                  {Math.max(rrSummary?.resourceUtilization || 0, epsoSummary?.resourceUtilization || 0).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(rrSummary?.resourceUtilization || 0) > (epsoSummary?.resourceUtilization || 0) ? 'EACO' : 'EPSO'} wins
                </p>
              </div>
            </div>

            {/* Metadata Display */}
            {console.log('=== Metadata Debug ===')}
            {console.log('resultsRR metadata:', {
              runId: resultsRR?.runId,
              seed: resultsRR?.seed,
              configSnapshot: resultsRR?.configSnapshot,
              datasetId: resultsRR?.datasetId
            })}
            {console.log('resultsEPSO metadata:', {
              runId: resultsEPSO?.runId,
              seed: resultsEPSO?.seed,
              configSnapshot: resultsEPSO?.configSnapshot,
              datasetId: resultsEPSO?.datasetId
            })}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {resultsRR && (
                <MetadataDisplay 
                  metadata={{
                    runId: resultsRR.runId,
                    seed: resultsRR.seed,
                    configSnapshot: resultsRR.configSnapshot,
                    datasetId: resultsRR.datasetId
                  }}
                  algorithm="EACO"
                />
              )}
              {resultsEPSO && (
                <MetadataDisplay 
                  metadata={{
                    runId: resultsEPSO.runId,
                    seed: resultsEPSO.seed,
                    configSnapshot: resultsEPSO.configSnapshot,
                    datasetId: resultsEPSO.datasetId
                  }}
                  algorithm="EPSO"
                />
              )}
            </div>

            {/* Iteration info if applicable */}
            {(eacoResults?.iterationsAdjusted || epsoResults?.iterationsAdjusted) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg"
              >
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium">Iterations Automatically Adjusted</p>
                    <p className="text-blue-700 text-sm mt-1">
                      {eacoResults?.adjustmentMessage || epsoResults?.adjustmentMessage || 
                       `Iterations were adjusted from ${eacoResults?.originalIterations || epsoResults?.originalIterations} to ${eacoResults?.iterations || epsoResults?.iterations} to ensure statistical validity.`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {eacoResults?.rawResults?.totalIterations > 1 && (
              <IterationBadge iterationData={eacoResults.rawResults} />
            )}
          </motion.div>
        );

      case 'metrics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {keyMetrics.map((metric) => (
              <MetricCard 
                key={`metric-${metric.valueKey}`}
                title={metric.title}
                description={metric.description}
                eacoValue={rrSummary ? rrSummary[metric.valueKey] || 0 : 0}
                epsoValue={epsoSummary ? epsoSummary[metric.valueKey] || 0 : 0}
                unit={metric.unit}
                betterWhen={metric.betterWhen}
                icon={metric.icon}
                backendInterpretation={{
                  eaco: eacoResults?.analysis?.metricInterpretations?.[metric.valueKey],
                  epso: epsoResults?.analysis?.metricInterpretations?.[metric.valueKey]
                }}
              />
            ))}
          </motion.div>
        );

      case 'analysis':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Highlight T-Test Results if Available */}
            {(eacoResults?.tTestResults || epsoResults?.tTestResults) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-800">Paired T-Test Analysis</h3>
                    <p className="text-sm text-purple-600">Statistical comparison between EACO and EPSO algorithms</p>
                  </div>
                </div>
                <PairedTTestDisplay 
                  tTestResults={eacoResults?.tTestResults || epsoResults?.tTestResults}
                  isLoading={false}
                />
              </motion.div>
            )}
            
            {/* Statistics Display */}
            {eacoResults?.rawResults?.averageMetrics && (
              <StatisticsDisplay
                average={eacoResults.rawResults.averageMetrics}
                min={eacoResults.rawResults.minMetrics}
                max={eacoResults.rawResults.maxMetrics}
                stdDev={eacoResults.rawResults.stdDevMetrics}
              />
            )}
            
            {/* Analysis Comparison Display */}
            {(eacoResults?.analysis || epsoResults?.analysis) && (
              <AnalysisComparison 
                eacoAnalysis={eacoResults?.analysis} 
                epsoAnalysis={epsoResults?.analysis}
              />
            )}
          </motion.div>
        );

      case 'visualizations':
        // This case should not be reachable when tab is disabled, but adding safeguard
        if (!matlabPlotsExpected) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center h-64"
            >
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 font-medium">Visualizations Not Available</p>
                <p className="text-gray-500 text-sm mt-2">MATLAB plots were not generated for this simulation type.</p>
              </div>
            </motion.div>
          );
        }
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {plotsGenerating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  <div>
                    <p className="text-blue-800 font-medium">MATLAB plots are being generated...</p>
                    <p className="text-blue-600 text-sm mt-1">This may take a few moments.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* MATLAB Plots Section */}
            {renderPlots()}
          </motion.div>
        );

      case 'logs':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-700 text-lg">Scheduling Logs</h4>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#319694] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveLogTab('eaco')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeLogTab === 'eaco'
                      ? 'border-[#319694] text-[#319694]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  EACO Logs
                </button>
                <button
                  onClick={() => setActiveLogTab('epso')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeLogTab === 'epso'
                      ? 'border-[#319694] text-[#319694]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  EPSO Logs
                </button>
              </nav>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLogTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeLogTab === 'eaco' ? (
                    <SchedulingLogTable 
                      logs={filteredLogs(resultsRR?.schedulingLog)} 
                      algorithm="eaco" 
                    />
                  ) : (
                    <SchedulingLogTable 
                      logs={filteredLogs(resultsEPSO?.schedulingLog)} 
                      algorithm="epso" 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  /**
   * I extract plots rendering to a separate function for cleaner code
   */
  const renderPlots = () => {
    if (!plotData || Object.keys(plotData).length === 0) {
      if (!plotsGenerating) {
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-yellow-800 font-medium">No Visualization Data Available</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Enable MATLAB plots in the simulation configuration to generate visualizations.
                </p>
              </div>
            </div>
          </div>
        );
      }
      return null;
    }

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    const eacoData = plotData.eaco;
    const epsoData = plotData.epso;
    const plotTypes = ['metrics', 'detailed', 'vm_utilization', 'energy', 'timeline', 'radar'];
    
    return (
      <div className="space-y-8">
        {plotTypes.map((type) => {
          const eacoPlot = eacoData?.plotPaths?.find(path => path.toLowerCase().includes(type));
          const epsoPlot = epsoData?.plotPaths?.find(path => path.toLowerCase().includes(type));
          
          if (!eacoPlot && !epsoPlot) return null;
          
          const plotTitle = getPlotTitle(type, 0);
          
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plotTypes.indexOf(type) * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <h5 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                {plotTitle}
              </h5>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* EACO Plot */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">
                  <div className="bg-white text-gray-700 px-3 py-2 text-sm font-medium text-center border-b border-gray-200">
                    EACO Algorithm
                  </div>
                  {eacoPlot && !plotLoadErrors.eaco[type] ? (
                    <div className="relative" onClick={() => setModalImage({ isOpen: true, src: `${API_BASE}/api/plots/${eacoPlot.replace(/\\/g, '/').replace('plots/', '')}`, alt: `EACO ${plotTitle}` })}>
                      <img 
                        src={`${API_BASE}/api/plots/${eacoPlot.replace(/\\/g, '/').replace('plots/', '')}`} 
                        alt={`EACO ${plotTitle}`}
                        className="w-full h-auto object-contain max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
                        onError={() => handleImageError('eaco', type)}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadImage(`${API_BASE}/api/plots/${eacoPlot.replace(/\\/g, '/').replace('plots/', '')}`, `eaco_${type}.png`, 'eaco');
                            }}
                            className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                            title="Download image"
                          >
                            <FiDownload className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintImage(`${API_BASE}/api/plots/${eacoPlot.replace(/\\/g, '/').replace('plots/', '')}`, `EACO - ${plotTitle}`);
                            }}
                            className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                            title="Print image"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <PlotFallback plotType={type} algorithm="EACO" />
                  )}
                </div>
                
                {/* EPSO Plot */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">
                  <div className="bg-white text-gray-700 px-3 py-2 text-sm font-medium text-center border-b border-gray-200">
                    EPSO Algorithm
                  </div>
                  {epsoPlot && !plotLoadErrors.epso[type] ? (
                    <div className="relative" onClick={() => setModalImage({ isOpen: true, src: `${API_BASE}/api/plots/${epsoPlot.replace(/\\/g, '/').replace('plots/', '')}`, alt: `EPSO ${plotTitle}` })}>
                      <img 
                        src={`${API_BASE}/api/plots/${epsoPlot.replace(/\\/g, '/').replace('plots/', '')}`} 
                        alt={`EPSO ${plotTitle}`}
                        className="w-full h-auto object-contain max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
                        onError={() => handleImageError('epso', type)}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadImage(`${API_BASE}/api/plots/${epsoPlot.replace(/\\/g, '/').replace('plots/', '')}`, `epso_${type}.png`, 'epso');
                            }}
                            className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                            title="Download image"
                          >
                            <FiDownload className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintImage(`${API_BASE}/api/plots/${epsoPlot.replace(/\\/g, '/').replace('plots/', '')}`, `EPSO - ${plotTitle}`);
                            }}
                            className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                            title="Print image"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <PlotFallback plotType={type} algorithm="EPSO" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-grow flex flex-col bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#319694]">
            Simulation Results
          </h2>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              onClick={handleBackToAnimation}
            >
              <FiArrowLeft className="mr-2" />
              Animation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center bg-[#319694] text-white px-4 py-2 rounded-lg hover:bg-[#2a827f] transition-colors text-sm shadow-sm"
              onClick={onNewSimulation}
            >
              <FiRefreshCw className="mr-2" />
              New Run
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.enabled && setActiveTab(tab.id)}
              disabled={!tab.enabled}
              className={`
                group relative py-4 px-1 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors
                ${!tab.enabled 
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : activeTab === tab.id
                    ? 'border-[#319694] text-[#319694]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              aria-disabled={!tab.enabled}
            >
              <div className={!tab.enabled ? 'opacity-50' : ''}>
                {tab.icon}
              </div>
              <span className={!tab.enabled ? 'opacity-50' : ''}>{tab.label}</span>
              
              {/* Disabled badge for Visualizations tab */}
              {tab.id === 'visualizations' && !tab.enabled && (
                <span className="ml-1 text-xs text-gray-400">(N/A)</span>
              )}
              
              {/* Badge for T-Test Results on Analysis Tab */}
              {tab.id === 'analysis' && (eacoResults?.tTestResults || epsoResults?.tTestResults) && (
                <span className="absolute -top-1 -right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              )}
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {tab.description}
                {tab.id === 'analysis' && (eacoResults?.tTestResults || epsoResults?.tTestResults) && (
                  <span className="block text-purple-300 mt-1">T-Test results available!</span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ImageModal
        isOpen={modalImage.isOpen}
        onClose={() => setModalImage({ isOpen: false, src: '', alt: '' })}
        imageSrc={modalImage.src}
        imageAlt={modalImage.alt}
      />
    </motion.div>
  );
};

export default ResultsTab;