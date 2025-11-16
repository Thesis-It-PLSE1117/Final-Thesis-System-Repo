import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Maximize2 } from 'lucide-react';
import MetricComparisonChart from './MetricComparisonChart';
import MetricInterpretations from './MetricInterpretations';
import ChartModal from '../ECharts/ChartModal';
import { backupMetricData } from '../../utils/backupMetricData';

const METRICS = ['makespan', 'energyConsumption', 'resourceUtilization', 'responseTime', 'loadImbalance'];

const METRIC_DISPLAY_NAMES = {
  makespan: 'Makespan',
  energyConsumption: 'Energy Consumption',
  resourceUtilization: 'Resource Utilization',
  responseTime: 'Response Time',
  loadImbalance: 'Degree of Imbalance',
  loadBalance: 'Degree of Imbalance'
};

const ComparisonVisualizationTab = ({ tTestResults, eacoResults, epsoResults }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRefsArray = useRef([]);
  const exportMenuRef = useRef(null);

  if (!tTestResults || !tTestResults.metricTests) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-600 font-medium">No Comparison Data Available</p>
          <p className="text-gray-500 text-sm mt-2">
            Statistical test results are required for metric comparisons
          </p>
        </div>
      </div>
    );
  }

  const metricTests = tTestResults.metricTests;

  const handleExportPNG = () => {
    const validRefs = chartRefsArray.current.filter(ref => ref !== null);
    if (validRefs.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const padding = 20;
    const cols = 2;
    const chartWidth = 600;
    const chartHeight = 350;
    
    canvas.width = (chartWidth * cols) + (padding * (cols + 1));
    canvas.height = (chartHeight * Math.ceil(validRefs.length / cols)) + (padding * (Math.ceil(validRefs.length / cols) + 1));
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imagePromises = validRefs.map((ref, idx) => {
      return new Promise((resolve) => {
        const instance = ref.getEchartsInstance();
        const url = instance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
        const img = new Image();
        img.onload = () => resolve({ img, idx });
        img.src = url;
      });
    });

    Promise.all(imagePromises).then((images) => {
      images.forEach(({ img, idx }) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const x = padding + (col * (chartWidth + padding));
        const y = padding + (row * (chartHeight + padding));
        ctx.drawImage(img, x, y, chartWidth, chartHeight);
      });

      const link = document.createElement('a');
      link.download = 'comparison_metrics_chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShowExportMenu(false);
    });
  };

  const getChartOptionsForModal = () => {
    return METRICS
      .map(metricKey => {
        const metricData = metricTests[metricKey] || (metricKey === 'loadImbalance' ? metricTests.loadBalance : null);
        if (!metricData) return null;
        
        const enrichedData = backupMetricData(metricKey, metricData, eacoResults, epsoResults);
        
        if (!enrichedData || enrichedData.eacoMean === undefined || enrichedData.epsoMean === undefined) {
          return null;
        }

        const METRIC_LABELS = {
          makespan: 'Makespan (seconds)',
          energyConsumption: 'Energy Consumption (Wh)',
          resourceUtilization: 'Resource Utilization (%)',
          responseTime: 'Response Time (seconds)',
          loadImbalance: 'Degree of Imbalance (DI)',
          loadBalance: 'Degree of Imbalance (DI)'
        };

        const getBarColor = (algorithm, isWinner, isSignificant) => {
          if (algorithm === 'EACO') {
            return isWinner && isSignificant ? '#1d4ed8' : '#3b82f6';
          }
          return isWinner && isSignificant ? '#c2410c' : '#f97316';
        };

        return {
          title: {
            text: METRIC_LABELS[metricKey] || metricKey,
            left: 'center',
            textStyle: {
              fontSize: 18,
              fontWeight: 600,
              color: '#374151'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              const algo = params[0].name;
              const mean = params[0].value;
              const std = algo === 'EACO' ? enrichedData.eacoStd : enrichedData.epsoStd;
              return `<strong>${algo}</strong><br/>Mean: ${mean.toFixed(3)}<br/>Std Dev: ±${std?.toFixed(3) || 'N/A'}`;
            }
          },
          xAxis: {
            type: 'category',
            data: ['EACO', 'EPSO'],
            axisLabel: {
              fontSize: 14,
              fontWeight: 600
            }
          },
          yAxis: {
            type: 'value',
            name: METRIC_LABELS[metricKey] || metricKey,
            nameTextStyle: {
              fontSize: 13,
              color: '#6b7280'
            }
          },
          series: [{
            type: 'bar',
            data: [
              {
                value: enrichedData.eacoMean,
                itemStyle: {
                  color: getBarColor('EACO', enrichedData.betterAlgorithm === 'EACO', enrichedData.significant)
                }
              },
              {
                value: enrichedData.epsoMean,
                itemStyle: {
                  color: getBarColor('EPSO', enrichedData.betterAlgorithm === 'EPSO', enrichedData.significant)
                }
              }
            ],
            label: {
              show: true,
              position: 'top',
              formatter: (params) => params.value.toFixed(3),
              fontSize: 13,
              fontWeight: 600
            },
            barWidth: '60%'
          }],
          grid: {
            left: '15%',
            right: '5%',
            bottom: '10%',
            top: '20%'
          }
        };
      })
      .filter(option => option !== null);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <div>
            <p className="text-blue-900 font-semibold text-md">
              Mean per Metric Comparison
            </p>
            <p className="text-blue-700 text-sm mt-1">
              Charts for EACO and EPSO mean performance across all metrics.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700 text-sm font-medium">
          Export all charts at once
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-50 border border-gray-300 flex items-center gap-1.5 font-normal transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            View All
          </button>
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-50 border border-gray-300 flex items-center gap-1.5 font-normal transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export All
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-sm border border-gray-200 z-10 py-1">
                <button
                  onClick={handleExportPNG}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Export as PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {METRICS.map((metricKey, index) => {
          const metricData = metricTests[metricKey] || (metricKey === 'loadImbalance' ? metricTests.loadBalance : null);
          
          if (!metricData) {
            return null;
          }

          const enrichedData = backupMetricData(metricKey, metricData, eacoResults, epsoResults);

          return (
            <motion.div
              key={metricKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {METRIC_DISPLAY_NAMES[metricKey]}
              </h3>
              
              <MetricComparisonChart
                ref={(el) => { chartRefsArray.current[index] = el; }}
                metricName={metricKey}
                data={enrichedData}
              />
              
              <MetricInterpretations data={enrichedData} />
            </motion.div>
          );
        })}
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chartOption={getChartOptionsForModal()}
        chartTitle="Metric Comparison"
        algorithm="EACO vs EPSO"
        isMultiChart={true}
      />
    </motion.div>
  );
};

export default ComparisonVisualizationTab;
