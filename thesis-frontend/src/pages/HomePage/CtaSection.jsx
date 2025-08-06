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
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ready to Optimize Your Cloud Performance?
        </motion.h3>
        <motion.p
          className="text-xl text-white/90 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Start simulating and discover the best load balancing strategy for your infrastructure.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={onStartSimulation}
            className="bg-white text-[#1a5654] px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2 mx-auto"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Launch Simulation <Zap className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;