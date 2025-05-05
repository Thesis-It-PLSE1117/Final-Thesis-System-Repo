import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const MetricsCard = ({ icon, label, value, suffix, delay }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#e0f7f6] rounded-full">
          {icon}
        </div>
        <h5 className="font-semibold text-gray-800">{label}</h5>
      </div>
      <div className="text-3xl font-bold text-[#319694]">
        <AnimatedCounter from={0} to={value} />{suffix}
      </div>
    </motion.div>
  );
};

export default MetricsCard;