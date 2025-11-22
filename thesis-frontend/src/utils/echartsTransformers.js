const COLORS = {
  primary: '#2E86AB',
  secondary: '#A23B72',
  success: '#73C2BE',
  warning: '#F18F01',
  danger: '#C73E1D',
  neutral: '#6B7280',
  teal: '#319694',
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.000';
  return Number(value).toFixed(3);
};

export const transformPerformanceMetrics = (summary, algorithmName) => {
  if (!summary) return null;

  const makespan = summary.makespan || 0;
  const responseTime = summary.responseTime || summary.avgResponseTime || 0;
  const resourceUtilization = summary.resourceUtilization || 0;
  const energyConsumption = summary.energyConsumption || 0;
  const degreeOfImbalance = summary.loadImbalance !== undefined 
    ? summary.loadImbalance 
    : summary.loadBalance !== undefined 
    ? summary.loadBalance 
    : 0;

  return {
    title: {
      text: `${algorithmName}`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        const value = params[0].value;
        const name = params[0].name;
        let unit = '';
        if (name.includes('Time')) unit = ' s';
        else if (name.includes('Util')) unit = '%';
        else if (name.includes('Energy')) unit = ' Wh';
        else if (name.includes('Imbalance')) unit = '';
        return `${name}: ${formatNumber(value)}${unit}`;
      }
    },
    grid: {
      left: '12%',
      right: '10%',
      bottom: '20%',
      top: '25%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Makespan', 'Response\nTime', 'Resource\nUtil.', 'Energy\nCons.', 'Degree of\nImbalance'],
      axisLabel: {
        color: '#374151',
        fontSize: 10,
        interval: 0,
        lineHeight: 14
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#374151',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.2
        }
      }
    },
    series: [{
      type: 'bar',
      data: [
        {
          value: makespan,
          itemStyle: { color: COLORS.primary },
          label: { 
            show: true, 
            position: 'top', 
            formatter: () => formatNumber(makespan),
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1F2937',
            distance: 10
          }
        },
        {
          value: responseTime,
          itemStyle: { color: COLORS.primary },
          label: { 
            show: true, 
            position: 'top', 
            formatter: () => formatNumber(responseTime),
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1F2937',
            distance: 10
          }
        },
        {
          value: resourceUtilization,
          itemStyle: { color: COLORS.success },
          label: { 
            show: true, 
            position: 'top', 
            formatter: () => formatNumber(resourceUtilization),
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1F2937',
            distance: 10
          }
        },
        {
          value: energyConsumption,
          itemStyle: { color: COLORS.warning },
          label: { 
            show: true, 
            position: 'top', 
            formatter: () => formatNumber(energyConsumption),
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1F2937',
            distance: 10
          }
        },
        {
          value: degreeOfImbalance,
          itemStyle: { color: COLORS.danger },
          label: { 
            show: true, 
            position: 'top', 
            formatter: () => formatNumber(degreeOfImbalance),
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1F2937',
            distance: 10
          }
        }
      ],
      barCategoryGap: '60%',
      barWidth: '40%',
      labelLayout: {
        hideOverlap: false
      }
    }],
    labelLayout: {
      hideOverlap: false
    }
  };
};

