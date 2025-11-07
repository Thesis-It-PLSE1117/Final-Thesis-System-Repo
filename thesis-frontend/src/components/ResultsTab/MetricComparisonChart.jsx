import React, { forwardRef } from 'react';
import ReactECharts from 'echarts-for-react';

const METRIC_LABELS = {
  makespan: 'Makespan (seconds)',
  energyConsumption: 'Energy Consumption (Wh)',
  resourceUtilization: 'Resource Utilization (%)',
  responseTime: 'Response Time (seconds)',
  loadBalance: 'Load Balance Index'
};

const getBarColor = (algorithm, isWinner, isSignificant) => {
  if (algorithm === 'EACO') {
    return isWinner && isSignificant ? '#1d4ed8' : '#3b82f6';
  }
  return isWinner && isSignificant ? '#c2410c' : '#f97316';
};

const MetricComparisonChart = forwardRef(({ metricName, data }, ref) => {
  if (!data || data.eacoMean === undefined || data.epsoMean === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300">
        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm font-medium text-gray-700">Mean values unavailable</p>
        <p className="text-xs text-gray-500 mt-1">Imported data lacks metric averages</p>
        {data?.betterAlgorithm && (
          <p className="text-xs text-blue-600 mt-2 font-medium">
            Statistical winner: {data.betterAlgorithm}
          </p>
        )}
      </div>
    );
  }

  const option = {
    title: {
      text: METRIC_LABELS[metricName] || metricName,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const algo = params[0].name;
        const mean = params[0].value;
        const std = algo === 'EACO' ? data.eacoStd : data.epsoStd;
        return `<strong>${algo}</strong><br/>Mean: ${mean.toFixed(3)}<br/>Std Dev: ±${std?.toFixed(3) || 'N/A'}`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['EACO', 'EPSO'],
      axisLabel: {
        fontSize: 12,
        fontWeight: 600
      }
    },
    yAxis: {
      type: 'value',
      name: METRIC_LABELS[metricName] || metricName,
      nameTextStyle: {
        fontSize: 11,
        color: '#6b7280'
      }
    },
    series: [{
      type: 'bar',
      data: [
        {
          value: data.eacoMean,
          itemStyle: {
            color: getBarColor('EACO', data.betterAlgorithm === 'EACO', data.significant)
          }
        },
        {
          value: data.epsoMean,
          itemStyle: {
            color: getBarColor('EPSO', data.betterAlgorithm === 'EPSO', data.significant)
          }
        }
      ],
      label: {
        show: true,
        position: 'top',
        formatter: (params) => params.value.toFixed(3),
        fontSize: 11,
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <ReactECharts
        ref={ref}
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
});

MetricComparisonChart.displayName = 'MetricComparisonChart';

export default MetricComparisonChart;
