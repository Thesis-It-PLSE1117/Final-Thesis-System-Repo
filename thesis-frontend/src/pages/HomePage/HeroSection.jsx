import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, ChevronDown, Server, Cpu, Zap, Clock, Scale, Layers, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RESEARCH_STATISTICS } from '../../constants/metricsConfig.js';

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

const StatHighlight = ({ value, label, trend, isPositive = true }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20">
      <div className="text-2xl font-bold text-[#319694] mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {trend && (
        <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-amber-600'} font-medium mt-1`}>
          {trend}
        </div>
      )}
    </div>
  );
};

const HeroSection = ({ onStartSimulation }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80 + 20,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.main
      className="flex-grow flex flex-col justify-center items-center text-center px-6 pt-28 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
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
        className="absolute top-1/4 left-1/6 text-[#319694]/5"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 3, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Server size={120} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 right-1/6 text-[#4fd1c5]/5"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -3, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Cpu size={140} />
      </motion.div>

      <div className="max-w-7xl relative z-10 w-full">
        <motion.div
          className="inline-block mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <motion.div
              className="px-6 py-3 bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 rounded-full text-[#319694] font-medium text-sm inline-flex items-center gap-2 border border-[#319694]/20"
              whileHover={{ scale: 1.05 }}
            >
              <Award size={16} className="animate-pulse" />
              Cloud Load Balancing Algorithm Comparison
            </motion.div>
            <motion.div
              className="px-6 py-3 bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 rounded-full text-[#319694] font-medium text-sm inline-flex items-center gap-2 border border-[#319694]/20"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Server size={16} className="animate-pulse" />
              Powered by CloudSim Framework
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
            COMPARING CLOUD LOAD BALANCING ALGORITHMS
          </span>
          <br />
          <span className="text-3xl md:text-4xl text-gray-700">EACO vs EPSO Performance Analysis</span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Research-focused comparison of <span className="font-semibold text-[#319694]">Enhanced ACO vs Enhanced PSO</span> algorithms for 
          <span className="font-semibold text-[#4fd1c5]">virtual machine task scheduling</span> with statistical validation
        </motion.p>

        {/* Key Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <StatHighlight value={RESEARCH_STATISTICS.metricsCompared} label="Metrics Compared" />
          <StatHighlight value={RESEARCH_STATISTICS.simulationsTested} label="Simulations Tested" />
          <StatHighlight value={RESEARCH_STATISTICS.testRuns} label="Test Runs" />
          <StatHighlight value={RESEARCH_STATISTICS.statisticalConfidence} label="Statistical Confidence" />
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={onStartSimulation}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#319694] to-[#4fd1c5] text-white px-8 py-4 rounded-xl text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(49, 150, 148, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Start Simulation</span>
            <Play className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => document.getElementById('walkthrough').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center justify-center gap-3 bg-white text-[#267b79] px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all border-2 border-[#267b79]/20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(49, 150, 148, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Simulation Guide</span>
            <Settings className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default HeroSection;