import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, ChevronDown, Server, Cpu, Zap, Clock, Scale, Layers, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RESEARCH_STATISTICS } from '../../constants/metricsConfig.js';
import {
  SPACING_SCALE,
  TYPOGRAPHY_SCALE,
  COLOR_SYSTEM,
  ANIMATION_TIMING,
  SHADOW_SCALE,
  BORDER_RADIUS,
  INTERACTION_STATES,
  VIEWPORT_CONFIG
} from '../../constants/designSystem.js';

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
    <div className={`bg-white/80 backdrop-blur-sm ${BORDER_RADIUS.default} ${SPACING_SCALE.padding.md} ${SHADOW_SCALE.medium} ${COLOR_SYSTEM.borders.light}`}>
      <div className={`text-2xl ${TYPOGRAPHY_SCALE.weights.bold} ${COLOR_SYSTEM.text.secondary} mb-1`}>{value}</div>
      <div className={`text-sm ${TYPOGRAPHY_SCALE.weights.medium} ${COLOR_SYSTEM.text.muted}`}>{label}</div>
      {trend && (
        <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-amber-600'} ${TYPOGRAPHY_SCALE.weights.medium} mt-1`}>
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
      className={`flex-grow flex flex-col justify-center items-center text-center ${SPACING_SCALE.section.horizontal} ${SPACING_SCALE.section.vertical} relative overflow-hidden ${COLOR_SYSTEM.backgrounds.gradient.hero}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_TIMING.durations.slow / 1000 }}
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
          className={`inline-block ${SPACING_SCALE.margin.lg}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ANIMATION_TIMING.delays.long }}
        >
          <div className={`flex flex-col sm:flex-row ${SPACING_SCALE.gap.sm} items-center justify-center`}>
            <motion.div
              className={`${SPACING_SCALE.padding.button.md} bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 ${BORDER_RADIUS.full} ${COLOR_SYSTEM.text.secondary} ${TYPOGRAPHY_SCALE.weights.medium} text-sm inline-flex items-center gap-2 ${COLOR_SYSTEM.borders.primary}`}
              whileHover={INTERACTION_STATES.scale.hover}
            >
              <Award size={16} className="animate-pulse" />
              Cloud Load Balancing Algorithm Comparison
            </motion.div>
            <motion.div
              className={`${SPACING_SCALE.padding.button.md} bg-gradient-to-r from-[#319694]/10 to-[#4fd1c5]/10 ${BORDER_RADIUS.full} ${COLOR_SYSTEM.text.secondary} ${TYPOGRAPHY_SCALE.weights.medium} text-sm inline-flex items-center gap-2 ${COLOR_SYSTEM.borders.primary}`}
              whileHover={INTERACTION_STATES.scale.hover}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: ANIMATION_TIMING.delays.long }}
            >
              <Server size={16} className="animate-pulse" />
              Powered by CloudSim Framework
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1
          className={`${TYPOGRAPHY_SCALE.desktop.h1} ${COLOR_SYSTEM.text.dark} ${SPACING_SCALE.margin.lg}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ANIMATION_TIMING.delays.long, duration: ANIMATION_TIMING.durations.slow / 1000 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
            COMPARING CLOUD LOAD BALANCING ALGORITHMS
          </span>
          <br />
          <span className={`${TYPOGRAPHY_SCALE.desktop.h2} ${COLOR_SYSTEM.text.body}`}>EACO vs EPSO Performance Analysis</span>
        </motion.h1>
        
        <motion.p
          className={`${TYPOGRAPHY_SCALE.desktop.bodyLarge} ${COLOR_SYSTEM.text.body} ${SPACING_SCALE.margin.md} max-w-4xl mx-auto`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ANIMATION_TIMING.delays.extraLong, duration: ANIMATION_TIMING.durations.slow / 1000 }}
        >
          Research-focused comparison of <span className="font-semibold text-[#319694]">Enhanced ACO vs Enhanced PSO</span> algorithms for 
          <span className="font-semibold text-[#4fd1c5]">virtual machine task scheduling</span> with statistical validation
        </motion.p>

        {/* Key Statistics */}
        <motion.div 
          className={`grid grid-cols-2 md:grid-cols-4 ${SPACING_SCALE.gap.lg} ${SPACING_SCALE.margin.xl} max-w-4xl mx-auto`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ANIMATION_TIMING.delays.extraLong + ANIMATION_TIMING.delays.short }}
        >
          <StatHighlight value={RESEARCH_STATISTICS.metricsCompared} label="Metrics Compared" />
          <StatHighlight value={RESEARCH_STATISTICS.simulationsTested} label="Simulations Tested" />
          <StatHighlight value={RESEARCH_STATISTICS.testRuns} label="Test Runs" />
          <StatHighlight value={RESEARCH_STATISTICS.statisticalConfidence} label="Statistical Confidence" />
        </motion.div>
        
        <motion.div
          className={`flex flex-col sm:flex-row ${SPACING_SCALE.gap.lg} justify-center mb-16`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ANIMATION_TIMING.delays.extraLong + ANIMATION_TIMING.delays.medium }}
        >
          <motion.button
            onClick={onStartSimulation}
            className={`flex items-center justify-center ${SPACING_SCALE.gap.sm} ${COLOR_SYSTEM.backgrounds.gradient.primary} ${COLOR_SYSTEM.text.white} ${SPACING_SCALE.padding.button.lg} ${BORDER_RADIUS.default} text-lg ${TYPOGRAPHY_SCALE.weights.medium} ${SHADOW_SCALE.xl} ${SHADOW_SCALE.hover.xl} transition-all`}
            whileHover={{ 
              ...INTERACTION_STATES.scale.hover,
              boxShadow: INTERACTION_STATES.boxShadow.primary
            }}
            whileTap={INTERACTION_STATES.scale.tap}
          >
            <span>Start Simulation</span>
            <Play className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => document.getElementById('walkthrough').scrollIntoView({ behavior: 'smooth' })}
            className={`flex items-center justify-center ${SPACING_SCALE.gap.sm} ${COLOR_SYSTEM.backgrounds.solid.white} ${COLOR_SYSTEM.text.primary} ${SPACING_SCALE.padding.button.lg} ${BORDER_RADIUS.default} text-lg ${TYPOGRAPHY_SCALE.weights.medium} ${SHADOW_SCALE.large} ${SHADOW_SCALE.hover.xl} transition-all ${COLOR_SYSTEM.borders.primaryStrong}`}
            whileHover={{ 
              ...INTERACTION_STATES.scale.hover,
              boxShadow: INTERACTION_STATES.boxShadow.secondary
            }}
            whileTap={INTERACTION_STATES.scale.tap}
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