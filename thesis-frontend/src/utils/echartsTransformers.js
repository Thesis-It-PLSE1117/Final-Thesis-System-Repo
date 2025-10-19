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
      text: `${algorithmName} Algorithm - Performance Metrics`,
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
      bottom: '15%',
      top: '15%'
    },
    xAxis: {
      type: 'category',
      data: ['Makespan', 'Response Time', 'Resource Util.', 'Energy Cons.', 'Degree of Imbalance'],
      axisLabel: {
        color: '#374151',
        fontSize: 11
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
        { value: makespan, itemStyle: { color: COLORS.primary } },
        { value: responseTime, itemStyle: { color: COLORS.primary } },
        { value: resourceUtilization, itemStyle: { color: COLORS.success } },
        { value: energyConsumption, itemStyle: { color: COLORS.warning } },
        { value: degreeOfImbalance, itemStyle: { color: COLORS.danger } }
      ],
      label: {
        show: true,
        position: 'top',
        formatter: (params) => formatNumber(params.value),
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000'
      },
      barWidth: '60%'
    }]
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
      grid: { left: '18%', right: '12%', bottom: '15%', top: '22%' },
      xAxis: { type: 'category', data: ['Avg Response Time', 'Makespan'] },
      yAxis: { type: 'value', name: 'Time (seconds)' },
      series: [{
        type: 'bar',
        data: [avgResponseTime, makespan],
        itemStyle: { color: COLORS.primary },
        label: { show: true, position: 'top', formatter: (params) => formatNumber(params.value) }
      }]
    },
    {
      title: { text: 'Efficiency Metrics', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)}`
      },
      grid: { left: '18%', right: '12%', bottom: '15%', top: '22%' },
      xAxis: { type: 'category', data: ['Resource Util. (%)', 'Throughput'] },
      yAxis: { type: 'value', name: 'Value' },
      series: [{
        type: 'bar',
        data: [resourceUtilization, throughput],
        itemStyle: { color: COLORS.success },
        label: { show: true, position: 'top', formatter: (params) => formatNumber(params.value) }
      }]
    },
    {
      title: { text: 'Energy Consumption', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)} mWh`
      },
      grid: { left: '18%', right: '12%', bottom: '15%', top: '22%' },
      xAxis: { type: 'category', data: ['Total Energy', 'Energy/Time'] },
      yAxis: { type: 'value', name: 'Energy (mWh)' },
      series: [{
        type: 'bar',
        data: [energyDisplay, energyPerTime],
        itemStyle: { color: COLORS.warning },
        label: { show: true, position: 'top', formatter: (params) => formatNumber(params.value) }
      }]
    },
    {
      title: { text: 'Degree of Imbalance', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)}`
      },
      grid: { left: '18%', right: '12%', bottom: '15%', top: '22%' },
      xAxis: { type: 'category', data: ['Degree of Imbalance'] },
      yAxis: { type: 'value', name: 'Value' },
      series: [{
        type: 'bar',
        data: [degreeOfImbalance],
        itemStyle: { color: COLORS.danger },
        label: { show: true, position: 'top', formatter: (params) => formatNumber(params.value) }
      }]
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

  return {
    title: {
      text: `${algorithmName} - VM Resource Utilization`,
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
      max: 100,
      axisLabel: { formatter: '{value}%' }
    },
    series: [
      {
        name: 'CPU',
        type: 'bar',
        data: cpuUtil,
        itemStyle: { color: COLORS.primary }
      },
      {
        name: 'RAM',
        type: 'bar',
        data: ramUtil,
        itemStyle: { color: COLORS.warning }
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
      title: { text: 'Energy Consumption', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { trigger: 'axis', formatter: (params) => `${params[0].name}: ${formatNumber(params[0].value)} mWh` },
      grid: { left: '18%', right: '12%', bottom: '15%', top: '22%' },
      xAxis: { type: 'category', data: ['Total', 'Per Second'] },
      yAxis: { type: 'value', name: 'Energy (mWh)' },
      series: [{
        type: 'bar',
        data: [energyData1000, energyPerSecond],
        itemStyle: { color: COLORS.warning },
        label: { 
          show: true, 
          position: 'top', 
          formatter: (params) => `${formatNumber(params.value)} mWh`,
          fontSize: 9,
          fontWeight: 'bold'
        }
      }]
    },
    {
      title: { text: 'Energy Efficiency', left: 'center', textStyle: { fontSize: 12, fontWeight: 'bold' } },
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => {
          const item = params[0];
          const unit = item.dataIndex === 0 ? ' tasks/Wh' : ' mWh/task';
          return `${item.name}: ${formatNumber(item.value)}${unit}`;
        }
      },
      grid: { left: '18%', right: '12%', bottom: '15%', top: '22%' },
      xAxis: { type: 'category', data: ['Tasks/Wh', 'mWh/Task'] },
      yAxis: { type: 'value', name: 'Efficiency' },
      series: [{
        type: 'bar',
        data: [tasksPerWh, mWhPerTask],
        itemStyle: { color: COLORS.success },
        label: { 
          show: true, 
          position: 'top', 
          formatter: (params) => {
            if (params.dataIndex === 0) return `${formatNumber(params.value)} tasks/Wh`;
            return `${formatNumber(params.value)} mWh/task`;
          },
          fontSize: 9,
          fontWeight: 'bold'
        }
      }]
    }
  ];
};

export const transformRadarChart = (summary, algorithmName) => {
  if (!summary) return null;

  const makespan = summary.makespan || 0;
  const avgResponseTime = summary.responseTime || summary.avgResponseTime || 0;
  const resourceUtilization = summary.resourceUtilization || 0;
  const energyConsumption = summary.energyConsumption || 0;
  const degreeOfImbalance = summary.loadImbalance || 0;

  const values = [
    makespan,
    avgResponseTime,
    resourceUtilization,
    energyConsumption,
    degreeOfImbalance
  ];

  const maxMakespan = Math.max(makespan * 1.2, 100);
  const maxResponseTime = Math.max(avgResponseTime * 1.2, 100);
  const maxEnergy = Math.max(energyConsumption * 1.2, 10);
  const maxImbalance = Math.max(degreeOfImbalance * 1.2, 10);

  return {
    title: {
      text: `${algorithmName} - Performance Radar`,
      left: 'center',
      top: '5%',
      textStyle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (!params.value || !Array.isArray(params.value)) {
          return `${algorithmName}`;
        }
        const dimensions = [
          { name: 'Makespan', unit: 's' },
          { name: 'Response Time', unit: 's' },
          { name: 'Resource Util.', unit: '%' },
          { name: 'Energy Cons.', unit: ' Wh' },
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
    radar: {
      indicator: [
        { name: 'Makespan', max: maxMakespan },
        { name: 'Response Time', max: maxResponseTime },
        { name: 'Resource Util.', max: 100 },
        { name: 'Energy Cons.', max: maxEnergy },
        { name: 'Degree of Imbalance', max: maxImbalance }
      ],
      center: ['50%', '55%'],
      radius: '60%',
      splitNumber: 4,
      name: {
        textStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          color: '#374151'
        }
      },
      splitLine: {
        lineStyle: {
          color: COLORS.neutral,
          opacity: 0.3
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(49, 150, 148, 0.05)', 'rgba(49, 150, 148, 0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: COLORS.neutral,
          opacity: 0.3
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: algorithmName,
        areaStyle: {
          color: 'rgba(49, 150, 148, 0.3)'
        },
        lineStyle: {
          color: COLORS.teal,
          width: 2.5
        },
        itemStyle: {
          color: COLORS.teal,
          borderColor: '#fff',
          borderWidth: 2
        },
        symbol: 'circle',
        symbolSize: 8
      }]
    }]
  };
};
