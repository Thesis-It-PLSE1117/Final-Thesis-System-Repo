import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw,
  FiArrowLeft,
  FiSearch,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';
import MetricCard from './MetricCard';
import SchedulingLogTable from './SchedulingLogTable';
import PerformanceCharts from './Charts';
import { normalizeData, getSummaryData, keyMetrics } from './utils';

const ResultsTab = ({ onBackToAnimation, onNewSimulation, eacoResults, epsoResults, plotData }) => {
  const [resultsRR, setResultsRR] = useState(null);
  const [resultsEPSO, setResultsEPSO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLogTab, setActiveLogTab] = useState('eaco');
  const [activeChart, setActiveChart] = useState('bar');
  const [isExiting, setIsExiting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      console.group('📊 Results Tab Data Processing');
      console.log('📥 Raw EACO results from props:', eacoResults);
      console.log('📥 Raw EPSO results from props:', epsoResults);
      
      if (!eacoResults || !epsoResults) {
        console.warn('⚠️ Missing results data from props');
        setError('No simulation results available. Please run a simulation first.');
        setLoading(false);
        console.groupEnd();
        return;
      }
      
      // Normalize the data
      const normalizedRR = normalizeData(eacoResults);
      const normalizedEPSO = normalizeData(epsoResults);
      
      console.log('🔄 Normalized EACO data:', normalizedRR);
      console.log('🔄 Normalized EPSO data:', normalizedEPSO);

      setResultsRR(normalizedRR);
      setResultsEPSO(normalizedEPSO);
      setLoading(false);
      
      console.groupEnd();
    } catch (err) {
      console.error('❌ Error processing results:', err);
      setError('Failed to process simulation results. Please try again.');
      setLoading(false);
      console.groupEnd();
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
      console.error('Failed to download image:', error);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-grow p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
    >
      <motion.div 
        className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-[#319694]">
            Simulation Results Comparison
          </h3>
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
        
        {/* Key Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MetricCard 
                title={metric.title}
                description={metric.description}
                eacoValue={rrSummary ? rrSummary[metric.valueKey] || 0 : 0}
                epsoValue={epsoSummary ? epsoSummary[metric.valueKey] || 0 : 0}
                unit={metric.unit}
                betterWhen={metric.betterWhen}
                icon={metric.icon}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Visualization Section */}
        <div className="mb-10">
          <PerformanceCharts 
            rrSummary={rrSummary} 
            epsoSummary={epsoSummary}
            activeChart={activeChart}
            setActiveChart={setActiveChart}
          />
        </div>

        {/* MATLAB Plots Section */}
        {plotData && Object.keys(plotData).length > 0 && (
          <div className="mb-10">
            <h4 className="font-semibold text-gray-700 text-lg mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#319694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              MATLAB Analysis Plots Comparison
            </h4>
            
            {/* Group plots by type for side-by-side comparison */}
            {(() => {
              const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
              const eacoData = plotData.eaco;
              const epsoData = plotData.epso;
              
              if (!eacoData?.plotPaths || !epsoData?.plotPaths) return null;
              
              // Create pairs of plots for comparison
              const plotTypes = ['metrics', 'detailed', 'vm_utilization', 'energy', 'timeline', 'radar'];
              
              return (
                <div className="space-y-8">
                  {plotTypes.map((type) => {
                    // Find matching plots for each type
                    const eacoPlot = eacoData.plotPaths.find(path => path.toLowerCase().includes(type));
                    const epsoPlot = epsoData.plotPaths.find(path => path.toLowerCase().includes(type));
                    
                    if (!eacoPlot || !epsoPlot) return null;
                    
                    // Process EACO plot path
                    let eacoNormalizedPath = eacoPlot.replace(/\\/g, '/');
                    if (eacoNormalizedPath.startsWith('plots/')) {
                      eacoNormalizedPath = eacoNormalizedPath.substring(6);
                    }
                    const eacoUrl = `${API_BASE}/api/plots/${eacoNormalizedPath}`;
                    
                    // Process EPSO plot path
                    let epsoNormalizedPath = epsoPlot.replace(/\\/g, '/');
                    if (epsoNormalizedPath.startsWith('plots/')) {
                      epsoNormalizedPath = epsoNormalizedPath.substring(6);
                    }
                    const epsoUrl = `${API_BASE}/api/plots/${epsoNormalizedPath}`;
                    
                    const plotTitle = getPlotTitle(type, 0);
                    
                    return (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: plotTypes.indexOf(type) * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200"
                      >
                        {/* Plot type header */}
                        <h5 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                          {plotTitle}
                        </h5>
                        
                        {/* Side-by-side comparison grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* EACO Plot */}
                          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">
                            <div className="bg-white text-gray-700 px-3 py-2 text-sm font-medium text-center border-b border-gray-200 shadow-sm">
                              EACO Algorithm
                            </div>
                            <div className="relative">
                              <img 
                                src={eacoUrl} 
                                alt={`EACO ${plotTitle}`}
                                className="w-full h-auto object-contain max-h-96"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div 
                                style={{ display: 'none' }}
                                className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500"
                              >
                                <div className="text-center">
                                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-sm">Plot loading...</p>
                                </div>
                              </div>
                              {/* Action buttons overlay */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDownloadImage(eacoUrl, `eaco_${type}.png`, 'eaco')}
                                    className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                                    title="Download image"
                                  >
                                    <FiDownload className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePrintImage(eacoUrl, `EACO - ${plotTitle}`)}
                                    className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                                    title="Print image"
                                  >
                                    <FiPrinter className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* EPSO Plot */}
                          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">
                            <div className="bg-white text-gray-700 px-3 py-2 text-sm font-medium text-center border-b border-gray-200 shadow-sm">
                              EPSO Algorithm
                            </div>
                            <div className="relative">
                              <img 
                                src={epsoUrl} 
                                alt={`EPSO ${plotTitle}`}
                                className="w-full h-auto object-contain max-h-96"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div 
                                style={{ display: 'none' }}
                                className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500"
                              >
                                <div className="text-center">
                                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-sm">Plot loading...</p>
                                </div>
                              </div>
                              {/* Action buttons overlay */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDownloadImage(epsoUrl, `epso_${type}.png`, 'epso')}
                                    className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                                    title="Download image"
                                  >
                                    <FiDownload className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePrintImage(epsoUrl, `EPSO - ${plotTitle}`)}
                                    className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                                    title="Print image"
                                  >
                                    <FiPrinter className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Scheduling Logs Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Scheduling Logs</h4>
            
            {/* Search Bar */}
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
          
          {/* Log Tabs */}
          <div className="border-b border-gray-200 mb-4">
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
          
          {/* Log Content */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto shadow-inner">
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsTab;