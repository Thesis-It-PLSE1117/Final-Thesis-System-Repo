import React from "react";
import { motion } from "framer-motion";
import {
  Play,
  Settings,
  ChevronDown,
  Server,
  Cpu,
  Zap,
  Clock,
  Scale,
  Layers,
  TrendingUp,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { RESEARCH_STATISTICS } from "../../constants/metricsConfig.js";
import {
  SPACING_SCALE,
  TYPOGRAPHY_SCALE,
  COLOR_SYSTEM,
  ANIMATION_TIMING,
  SHADOW_SCALE,
  BORDER_RADIUS,
  INTERACTION_STATES,
  VIEWPORT_CONFIG,
  ICON_SIZES,
} from "../../constants/designSystem.js";

const Particle = ({ x, y, size, delay }) => {
  return (
    <motion.div
      className="absolute bg-[#008081] rounded-full"
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
        ease: "easeOut",
      }}
    />
  );
};

const StatHighlight = ({ value, label, trend, isPositive = true }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm ${BORDER_RADIUS.default} ${SPACING_SCALE.padding.sm} ${SHADOW_SCALE.medium} border-2 border-[#4fd1c5]/60`}
    >
      <div
        className={`text-xl ${TYPOGRAPHY_SCALE.weights.bold} ${COLOR_SYSTEM.text.secondary} mb-0.5`}
      >
        {value}
      </div>
      <div
        className={`text-sm ${TYPOGRAPHY_SCALE.weights.medium} ${COLOR_SYSTEM.text.muted}`}
      >
        {label}
      </div>
      {trend && (
        <div
          className={`text-sm ${isPositive ? "text-green-600" : "text-amber-600"} ${TYPOGRAPHY_SCALE.weights.medium} mt-0.5`}
        >
          {trend}
        </div>
      )}
    </div>
  );
};

