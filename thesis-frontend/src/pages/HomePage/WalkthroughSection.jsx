import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Zap, 
  Server, 
  Cpu, 
  BarChart2, 
  ChevronDown, 
  Sparkles, 
  Info 
} from 'lucide-react';
import WalkthroughStep from './WalkthroughStep';
import { METRICS_CONFIG, getCoreMetrics, getAdditionalMetrics } from '../../constants/metricsConfig.js';

const WalkthroughSection = ({ walkthroughSteps }) => {
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  // Use shared metrics configuration
  const coreMetrics = getCoreMetrics().map(metric => ({
    ...metric,
    icon: <metric.icon size={24} />
  }));
  
  const additionalMetrics = getAdditionalMetrics().map(metric => ({
    ...metric,
    icon: <metric.icon size={24} />
  }));
  
  const displayedMetrics = showAllMetrics ? [...coreMetrics, ...additionalMetrics] : coreMetrics;

  return (
    <motion.section 
      id="walkthrough"
      className="px-6 py-20 bg-white/90 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Floating decorative elements - simplified */}
      <div className="absolute top-20 left-10 text-[#319694]/8 z-0">
        <Server size={120} />
      </div>
      
      <div className="absolute bottom-32 right-16 text-[#4fd1c5]/8 z-0">
        <Cpu size={140} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: false }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#e0f7f6] text-[#1a5654] px-4 py-2 rounded-full mb-4 text-sm font-medium shadow-inner"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Zap className="w-4 h-4" />
            <span>Simulation Workflow</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          
          <motion.h3
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
              Simulation  Guide
            </span>
          </motion.h3>
          
          <motion.p
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Configure your data center and analyze performance metrics across multiple iterations
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-[#319694] to-[#4fd1c5]">
          </div>
          
          <div className="space-y-12 pl-12">
            {walkthroughSteps.map((step, idx) => (
              <WalkthroughStep key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* Metrics Section with fixed positioning and improved styling */}
        <motion.div
          className="mt-20 p-8 bg-gradient-to-r from-[#e0f7f6] to-[#c4f1ef] rounded-2xl shadow-xl border-2 border-[#319694]/20 relative overflow-visible group"
          initial={{ y: 20, opacity: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 rounded-2xl" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20 mb-6">
            {displayedMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl border border-[#319694]/10 flex flex-col items-center text-center relative group/metric overflow-visible transition-all duration-300 hover:-translate-y-2"
                onMouseEnter={() => setHoveredMetric(metric.label)}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{ zIndex: hoveredMetric === metric.label ? 100 : 20 }}
              >
                <div className="bg-gradient-to-br from-[#f0fdfa] to-[#e0f7f6] p-4 rounded-full mb-4 text-[#319694] relative shadow-inner transition-transform duration-300 group-hover/metric:scale-110">
                  {metric.icon}
                  <div className="absolute -top-1 -right-1">
                    <Info 
                      className="w-4 h-4 text-[#319694]/80" 
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                
                <span className="text-sm font-semibold text-gray-800 group-hover/metric:text-[#319694] transition-colors duration-300">
                  {metric.label}
                </span>
                
                {/* Simplified tooltip */}
                {hoveredMetric === metric.label && (
                  <div
                    className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-72 bg-white/98 backdrop-blur-md p-4 rounded-xl shadow-2xl border-2 border-[#319694]/20 opacity-0 animate-fadeIn"
                    style={{ zIndex: 1000, animation: 'fadeIn 0.2s ease-out forwards' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#319694]/10 to-[#4fd1c5]/10 rounded-xl" />
                    
                    <div className="relative z-10">
                      <h5 className="text-sm font-bold text-[#319694] mb-2 flex items-center gap-2">
                        {metric.icon}
                        {metric.label}
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {METRICS_CONFIG[metric.label]?.description}
                      </p>
                    </div>
                    
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/98" />
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#319694]/20" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Show More/Less Button */}
          <div className="text-center mb-8">
            <motion.button
              onClick={() => setShowAllMetrics(!showAllMetrics)}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#319694] hover:bg-white transition-all shadow-sm border border-[#319694]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAllMetrics ? 'Show Less' : 'Show More Metrics'}
              <motion.div
                animate={{ rotate: showAllMetrics ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>
          </div>

          {/* Description Section */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-inner border border-[#319694]/20">
              <BarChart2 className="w-5 h-5 text-[#319694]" />
              <span className="text-sm font-semibold text-[#267b79]">Key Performance Metrics</span>
            </div>
            
            <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#319694] mb-4">
              Understanding the Metrics
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              These metrics evaluate your data center configuration's performance across multiple iterations. 
              <span className="font-semibold text-[#319694]"> Hover over each metric</span> to learn how it impacts your system's efficiency.
            </p>
          </div>

          {/* Simple decorative element */}
          <div className="absolute top-4 right-4 text-[#319694]/20">
            <Sparkles size={24} />
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default WalkthroughSection;