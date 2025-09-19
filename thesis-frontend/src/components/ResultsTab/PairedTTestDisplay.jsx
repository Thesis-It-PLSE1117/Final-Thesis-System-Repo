import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Info, 
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Gauge,
  Timer,
  Scale,
  Activity
} from 'lucide-react';

const PairedTTestDisplay = ({ tTestResults, comparisonResults, isLoading = false }) => {

  const [expandedMetric, setExpandedMetric] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(true);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#319694]"></div>
          <span className="ml-4 text-gray-600">Performing statistical analysis...</span>
        </div>
      </div>
    );
  }

  if (!tTestResults) {
    return null;
  }

  const { metricTests, overallWinner, significantDifferences, sampleSize, alpha } = tTestResults;
  
  const eacoWins = Object.values(metricTests || {}).filter(
    (t) => t && t.significant && t.betterAlgorithm === 'EACO'
  ).length;
  const epsoWins = Object.values(metricTests || {}).filter(
    (t) => t && t.significant && t.betterAlgorithm === 'EPSO'
  ).length;
  const winnerCount = overallWinner === 'EACO' ? eacoWins : 
                     overallWinner === 'EPSO' ? epsoWins : 0;
  
  const derivedSignificant = Object.values(metricTests || {}).filter((t) => t && t.significant).length;
  const significantCount = typeof significantDifferences === 'number' ? significantDifferences : derivedSignificant;
  
  // Format timing information from comparison results
  const formatDuration = (milliseconds) => {
    if (!milliseconds || milliseconds < 0) return 'N/A';
    const seconds = milliseconds / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
  };

  const detectAlgorithmFromText = (text) => {
    if (!text || typeof text !== 'string') return null;
    const patterns = [
      { alg: 'EPSO', regex: /EPSO[^.]{0,60}(advantage|better|improvement|performs|superior)/i },
      { alg: 'EACO', regex: /EACO[^.]{0,60}(advantage|better|improvement|performs|superior)/i },
    ];
    for (const p of patterns) {
      if (p.regex.test(text)) return p.alg;
    }
    return null;
  };

  // metadata: consistent icons and descriptive labels
  const getMetricMeta = (metricName) => {
    switch (metricName) {
      case 'makespan':
        return { Icon: Clock, label: 'Total Completion Time (Makespan)', unit: 'secs', betterWhen: 'lower' };
      case 'energyConsumption':
        return { Icon: Zap, label: 'Energy Consumption', unit: 'Wh', betterWhen: 'lower' };
      case 'resourceUtilization':
        return { Icon: Gauge, label: 'Resource Utilization', unit: '%', betterWhen: 'higher' };
      case 'responseTime':
        return { Icon: Timer, label: 'Average Response Time', unit: 'secs', betterWhen: 'lower' };
      case 'loadBalance':
      case 'loadImbalance':
      case 'degreeOfImbalance':
        return { Icon: Scale, label: 'Degree of Imbalance (DI)', unit: '', betterWhen: 'lower' };
      default:
        return { Icon: BarChart3, label: metricName, unit: '', betterWhen: 'lower' };
    }
  };

  const getAlgorithmColor = (algorithm) => {
    return algorithm === 'EACO' ? 'text-blue-600' : 'text-orange-600';
  };

  const getSignificanceColor = (pValue) => {
    if (pValue < 0.001) return 'text-red-600 font-bold';
    if (pValue < 0.01) return 'text-orange-600 font-semibold';
    if (pValue < 0.05) return 'text-yellow-600 font-medium';
    return 'text-gray-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 mb-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 border-l-4 border-[#319694] rounded-lg p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-[#319694] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-[#319694] mb-1">
              Individual Iteration Results Available Below
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Detailed per-iteration data for both algorithms is displayed in the <span className="font-medium text-[#319694]">"Individual Iteration Results"</span> section 
              at the bottom of this analysis. Click to expand and explore the raw paired data used in these statistical calculations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-[#319694]/10 rounded-lg">
            <BarChart3 className="text-[#319694]" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Paired T-Test Statistical Analysis
              </h3>
              <button
                onClick={() => setShowMethodology(!showMethodology)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border-2 transition-all duration-200 whitespace-nowrap self-start
                  ${showMethodology 
                    ? 'bg-[#319694] text-white border-[#319694] shadow-md' 
                    : 'bg-white text-[#319694] border-[#319694]/40 hover:border-[#319694] hover:bg-[#319694]/5 shadow-sm hover:shadow-md'
                  }`}
                title={showMethodology ? 'Hide statistical methodology details' : 'Click to view detailed statistical methodology'}
              >
                <Info size={14} className={showMethodology ? 'text-white' : 'text-[#319694]'} />
                <span>{showMethodology ? 'Hide Methodology' : 'View Methodology'}</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2 hidden sm:block">
              Statistical validation of algorithm performance differences
            </p>
          </div>
        </div>
        {comparisonResults?.totalExecutionTime && (
          <div className="text-left sm:text-right">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="text-[#319694]" size={16} />
              <span className="text-sm font-medium text-gray-700">Analysis Time</span>
            </div>
            <span className="text-lg font-bold text-[#319694]">
              {formatDuration(comparisonResults.totalExecutionTime)}
            </span>
          </div>
        )}
      </div>

      {/* Methodology Explanation */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#319694]/5 border border-[#319694]/20 rounded-lg p-3 sm:p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="text-[#319694]" size={18} />
              <h4 className="font-semibold text-[#319694] text-base">Statistical Methodology</h4>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We use <span className="font-semibold text-[#319694]">two-tailed paired t-tests</span> on per-iteration paired differences under 
                identical workload conditions to compare EPSO and EACO algorithms.
              </p>
              
              <div className="bg-white border border-[#319694]/20 rounded-lg p-3 sm:p-4">
                <div className="font-mono text-sm sm:text-base mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#319694] font-semibold">Formula:</span>
                    <span className="font-bold">t = d̄ / (Sd/√n)</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 ml-4 space-y-1">
                    <p>where d̄ = mean difference (EACO - EPSO)</p>
                    <p>Sd = standard deviation of differences</p>
                    <p>n = sample size ({sampleSize} paired observations)</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 text-xs sm:text-sm text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-semibold text-[#319694]">Significance level (α):</span> {alpha}
                    </div>
                    <div>
                      <span className="font-semibold text-[#319694]">Test type:</span> Two-tailed
                    </div>
                    <div>
                      <span className="font-semibold text-[#319694]">Degrees of freedom:</span> {sampleSize - 1}
                    </div>
                    <div>
                      <span className="font-semibold text-[#319694]">Library:</span> Apache Commons Math3
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                <p className="mb-2">
                  <span className="font-semibold">Implementation:</span> Each algorithm runs on identical workload conditions for {sampleSize} iterations.
                  Paired differences (EACO - EPSO) are calculated for each metric, then analyzed using t-distribution statistics.
                </p>
                <p>
                  <span className="font-semibold">Interpretation:</span> Significant results (p &lt; 0.05) indicate statistically meaningful performance differences. 
                  Effect sizes are calculated using Cohen's d with cloud computing-adjusted thresholds.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Winner Card */}
      <div className="bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 rounded-lg p-4 sm:p-6 mb-6 border border-[#319694]/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Award className="text-[#319694]" size={28} />
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Statistical Winner</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {overallWinner === 'No clear winner' ? (
                  'No Significant Difference'
                ) : (
                  <span className={getAlgorithmColor(overallWinner)}>
                    {overallWinner} Algorithm
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl sm:text-3xl font-bold text-[#319694]">
              {overallWinner === 'No clear winner' ? (
                `${significantCount}/${Object.keys(metricTests || {}).length}`
              ) : (
                `${winnerCount}/${Object.keys(metricTests || {}).length}`
              )}
            </p>
            <p className="text-sm text-gray-600">
              {overallWinner === 'No clear winner' ? 'Significant Metrics' : 'Metrics Won'}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Tests Results */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700 text-base sm:text-lg flex items-center gap-2">
          <BarChart3 size={18} className="text-gray-500" />
          Individual Metric Analysis
        </h4>
        
        {Object.entries(metricTests || {}).map(([metricName, test]) => (
          <motion.div
            key={metricName}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-3 sm:p-4 bg-white cursor-pointer"
              onClick={() => setExpandedMetric(expandedMetric === metricName ? null : metricName)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => { const { Icon } = getMetricMeta(metricName); return (
                    <span className="p-2 rounded-md bg-gray-100 flex-shrink-0" aria-hidden="true">
                      <Icon className="text-gray-700" size={16} />
                    </span>
                  ); })()}
                  <div className="min-w-0">
                    <h5 className="font-semibold text-gray-800 text-sm sm:text-base" title={getMetricMeta(metricName).label} aria-label={getMetricMeta(metricName).label}>
                      {getMetricMeta(metricName).label}
                      {getMetricMeta(metricName).betterWhen && (
                        <span className="text-xs sm:text-sm text-gray-500 ml-2 block sm:inline">
                          ({getMetricMeta(metricName).betterWhen} is better)
                        </span>
                      )}
                    </h5>
                    <div className="flex items-start gap-2 mt-1">
                      {test.significant ? (
                        <>
                          <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                          <span className="text-sm sm:text-base text-green-600 font-medium">
                            Significant: {test.betterAlgorithm} performs {Number(test.improvementPercentage).toFixed(2)}% better
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
                          <span className="text-sm sm:text-base text-gray-500">
                            No significant difference
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p className={`text-sm sm:text-base font-mono ${getSignificanceColor(test?.pValue)}`}>
                      p = {typeof test?.pValue === 'number' ? test.pValue.toFixed(4) : '—'}
                      {typeof test?.pValue === 'number' && test.pValue < 0.001 && ' ***'}
                      {typeof test?.pValue === 'number' && test.pValue >= 0.001 && test.pValue < 0.01 && ' **'}
                      {typeof test?.pValue === 'number' && test.pValue >= 0.01 && test.pValue < 0.05 && ' *'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      t({typeof test?.degreesOfFreedom === 'number' ? test.degreesOfFreedom : '—'}) = {typeof test?.tStatistic === 'number' ? test.tStatistic.toFixed(3) : '—'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedMetric === metricName ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedMetric === metricName && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mean Difference</p>
                      <p className="font-semibold text-gray-800" title="EACO - EPSO">
                        {typeof test?.meanDifference === 'number' ? test.meanDifference.toFixed(4) : '—'}
                        <span className="text-sm text-gray-500 ml-1">{getMetricMeta(metricName).unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Std Error</p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.standardError === 'number' ? test.standardError.toFixed(4) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">95% CI</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        [{typeof test?.ciLower === 'number' ? test.ciLower.toFixed(3) : '—'}, {typeof test?.ciUpper === 'number' ? test.ciUpper.toFixed(3) : '—'}]
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cohen's d</p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.cohensD === 'number' ? test.cohensD.toFixed(3) : '—'} ({test?.effectSize || '—'})
                      </p>
                    </div>
                  </div>
                  
                  {/* Visual representation */}
                  <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Effect Size Scale</span>
                        <span className="text-sm font-medium text-gray-700">{test.effectSize}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (typeof test?.cohensD === 'number' ? Math.abs(test.cohensD) : 0) < 0.2 ? 'bg-gray-400' :
                            (typeof test?.cohensD === 'number' ? Math.abs(test.cohensD) : 0) < 0.5 ? 'bg-yellow-400' :
                            (typeof test?.cohensD === 'number' ? Math.abs(test.cohensD) : 0) < 0.8 ? 'bg-orange-400' :
                            'bg-red-400'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (typeof test?.cohensD === 'number' ? Math.abs(test.cohensD) : 0) * 100)}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>0.2</span>
                        <span>0.5</span>
                        <span>0.8</span>
                        <span>1.0+</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* for stats */}
      {tTestResults?.interpretation && (
        <div className="mt-6">
          <button
            onClick={() => setShowInterpretation(!showInterpretation)}
            className="w-full bg-gradient-to-r from-[#319694] to-[#267b79] text-white p-3 sm:p-4 rounded-lg flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <span className="font-semibold text-sm sm:text-base">Statistical Analysis Interpretation</span>
            </div>
            {showInterpretation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          <AnimatePresence>
            {showInterpretation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-br from-[#319694]/5 to-[#319694]/10 border border-[#319694]/30 rounded-b-lg p-4 sm:p-6"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Award className="text-[#319694]" size={18} />
                    Overall Conclusion
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {tTestResults.interpretation.conclusion}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="text-[#319694]" size={18} />
                    Practical Significance
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {tTestResults.interpretation.effectSizeExplanation}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Info className="text-[#319694]" size={18} />
                    Confidence Level
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {tTestResults.interpretation.confidenceExplanation}
                  </p>
                </div>
                
                {tTestResults.interpretation.metricAnalysis && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="text-[#319694]" size={18} />
                      Detailed Metric Analysis
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(tTestResults.interpretation.metricAnalysis).map(([metric, analysis]) => {
                        const claimed = detectAlgorithmFromText(analysis);
                        const test = metricTests?.[metric];
                        const consistent = !test || !test.significant || !claimed || claimed === test.betterAlgorithm;
                        const displayName = metric === 'loadBalance' ? 'Degree of Imbalance' : 
                                          metric.replace(/([A-Z])/g, ' $1').trim();
                        return (
                          <div key={metric} className={`bg-white rounded-lg p-3 border ${consistent ? 'border-gray-200' : 'border-amber-300'}`}>
                            <h5 className="font-medium text-gray-800 text-base mb-1 capitalize">
                              {displayName}
                              {!consistent && (
                                <span className="ml-2 text-sm text-amber-700">(note: text vs t-test mismatch)</span>
                              )}
                            </h5>
                            <p className="text-base text-gray-600 leading-relaxed">{analysis}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-bold text-red-600">***</span>
            <span>p &lt; 0.001</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-orange-600">**</span>
            <span>p &lt; 0.01</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-yellow-600">*</span>
            <span>p &lt; 0.05</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">ns</span>
            <span>Not significant</span>
          </div>
          <div className="sm:ml-auto flex items-center gap-1 mt-2 sm:mt-0">
            <AlertCircle size={14} className="text-gray-400 flex-shrink-0" />
            <span>Based on {sampleSize} paired observations (differences: EACO - EPSO)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PairedTTestDisplay;
