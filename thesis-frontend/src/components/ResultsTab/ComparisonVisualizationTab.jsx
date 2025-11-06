import React from 'react';
import { motion } from 'framer-motion';
import MetricComparisonChart from './MetricComparisonChart';
import MetricInterpretations from './MetricInterpretations';

const METRICS = ['makespan', 'energyConsumption', 'resourceUtilization', 'responseTime', 'loadBalance'];

const METRIC_DISPLAY_NAMES = {
  makespan: 'Makespan',
  energyConsumption: 'Energy Consumption',
  resourceUtilization: 'Resource Utilization',
  responseTime: 'Response Time',
  loadBalance: 'Load Balance'
};

const ComparisonVisualizationTab = ({ tTestResults }) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {METRICS.map((metricKey, index) => {
          const metricData = metricTests[metricKey];
          
          if (!metricData) {
            return null;
          }

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
                metricName={metricKey}
                data={metricData}
              />
              
              <MetricInterpretations data={metricData} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ComparisonVisualizationTab;
