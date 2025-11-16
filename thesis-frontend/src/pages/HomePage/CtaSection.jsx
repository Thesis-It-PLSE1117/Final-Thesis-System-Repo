import { motion } from "framer-motion";
import { PlayIcon} from "lucide-react";

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
          Discover Which Algorithm Schedules Faster
        </motion.h3>
        <motion.p
          className="text-lg md:text-xl text-white mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          Compare EACO vs. EPSO on simulated cloud infrastructure. Get performance insights backed by real simulation data.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={onStartSimulation}
            className="flex items-center justify-center gap-3 bg-white text-[#267b79] border-2 border-white/80 px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-2xl hover:bg-white/95 hover:border-white transition-all mx-auto"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 22px 45px -12px rgba(15, 23, 42, 0.45)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Start Simulation Now</span>
            <PlayIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;