export const transformDetailedAnalysis = (summary, algorithmName) => {
  if (!summary) return null;

  const avgResponseTime = summary.responseTime || summary.avgResponseTime || 0;
  const makespan = summary.makespan || 0;
  const resourceUtilization = summary.resourceUtilization || 0;
  const throughput = summary.throughput || 0;
  const energyConsumption = summary.energyConsumption || 0;
  const energyDisplay = energyConsumption * 1000;
  const energyPerTime = makespan > 0 ? energyDisplay / makespan : 0;
  const degreeOfImbalance = summary.loadImbalance || 0;

  return [
    {
      title: { text: 'Time-based Metrics', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)}s`
      },
      grid: { left: '18%', right: '12%', bottom: '20%', top: '30%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['Avg Response\nTime', 'Makespan'],
        axisLabel: { fontSize: 10, color: '#374151', interval: 0, lineHeight: 14 }
      },
      yAxis: { 
        type: 'value', 
        name: 'Time (seconds)',
        nameTextStyle: { fontSize: 11, color: '#374151' },
        axisLabel: { fontSize: 10, color: '#374151' }
      },
      series: [{
        type: 'bar',
        data: [
          {
            value: avgResponseTime,
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => formatNumber(avgResponseTime),
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 10
            }
          },
          {
            value: makespan,
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => formatNumber(makespan),
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 10
            }
          }
        ],
        barCategoryGap: '50%',
        barWidth: '45%',
        itemStyle: { color: COLORS.primary },
        labelLayout: { hideOverlap: false }
      }],
      labelLayout: { hideOverlap: false }
    },
    {
      title: { text: 'Efficiency Metrics', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)}`
      },
      grid: { left: '18%', right: '12%', bottom: '20%', top: '30%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['Resource\nUtil. (%)'],
        axisLabel: { fontSize: 10, color: '#374151', interval: 0, lineHeight: 14 }
      },
      yAxis: { 
        type: 'value', 
        name: 'Value',
        nameTextStyle: { fontSize: 11, color: '#374151' },
        axisLabel: { fontSize: 10, color: '#374151' }
      },
      series: [{
        type: 'bar',
        data: [
          {
            value: resourceUtilization,
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => formatNumber(resourceUtilization),
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 10
            }
          },
          
        ],
        barCategoryGap: '50%',
        barWidth: '45%',
        itemStyle: { color: COLORS.success },
        labelLayout: { hideOverlap: false }
      }],
      labelLayout: { hideOverlap: false }
    },
    {
      title: { text: 'Energy Consumption', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)} mWh`
      },
      grid: { left: '18%', right: '12%', bottom: '20%', top: '30%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['Total\nEnergy', 'Energy/\nTime'],
        axisLabel: { fontSize: 10, color: '#374151', interval: 0, lineHeight: 14 }
      },
      yAxis: { 
        type: 'value', 
        name: 'Energy (mWh)',
        nameTextStyle: { fontSize: 11, color: '#374151' },
        axisLabel: { fontSize: 10, color: '#374151' }
      },
      series: [{
        type: 'bar',
        data: [
          {
            value: energyDisplay,
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => formatNumber(energyDisplay),
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 10
            }
          },
          {
            value: energyPerTime,
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => formatNumber(energyPerTime),
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 10
            }
          }
        ],
        barCategoryGap: '50%',
        barWidth: '45%',
        itemStyle: { color: COLORS.warning },
        labelLayout: { hideOverlap: false }
      }],
      labelLayout: { hideOverlap: false }
    },
    {
      title: { text: 'Degree of Imbalance', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)}`
      },
      grid: { left: '18%', right: '12%', bottom: '20%', top: '30%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['Degree of\nImbalance'],
        axisLabel: { fontSize: 10, color: '#374151', interval: 0, lineHeight: 14 }
      },
      yAxis: { 
        type: 'value', 
        name: 'Value',
        nameTextStyle: { fontSize: 11, color: '#374151' },
        axisLabel: { fontSize: 10, color: '#374151' }
      },
      series: [{
        type: 'bar',
        data: [
          {
            value: degreeOfImbalance,
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => formatNumber(degreeOfImbalance),
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 10
            }
          }
        ],
        barCategoryGap: '50%',
        barWidth: '45%',
        itemStyle: { color: COLORS.danger },
        labelLayout: { hideOverlap: false }
      }],
      labelLayout: { hideOverlap: false }
    }
  ];
};

