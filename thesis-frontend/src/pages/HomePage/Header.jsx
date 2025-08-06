import { motion } from 'framer-motion';
import { Cloud, ArrowRight, Settings } from 'lucide-react';

const Header = ({ onStartSimulation }) => {
  return (
    <motion.header
      className="bg-[#267b79] h-24 w-full flex items-center justify-between px-8 shadow-lg sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'tween', duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center space-x-4"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Cloud className="text-white w-9 h-9" />
        </motion.div>
        <h1 className="text-white text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a8f0eb]">
          Cloud Load Balancer Simulator
        </h1>
      </motion.div>

      <div className="flex items-center gap-6">
        <motion.button
          onClick={() => document.getElementById('walkthrough').scrollIntoView({ behavior: 'smooth' })}
          className="hidden md:flex items-center gap-2 text-white hover:text-white transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
        >
          <Settings className="w-5 h-5" />
          <span>How It Works</span>
        </motion.button>
        
        <motion.button
          onClick={onStartSimulation}
          className="hidden md:flex items-center gap-3 bg-white px-6 py-3 rounded-full text-[#1a5654] hover:bg-gray-100 transition-all border border-white/30 font-semibold shadow-lg"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 5px 15px -3px rgba(255, 255, 255, 0.2)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Start Simulation</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;