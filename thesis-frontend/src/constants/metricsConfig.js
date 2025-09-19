import { BarChart2, Clock, Battery, Calendar, Scale, Zap, Gauge, Server, BarChart3, TrendingUp } from 'lucide-react';

export const METRICS_CONFIG = {
  'Resource Utilization': {
    description: 'Measures how effectively your server resources (CPU, memory, storage) are being used across all hosts',
    icon: BarChart2,
    demoKey: 'resourceUtilization',
    unit: '%',
    category: 'core'
  },
  'Response Time': {
    description: 'Average time taken to complete tasks from submission to final response',
    icon: Clock,
    demoKey: 'responseTime',
    unit: 'ms',
    category: 'core'
  },
  'Energy Efficiency': {
    description: 'Evaluates power consumption relative to computational work performed',
    icon: Battery,
    demoKey: 'energyConsumption',
    unit: '',
    category: 'core'
  },
  'Makespan': {
    description: 'Total time taken to complete all tasks in the workload',
    icon: Calendar,
    demoKey: 'makespan',
    unit: 's',
    category: 'additional'
  },
  'Imbalance Degree': {
    description: 'Quantifies how unevenly the workload is distributed across available hosts',
    icon: Scale,
    demoKey: 'loadBalance',
    unit: '',
    category: 'additional'
  }
};

export const getMetricsByCategory = (category) => {
  return Object.entries(METRICS_CONFIG)
    .filter(([_, config]) => config.category === category)
    .map(([label, config]) => ({
      label,
      icon: config.icon,
      description: config.description
    }));
};

export const getCoreMetrics = () => getMetricsByCategory('core');
export const getAdditionalMetrics = () => getMetricsByCategory('additional');
export const getAllMetrics = () => [...getCoreMetrics(), ...getAdditionalMetrics()];

export const formatMetricValue = (metricKey, value) => {
  const metricConfig = Object.values(METRICS_CONFIG).find(config => config.demoKey === metricKey);
  if (!metricConfig) return value;
  
  switch (metricKey) {
    case 'makespan': return `${value.toFixed(1)}s`;
    case 'energyConsumption': return value.toFixed(3);
    case 'responseTime': return `${value.toFixed(1)}ms`;
    case 'resourceUtilization': return `${value.toFixed(1)}%`;
    case 'loadBalance': return value.toFixed(3);
    default: return value;
  }
};

export const getMetricIcon = (metricKey) => {
  const icons = {
    makespan: Clock,
    energyConsumption: Zap,
    responseTime: Gauge,
    resourceUtilization: Server,
    loadBalance: BarChart3
  };
  const IconComponent = icons[metricKey] || TrendingUp;
  return IconComponent;
};

export const getMetricDisplayName = (metricKey) => {
  const names = {
    makespan: "Makespan",
    energyConsumption: "Energy",
    responseTime: "Response Time",
    resourceUtilization: "Utilization",
    loadBalance: "Load Balance"
  };
  return names[metricKey] || metricKey;
};

export const RESEARCH_STATISTICS = {
  metricsCompared: 5,
  simulationsTested: "5K+",
  testRuns: 30,
  statisticalConfidence: "95%",
  significanceLevel: "p < 0.05"
};