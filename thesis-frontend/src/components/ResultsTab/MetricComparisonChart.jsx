import React from 'react';
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

const MetricComparisonChart = ({ metricName, data }) => {
  if (!data || data.eacoMean === undefined || data.epsoMean === undefined) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">Chart data unavailable</p>
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
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default MetricComparisonChart;
