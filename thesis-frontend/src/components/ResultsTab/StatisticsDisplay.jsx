import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, Zap, Clock, PieChart } from 'lucide-react';

const StatisticsDisplay = ({ average, min, max, stdDev }) => {
  const formatMetricName = (metric) => {
    const nameMap = {
      makespan: 'Makespan',
      energyConsumption: 'Energy Consumption',
      loadBalance: 'Degree of Imbalance',
      loadImbalance: 'Degree of Imbalance',
      degreeOfImbalance: 'Degree of Imbalance',
      resourceUtilization: 'Resource Utilization',
      responseTime: 'Response Time',
      fitness: 'Fitness Score',
      totalCost: 'Total Cost',
      costEfficiency: 'Cost Efficiency'
    };
    return nameMap[metric] || metric;
  };

  const getMetricUnit = (metric) => {
    const unitMap = {
      makespan: 's',
      energyConsumption: 'Wh',
      loadBalance: '',
      loadImbalance: '',
      degreeOfImbalance: '',
      resourceUtilization: '%',
      responseTime: 's',
      fitness: '',
      totalCost: '$',
      costEfficiency: ''
    };
    return unitMap[metric] || '';
  };

  const getMetricIcon = (metric) => {
    // Icons will be handled by Lucide icons in the component instead of emojis
    return null;
  };

  const metrics = Object.keys(average || {});
  const keyMetrics = ['makespan', 'energyConsumption', 'resourceUtilization', 'responseTime'];
  const displayMetrics = metrics.filter(m => keyMetrics.includes(m));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-[#319694]" size={20} />
          Statistical Analysis
        </h4>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Across all iterations
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric) => {
          const unit = getMetricUnit(metric);
          const range = max[metric] - min[metric];
          const variability = stdDev[metric] / average[metric] * 100; // coefficient of variation
          
          return (
            <motion.div 
              key={metric} 
              className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h5 className="text-sm font-medium text-gray-700">
                  {formatMetricName(metric)}
                </h5>
                <div className="p-1.5 bg-[#319694]/10 rounded">
                  {metric.includes('cost') || metric.includes('Cost') ? <DollarSign className="text-[#319694]" size={16} /> :
                   metric.includes('energy') || metric.includes('Energy') ? <Zap className="text-[#319694]" size={16} /> :
                   metric.includes('time') || metric.includes('Time') || metric.includes('makespan') ? <Clock className="text-[#319694]" size={16} /> :
                   metric.includes('utilization') || metric.includes('Utilization') ? <PieChart className="text-[#319694]" size={16} /> :
                   <TrendingUp className="text-[#319694]" size={16} />}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Average</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {average[metric]?.toFixed(2)}{unit}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Range</span>
                  <span className="text-xs text-gray-600">
                    {min[metric]?.toFixed(2)} - {max[metric]?.toFixed(2)}{unit}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5 my-2">
                  <div 
                    className="bg-[#319694] h-1.5 rounded-full relative"
                    style={{ 
                      width: `${Math.min(100, (average[metric] - min[metric]) / range * 100)}%`,
                    }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#319694] rounded-full" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-gray-500">Std Dev</span>
                  <span className="text-xs text-gray-600">
                    ±{stdDev[metric]?.toFixed(3)}{unit}
                  </span>
                </div>
                
                {variability > 10 && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                    <Activity size={12} />
                    High variability ({variability.toFixed(1)}%)
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StatisticsDisplay;
