import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, ChevronDown, Server, Cpu, Zap, Clock, Scale, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

const Particle = ({ x, y, size, delay }) => {
  return (
    <motion.div
      className="absolute bg-[#319694] rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        y: [0, -100],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        ease: "easeOut"
      }}
    />
  );
};

const MetricBar = ({ value, max = 100, color }) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
      <motion.div 
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
    </div>
  );
};

const AlgorithmMetricCard = ({ algorithm, metrics, delay }) => {
  const isEACO = algorithm === "EACO";
  const accentColor = isEACO ? "from-[#319694]" : "from-[#4fd1c5]";
  const barColor = isEACO ? "bg-[#319694]" : "bg-[#4fd1c5]";
  
  return (
    <motion.div
      className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.7, duration: 0.6 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 40px -10px rgba(49, 150, 148, 0.2)"
      }}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accentColor} to-[#4fd1c5]`}></div>
      
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 rounded-lg ${isEACO ? 'bg-[#319694]/10' : 'bg-[#4fd1c5]/10'} flex items-center justify-center mr-4`}>
          {isEACO ? (
            <Cpu size={24} className="text-[#319694]" />
          ) : (
            <Zap size={24} className="text-[#4fd1c5]" />
          )}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${isEACO ? 'text-[#319694]' : 'text-[#4fd1c5]'}`}>
            {algorithm} Algorithm
          </h3>
          <p className="text-sm text-gray-500">Cloud Load Balancing</p>
        </div>
      </div>
      
      <div className="space-y-5">
        {metrics.map((metric, index) => (
          <div key={index} className="relative">
            <div className="flex items-start">
              <div className={`mr-3 mt-0.5 p-2 rounded-lg ${isEACO ? 'bg-[#319694]/10' : 'bg-[#4fd1c5]/10'}`}>
                {React.cloneElement(metric.icon, { 
                  size: 18, 
                  className: isEACO ? 'text-[#319694]' : 'text-[#4fd1c5]' 
                })}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-800">{metric.value}</span>
                  {metric.label === "Load Imbalance Factor" && (
                    <span className="text-xs text-gray-500 ml-2">Lower is better</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                {metric.label !== "Load Imbalance Factor" && (
                  <MetricBar 
                    value={parseInt(metric.value.split('-')[0])} 
                    color={barColor}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${isEACO ? 'bg-[#319694]/5' : 'bg-[#4fd1c5]/5'}`}></div>
    </motion.div>
  );
};

const HeroSection = ({ onStartSimulation }) => {
  const [particles, setParticles] = useState([]);
  
  const eacoMetrics = [
    { icon: <Cpu />, value: "72-82%", label: "Resource Utilization" },
    { icon: <Clock />, value: "85-135ms", label: "Response Time" },
    { icon: <Zap />, value: "78-88%", label: "Energy Efficiency" },
    { icon: <Scale />, value: "0.15-0.25", label: "Load Imbalance Factor" },
    { icon: <Layers />, value: "220-280ms", label: "Makespan" }
  ];

  const epsoMetrics = [
    { icon: <Cpu />, value: "80-90%", label: "Resource Utilization" },
    { icon: <Clock />, value: "75-125ms", label: "Response Time" },
    { icon: <Zap />, value: "85-93%", label: "Energy Efficiency" },
    { icon: <Scale />, value: "0.10-0.20", label: "Load Imbalance Factor" },
    { icon: <Layers />, value: "200-260ms", label: "Makespan" }
  ];

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80 + 20,
      size: Math.random() * 8 + 3,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.main
      className="flex-grow flex flex-col justify-center items-center text-center px-6 pt-28 pb-16 md:pt-32 md:pb-24 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ marginTop: '-80px', paddingTop: 'calc(80px + 2rem)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </div>

      <motion.div
        className="absolute top-1/3 left-1/5 text-[#319694]/10"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Server size={160} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 right-1/5 text-[#4fd1c5]/10"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      >
        <Cpu size={180} />
      </motion.div>

      <div className="max-w-6xl relative z-10 w-full">
        <motion.div
          className="inline-block mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="px-4 py-2 bg-[#319694]/10 rounded-full text-[#319694] font-medium text-sm inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Zap size={16} className="animate-pulse" />
            Cloud Load Balancing Simulator
          </motion.div>
        </motion.div>
        
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
            Compare Load Balancing Algorithms
          </span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Performance analysis of <span className="font-semibold text-[#319694]">EACO</span> and
          <span className="font-semibold text-[#4fd1c5]"> EPSO</span> algorithms across five key cloud metrics
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={onStartSimulation}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#319694] to-[#4fd1c5] text-white px-8 py-4 rounded-xl text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Start Simulation</span>
            <Play className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => document.getElementById('walkthrough').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center justify-center gap-3 bg-white text-[#319694] px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all border border-[#319694]/20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Learn How It Works</span>
            <Settings className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <AlgorithmMetricCard 
            algorithm="EACO" 
            metrics={eacoMetrics} 
            delay={0} 
          />
          <AlgorithmMetricCard 
            algorithm="EPSO" 
            metrics={epsoMetrics} 
            delay={0.2} 
          />
        </motion.div>
        
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.button
            onClick={() => document.getElementById('walkthrough').scrollIntoView({ behavior: 'smooth' })}
            className="text-[#319694] flex flex-col items-center gap-2 mx-auto"
            whileHover={{ y: 5 }}
          >
            <span className="text-sm font-medium">See Detailed Metrics Analysis</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default HeroSection;