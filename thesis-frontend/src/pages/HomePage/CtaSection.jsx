import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const CtaSection = ({ onStartSimulation }) => {
  return (
    <motion.section
      className="px-6 py-20 bg-gradient-to-br from-[#319694] to-[#4fd1c5] text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h3
          className="text-3xl md:text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Ready to Compare Load Balancing Algorithms?
        </motion.h3>
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          Start simulating EACO vs EPSO algorithms and discover the optimal task scheduling strategy for your cloud infrastructure.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={onStartSimulation}
            className="bg-white text-[#267b79] px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all flex items-center gap-3 mx-auto"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(255, 255, 255, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Launch Simulation <Zap className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;