export const transformVMUtilization = (vmUtilization, algorithmName) => {
  if (!vmUtilization || vmUtilization.length === 0) return null;

  const vmIds = vmUtilization.map((_, idx) => `VM ${idx + 1}`);
  const cpuUtil = vmUtilization.map(vm => vm.cpuUtilization || 0);
  const ramUtil = vmUtilization.map(vm => vm.ramUtilization || 0);

  const avgCpu = cpuUtil.reduce((a, b) => a + b, 0) / cpuUtil.length;
  const avgRam = ramUtil.reduce((a, b) => a + b, 0) / ramUtil.length;
  const maxCpuValue = cpuUtil.length > 0 ? Math.max(...cpuUtil) : 0;
  const dynamicCpuMax = Math.max(100, Math.ceil(maxCpuValue / 10) * 10);

  return {
    title: {
      text: `${algorithmName}`,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(item => {
          result += `${item.marker} ${item.seriesName}: ${formatNumber(item.value)}%<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['CPU', 'RAM'],
      top: '8%',
      textStyle: { fontSize: 10 }
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '20%',
      bottom: vmUtilization.length > 15 ? '35%' : '30%'
    },
    xAxis: {
      type: 'category',
      data: vmIds,
      axisLabel: {
        interval: vmUtilization.length > 30 ? 4 : vmUtilization.length > 15 ? 1 : 0,
        rotate: vmUtilization.length > 15 ? 45 : 0,
        fontSize: 9
      }
    },
    yAxis: {
      type: 'value',
      max: dynamicCpuMax,
      axisLabel: { formatter: '{value}%' }
    },
    series: [
      {
        name: 'CPU',
        type: 'bar',
        data: cpuUtil,
        itemStyle: { color: COLORS.primary },
        label: { show: false }
      },
      {
        name: 'RAM',
        type: 'bar',
        data: ramUtil,
        itemStyle: { color: COLORS.warning },
        label: { show: false }
      }
    ],
    graphic: [{
      type: 'text',
      left: 'center',
      bottom: '5%',
      style: {
        text: `Average Resource Utilization:\nCPU: ${formatNumber(avgCpu)}% | RAM: ${formatNumber(avgRam)}%\nCPU Range: ${formatNumber(Math.min(...cpuUtil))}% - ${formatNumber(Math.max(...cpuUtil))}%\nRAM Range: ${formatNumber(Math.min(...ramUtil))}% - ${formatNumber(Math.max(...ramUtil))}%`,
        fontSize: 11,
        fontWeight: 'bold',
        fill: '#000',
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 4
      }
    }]
  };
};

export const transformEnergyAnalysis = (summary, algorithmName) => {
  if (!summary) return null;

  const makespan = summary.makespan || 0;
  const energyData = summary.energyConsumption || 0;
  const throughput = summary.throughput || (makespan > 0 ? 1000 / makespan : 0);
  
  const energyData1000 = energyData * 1000;
  const energyPerSecond = makespan > 0 ? energyData1000 / makespan : 0;
  
  const tasksCompleted = throughput * makespan;
  const tasksPerWh = energyData > 0 && tasksCompleted > 0 ? tasksCompleted / energyData : 0;
  const mWhPerTask = energyData > 0 && tasksCompleted > 0 ? (energyData * 1000) / tasksCompleted : 0;

  return [
    {
      title: { 
        text: 'Energy Consumption Analysis', 
        left: 'center', 
        top: '2%',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' } 
      },
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: { color: '#000' },
        formatter: function(params) {
          const item = params[0];
          return `<strong>${item.name}</strong><br/>${item.seriesName}: ${formatNumber(item.value)} mWh`;
        }
      },
      legend: {
        data: ['Energy Consumption'],
        top: '12%',
        left: 'center'
      },
      grid: { 
        left: '20%', 
        right: '20%', 
        bottom: '25%', 
        top: '30%', 
        containLabel: true 
      },
      xAxis: { 
        type: 'category', 
        data: ['Total\nEnergy', 'Energy per\nSecond'],
        axisLabel: { 
          fontSize: 11, 
          color: '#374151',
          interval: 0,
          rotate: 0,
          margin: 15,
          lineHeight: 16
        },
        axisLine: {
          lineStyle: { color: '#374151' }
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'Energy (mWh)',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: { fontSize: 12, color: '#374151' },
        axisLabel: { fontSize: 11, color: '#374151' },
        splitLine: {
          lineStyle: { color: '#e5e7eb', type: 'dashed' }
        }
      },
      series: [{
        name: 'Energy Consumption',
        type: 'bar',
        data: [
          {
            value: energyData1000,
            itemStyle: { color: COLORS.warning },
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => `${formatNumber(energyData1000)}`,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 15,
              padding: [5, 8, 5, 8]
            }
          },
          {
            value: energyPerSecond,
            itemStyle: { color: COLORS.warning },
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => `${formatNumber(energyPerSecond)}`,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 15,
              padding: [5, 8, 5, 8]
            }
          }
        ],
        barMaxWidth: 80,
        barCategoryGap: '60%',
        emphasis: {
          itemStyle: {
            color: COLORS.warning,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        },
        labelLayout: { 
          hideOverlap: false,
          moveOverlap: 'shiftY'
        }
      }],
      labelLayout: { 
        hideOverlap: false,
        moveOverlap: 'shiftY'
      }
    },
    {
      title: { 
        text: 'Energy Efficiency Metrics', 
        left: 'center', 
        top: '2%',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' } 
      },
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: { color: '#000' },
        formatter: function(params) {
          const item = params[0];
          const unit = item.dataIndex === 0 ? ' tasks/Wh' : ' mWh/task';
          return `<strong>${item.name}</strong><br/>${item.seriesName}: ${formatNumber(item.value)}${unit}`;
        }
      },
      legend: {
        data: ['Energy Efficiency'],
        top: '12%',
        left: 'center'
      },
      grid: { 
        left: '20%', 
        right: '20%', 
        bottom: '25%', 
        top: '30%', 
        containLabel: true 
      },
      xAxis: { 
        type: 'category', 
        data: ['Tasks per\nWh', 'mWh per\nTask'],
        axisLabel: { 
          fontSize: 11, 
          color: '#374151',
          interval: 0,
          rotate: 0,
          margin: 15,
          lineHeight: 16
        },
        axisLine: {
          lineStyle: { color: '#374151' }
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'Efficiency',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: { fontSize: 12, color: '#374151' },
        axisLabel: { fontSize: 11, color: '#374151' },
        splitLine: {
          lineStyle: { color: '#e5e7eb', type: 'dashed' }
        }
      },
      series: [{
        name: 'Energy Efficiency',
        type: 'bar',
        data: [
          {
            value: tasksPerWh,
            itemStyle: { color: COLORS.success },
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => `${formatNumber(tasksPerWh)}`,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 15,
              padding: [5, 8, 5, 8]
            }
          },
          {
            value: mWhPerTask,
            itemStyle: { color: COLORS.success },
            label: { 
              show: true, 
              position: 'top', 
              formatter: () => `${formatNumber(mWhPerTask)}`,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#1F2937',
              distance: 15,
              padding: [5, 8, 5, 8]
            }
          }
        ],
        barMaxWidth: 80,
        barCategoryGap: '60%',
        emphasis: {
          itemStyle: {
            color: COLORS.success,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        },
        labelLayout: { 
          hideOverlap: false,
          moveOverlap: 'shiftY'
        }
      }],
      labelLayout: { 
        hideOverlap: false,
        moveOverlap: 'shiftY'
      }
    }
  ];
};


export const transformRadarChart = (summary, algorithmName) => {
  if (!summary) return null;

  const makespan = Math.max(0, summary.makespan || 0);
  const avgResponseTime = Math.max(0, summary.responseTime || summary.avgResponseTime || 0);
  const resourceUtilization = Math.max(0, summary.resourceUtilization || 0);
  const energyConsumption = Math.max(0, summary.energyConsumption || 0);
  const degreeOfImbalance = Math.max(0, summary.loadImbalance || 0);

  const values = [
    makespan,
    avgResponseTime, 
    resourceUtilization,
    energyConsumption,
    degreeOfImbalance
  ];

  // Better max calculations based on official examples
  const maxMakespan = Math.max(makespan * 1.2, 100);
  const maxResponseTime = Math.max(avgResponseTime * 1.2, 100);
  const maxEnergy = Math.max(energyConsumption * 1.2, 10);
  const maxImbalance = Math.max(degreeOfImbalance * 1.2, 5);
  const maxResourceUtilization = Math.max(resourceUtilization * 1.2, 100);

  return {
    title: {
      text: `${algorithmName} Performance Radar`,
      left: 'center',
      top: '3%',
      textStyle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#1F2937' 
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#000'
      },
      formatter: (params) => {
        if (!params.value || !Array.isArray(params.value)) {
          return `${algorithmName}`;
        }
        const dimensions = [
          { name: 'Makespan', unit: 's' },
          { name: 'Response Time', unit: 's' },
          { name: 'Resource Utilization', unit: '%' },
          { name: 'Energy Consumption', unit: ' Wh' },
          { name: 'Degree of Imbalance', unit: '' }
        ];
        let result = `<strong>${algorithmName}</strong><br/>`;
        params.value.forEach((val, idx) => {
          if (idx < dimensions.length) {
            result += `${dimensions[idx].name}: ${formatNumber(val)}${dimensions[idx].unit}<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: [algorithmName],
      top: '15%',
      left: 'center'
    },
    radar: {
      shape: 'polygon',
      center: ['50%', '60%'],
      radius: '65%',
      startAngle: 90,
      splitNumber: 5,
      indicator: [
        { name: 'Makespan (s)', max: maxMakespan },
        { name: 'Response Time (s)', max: maxResponseTime },
        { name: 'Resource Util. (%)', max: maxResourceUtilization },
        { name: 'Energy Cons. (Wh)', max: maxEnergy },
        { name: 'Degree of Imbalance', max: maxImbalance }
      ],
      name: {
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal',
          color: '#374151'
        }
      },
      splitLine: {
        lineStyle: {
          color: COLORS.neutral,
          width: 1,
          type: 'solid'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            'rgba(49, 150, 148, 0.05)',
            'rgba(49, 150, 148, 0.1)',
            'rgba(49, 150, 148, 0.05)',
            'rgba(49, 150, 148, 0.1)',
            'rgba(49, 150, 148, 0.05)'
          ]
        }
      },
      axisLine: {
        lineStyle: {
          color: COLORS.neutral,
          width: 1
        }
      }
    },
    series: [{
      name: algorithmName,
      type: 'radar',
      emphasis: {
        disabled: true
      },
      data: [{
        value: values,
        name: algorithmName,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: COLORS.teal,
          width: 2
        },
        itemStyle: {
          color: COLORS.teal,
          borderColor: '#fff',
          borderWidth: 1
        },
        areaStyle: {
          color: 'rgba(49, 150, 148, 0.2)'
        }
      }]
    }]
  };
};