const HeroSection = ({ onStartSimulation, onViewDocs }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80 + 20,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.main
      className={`flex-grow flex flex-col justify-center items-center ${SPACING_SCALE.section.horizontal} ${SPACING_SCALE.section.vertical} relative overflow-hidden ${COLOR_SYSTEM.backgrounds.gradient.hero}`}
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
        className="absolute top-1/4 left-1/6 text-[#4dd0e2]/10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Server size={100} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/6 text-[#80deea]/10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Cpu size={110} />
      </motion.div>

      <div className="max-w-7xl relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left side - Content */}
        <div className="flex-1 text-center">

        <motion.h1
          className={`text-4xl md:text-5xl font-bold leading-tight ${COLOR_SYSTEM.text.dark} ${SPACING_SCALE.margin.md}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: ANIMATION_TIMING.delays.long,
            duration: ANIMATION_TIMING.durations.slow / 1000,
          }}
        >
          <span className="bg-clip-text text-transparent uppercase bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
               cloud load balancing  
          </span>
          <br />

           <span className="bg-clip-text text-transparent uppercase bg-gradient-to-r from-[#111818] to-[#3a6460]">
               Simulation Platform  
          </span>
          <br />
          <span className={`text-2xl md:text-3xl ${COLOR_SYSTEM.text.body}`}>
            EACO vs EPSO Performance Analysis
          </span>
        </motion.h1>

        <motion.p
          className={`text-base md:text-lg ${COLOR_SYSTEM.text.body} ${SPACING_SCALE.margin.md} max-w-4xl mx-auto`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: ANIMATION_TIMING.delays.extraLong,
            duration: ANIMATION_TIMING.durations.slow / 1000,
          }}
        >
          <span className="font-semibold text-[#008081]">
            Which algorithm schedules virtual machine tasks faster?{" "}
          </span>
          Compare performance backed by real cloud data.
        </motion.p>

        <motion.div
          className={`flex flex-col sm:flex-row ${SPACING_SCALE.gap.md} justify-center mb-12`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay:
              ANIMATION_TIMING.delays.extraLong +
              ANIMATION_TIMING.delays.medium,
          }}
        >
          <motion.button
            onClick={onStartSimulation}
            className={`flex items-center justify-center ${SPACING_SCALE.gap.sm} ${COLOR_SYSTEM.backgrounds.gradient.primary} ${COLOR_SYSTEM.text.white} ${SPACING_SCALE.padding.button.md} ${BORDER_RADIUS.default} text-base ${TYPOGRAPHY_SCALE.weights.medium} ${SHADOW_SCALE.large} ${SHADOW_SCALE.hover.xl} transition-all`}
            whileHover={{
              ...INTERACTION_STATES.scale.hover,
              boxShadow: INTERACTION_STATES.boxShadow.primary,
            }}
            whileTap={INTERACTION_STATES.scale.tap}
          >
            <span>Start Simulation</span>
            <Play size={ICON_SIZES.sm} />
          </motion.button>

          <motion.button
            onClick={onViewDocs}
            className={`flex items-center justify-center ${SPACING_SCALE.gap.sm} ${COLOR_SYSTEM.backgrounds.solid.white} ${COLOR_SYSTEM.text.primary} ${SPACING_SCALE.padding.button.md} ${BORDER_RADIUS.default} text-base ${TYPOGRAPHY_SCALE.weights.medium} ${SHADOW_SCALE.large} ${SHADOW_SCALE.hover.xl} transition-all ${COLOR_SYSTEM.borders.primaryStrong}`}
            whileHover={{
              ...INTERACTION_STATES.scale.hover,
              boxShadow: INTERACTION_STATES.boxShadow.secondary,
            }}
            whileTap={INTERACTION_STATES.scale.tap}
          >
            <span>View User Docs </span>
            <Settings size={ICON_SIZES.sm} />
          </motion.button>
        </motion.div>
        </div>

        <div className="flex-1 flex flex-col justify-center lg:justify-end items-center lg:items-end gap-4">
          <motion.div
            className="flex flex-col sm:flex-row gap-2 w-full max-w-lg lg:max-w-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ANIMATION_TIMING.delays.long }}
          >
            <motion.div
              className={`${SPACING_SCALE.padding.button.sm} bg-gradient-to-r from-[#b2ebf2]/20 to-[#80deea]/20 ${BORDER_RADIUS.default} ${COLOR_SYSTEM.text.secondary} ${TYPOGRAPHY_SCALE.weights.medium} text-sm inline-flex border-2 items-center gap-1.5 ${COLOR_SYSTEM.borders.primary} ${SHADOW_SCALE.medium}`}
              whileHover={INTERACTION_STATES.scale.subtle}
            >
              <Award size={ICON_SIZES.xs} className="animate-pulse" />
              For Cloud Load Balancing Algorithm Comparison
            </motion.div>
            <motion.div
              className={`${SPACING_SCALE.padding.button.sm} bg-gradient-to-r border-2 from-[#b2ebf2]/20 to-[#80deea]/20 ${BORDER_RADIUS.default} ${COLOR_SYSTEM.text.secondary} ${TYPOGRAPHY_SCALE.weights.medium} text-sm inline-flex items-center gap-1.5 ${COLOR_SYSTEM.borders.primary} ${SHADOW_SCALE.medium}`}
              whileHover={INTERACTION_STATES.scale.subtle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: ANIMATION_TIMING.delays.long }}
            >
              <Server size={ICON_SIZES.xs} className="animate-pulse" />
              Powered by CloudSim
            </motion.div>
          </motion.div>

          <div className="relative overflow-visible">
    <motion.div
      className="relative overflow-hidden bg-transparent "
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        delay: ANIMATION_TIMING.delays.extraLong,
        duration: ANIMATION_TIMING.durations.slow / 1000,
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <img
        src="/heroassets/heropics.png"
        alt="Cloud Load Balancing Simulation Hero"
        className="w-full max-w-lg lg:max-w-2xl h-auto object-cover cursor-pointer"
        style={{ mixBlendMode: 'multiply' }}
      />

      <div
        className="absolute top-0 left-0 w-32 h-32 opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(79, 209, 197, 0.8) 0%, rgba(73, 176, 169, 0.4) 50%, transparent 70%)',
          filter: 'blur(20px)',
          borderRadius: '50%',
        }}
      />

      <div
        className="absolute top-1/3 right-0 w-40 h-40 opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(79, 209, 197, 0.7) 0%, rgba(73, 176, 169, 0.3) 50%, transparent 70%)',
          filter: 'blur(25px)',
          borderRadius: '50%',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-36 h-36 opacity-55"
        style={{
          background: 'radial-gradient(circle, rgba(79, 209, 197, 0.75) 0%, rgba(73, 176, 169, 0.35) 50%, transparent 70%)',
          filter: 'blur(22px)',
          borderRadius: '50%',
        }}
      />
    </motion.div>

    <motion.div
      className="absolute top-4 left-4 z-40 text-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: ANIMATION_TIMING.delays.extraLong + 0.5 }}
    >
      <StatHighlight
        value={RESEARCH_STATISTICS.metricsCompared}
        label="Metrics Compared"
      />
    </motion.div>

    <motion.div
      className="absolute top-4 right-4 z-40 text-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: ANIMATION_TIMING.delays.extraLong + 0.7 }}
    >
      <StatHighlight
        value={RESEARCH_STATISTICS.simulationsTested}
        label="Simulations Tested"
      />
    </motion.div>

    <motion.div
      className="absolute bottom-4 left-4 z-40 text-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: ANIMATION_TIMING.delays.extraLong + 0.9 }}
    >
      <StatHighlight
        value={RESEARCH_STATISTICS.testRuns}
        label="Test Runs"
      />
    </motion.div>

    <motion.div
      className="absolute bottom-4 right-4 z-40 text-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: ANIMATION_TIMING.delays.extraLong + 1.1 }}
    >
      <StatHighlight
        value={RESEARCH_STATISTICS.statisticalConfidence}
        label="Statistical Confidence"
      />
    </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default HeroSection;
