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
  Scale
} from 'lucide-react';

const PairedTTestDisplay = ({ tTestResults, isLoading = false }) => {
  // Debug: inspect incoming t-test results
  try {
    if (tTestResults && tTestResults.metricTests) {
      const sample = Object.entries(tTestResults.metricTests)[0];
      if (sample) {
        const [name, test] = sample;
        // eslint-disable-next-line no-console
        console.debug('[TTEST DEBUG] Sample metric:', name, {
          tStatistic: test?.tStatistic,
          pValue: test?.pValue,
          df: test?.degreesOfFreedom,
          types: {
            tStatistic: typeof test?.tStatistic,
            pValue: typeof test?.pValue,
            df: typeof test?.degreesOfFreedom,
          },
        });
      }
    }
  } catch {}
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

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

  // HCI-friendly metadata: consistent icons and descriptive labels
  const getMetricMeta = (metricName) => {
    switch (metricName) {
      case 'makespan':
        return { Icon: Clock, label: 'Total Completion Time (Makespan)', unit: 'seconds', betterWhen: 'lower' };
      case 'energyConsumption':
        return { Icon: Zap, label: 'Energy Consumption', unit: 'Wh', betterWhen: 'lower' };
      case 'resourceUtilization':
        return { Icon: Gauge, label: 'Resource Utilization', unit: '%', betterWhen: 'higher' };
      case 'responseTime':
        return { Icon: Timer, label: 'Average Response Time', unit: 'seconds', betterWhen: 'lower' };
      case 'loadBalance':
        return { Icon: Scale, label: 'Degree of Imbalance (DI)', unit: 'ratio', betterWhen: 'lower' };
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
      className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-200 mb-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#319694]/10 rounded-lg">
            <BarChart3 className="text-[#319694]" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Paired T-Test Statistical Analysis
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Statistical validation of algorithm performance differences
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="text-sm text-[#319694] hover:text-[#267b79] flex items-center gap-1"
        >
          <Info size={16} />
          Methodology
        </button>
      </div>

      {/* Methodology Explanation */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <h4 className="font-semibold text-blue-900 mb-2">Statistical Methodology</h4>
            <p className="text-sm text-blue-800 mb-2">
              We use two-tailed paired t-tests on per-iteration paired differences under 
              identical workload conditions to compare EPSO and EACO algorithms.
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs">
              <p>Formula: t = d̄ / (Sd/√n)</p>
              <p className="text-gray-600 mt-1">
                where d̄ = mean difference (EACO - EPSO), Sd = std deviation, n = {sampleSize}
              </p>
            </div>
            <p className="text-sm text-blue-800 mt-2">
              Significance level (α) = {alpha}, Two-tailed test
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Winner Card */}
      <div className="bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 rounded-lg p-6 mb-6 border border-[#319694]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Award className="text-[#319694]" size={32} />
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Statistical Winner</p>
              <p className="text-2xl font-bold text-gray-800">
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
          <div className="text-right">
            <p className="text-3xl font-bold text-[#319694]">
              {significantDifferences}/{Object.keys(metricTests || {}).length}
            </p>
            <p className="text-sm text-gray-600">Significant Metrics</p>
          </div>
        </div>
      </div>

      {/* Metric Tests Results */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
          <BarChart3 size={20} className="text-gray-500" />
          Individual Metric Analysis
        </h4>
        
        {Object.entries(metricTests || {}).map(([metricName, test]) => (
          <motion.div
            key={metricName}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 bg-white cursor-pointer"
              onClick={() => setExpandedMetric(expandedMetric === metricName ? null : metricName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => { const { Icon } = getMetricMeta(metricName); return (
                    <span className="p-2 rounded-md bg-gray-100" aria-hidden="true">
                      <Icon className="text-gray-700" size={18} />
                    </span>
                  ); })()}
                  <div>
                    <h5 className="font-semibold text-gray-800" title={getMetricMeta(metricName).label} aria-label={getMetricMeta(metricName).label}>
                      {getMetricMeta(metricName).label}
                      {getMetricMeta(metricName).betterWhen && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({getMetricMeta(metricName).betterWhen} is better)
                        </span>
                      )}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      {test.significant ? (
                        <>
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-sm text-green-600 font-medium">
                            Significant: {test.betterAlgorithm} performs {test.improvementPercentage.toFixed(2)}% better
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-gray-400" size={16} />
                          <span className="text-sm text-gray-500">
                            No significant difference
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-sm font-mono ${getSignificanceColor(test?.pValue)}`}>
                      p = {typeof test?.pValue === 'number' ? test.pValue.toFixed(4) : '—'}
                      {typeof test?.pValue === 'number' && test.pValue < 0.001 && ' ***'}
                      {typeof test?.pValue === 'number' && test.pValue >= 0.001 && test.pValue < 0.01 && ' **'}
                      {typeof test?.pValue === 'number' && test.pValue >= 0.01 && test.pValue < 0.05 && ' *'}
                    </p>
                    <p className="text-xs text-gray-500">
                      t({typeof test?.degreesOfFreedom === 'number' ? test.degreesOfFreedom : '—'}) = {typeof test?.tStatistic === 'number' ? test.tStatistic.toFixed(3) : '—'}
                    </p>
                  </div>
                  {expandedMetric === metricName ? <ChevronUp /> : <ChevronDown />}
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
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mean Difference</p>
                      <p className="font-semibold text-gray-800" title="EACO - EPSO">
                        {typeof test?.meanDifference === 'number' ? test.meanDifference.toFixed(4) : '—'}
                        <span className="text-xs text-gray-500 ml-1">{getMetricMeta(metricName).unit}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Std Error</p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.standardError === 'number' ? test.standardError.toFixed(4) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">95% CI</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        [{typeof test?.ciLower === 'number' ? test.ciLower.toFixed(3) : '—'}, {typeof test?.ciUpper === 'number' ? test.ciUpper.toFixed(3) : '—'}]
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cohen's d</p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.cohensD === 'number' ? test.cohensD.toFixed(3) : '—'} ({test?.effectSize || '—'})
                      </p>
                    </div>
                  </div>
                  
                  {/* Visual representation */}
                  <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Effect Size Scale</span>
                        <span className="text-xs font-medium text-gray-700">{test.effectSize}</span>
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

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
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
          <div className="ml-auto flex items-center gap-1">
            <AlertCircle size={14} className="text-gray-400" />
            <span>Based on {sampleSize} paired observations (differences: EACO - EPSO)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PairedTTestDisplay;
