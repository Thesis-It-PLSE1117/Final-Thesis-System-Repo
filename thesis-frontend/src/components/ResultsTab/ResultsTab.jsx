import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw,
  FiArrowLeft,
  FiSearch
} from 'react-icons/fi';
import MetricCard from './MetricCard';
import SchedulingLogTable from './SchedulingLogTable';
import PerformanceCharts from './Charts';
import { normalizeData, getSummaryData, keyMetrics } from './utils';

const ResultsTab = ({ onBackToAnimation, onNewSimulation, rrResults, epsoResults }) => {
  const [resultsRR, setResultsRR] = useState(null);
  const [resultsEPSO, setResultsEPSO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLogTab, setActiveLogTab] = useState('rr');
  const [activeChart, setActiveChart] = useState('bar');
  const [isExiting, setIsExiting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      console.group('📊 Results Tab Data Processing');
      console.log('📥 Raw EACO results from props:', rrResults);
      console.log('📥 Raw EPSO results from props:', epsoResults);
      
      if (!rrResults || !epsoResults) {
        console.warn('⚠️ Missing results data from props');
        setError('No simulation results available. Please run a simulation first.');
        setLoading(false);
        console.groupEnd();
        return;
      }
      
      // Normalize the data
      const normalizedRR = normalizeData(rrResults);
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
  }, [rrResults, epsoResults]);

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
                rrValue={rrSummary[metric.title.toLowerCase().includes('utilization') ? 'cpuUtilization' : 
                                metric.title.toLowerCase().includes('response') ? 'avgResponseTime' : 'energyConsumption']}
                epsoValue={epsoSummary[metric.title.toLowerCase().includes('utilization') ? 'cpuUtilization' : 
                                metric.title.toLowerCase().includes('response') ? 'avgResponseTime' : 'energyConsumption']}
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
                onClick={() => setActiveLogTab('rr')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeLogTab === 'rr'
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
                {activeLogTab === 'rr' ? (
                  <SchedulingLogTable 
                    logs={filteredLogs(resultsRR?.schedulingLog)} 
                    algorithm="rr" 
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