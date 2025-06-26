import { motion } from 'framer-motion';
import { Layers, Sliders } from 'lucide-react';
import { itemVariants, inputVariants } from './workloadModels/workloadModelConstants';
import GoogleLikeModel from './workloadModels/GoogleLikeModel';
import BurstyModel from './workloadModels/BurstyModel';
import PeriodicModel from './workloadModels/PeriodicModel';

const WorkloadModelSelector = ({ modelType, onChange }) => {
  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-[#319694]/10 mt-6"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={{ 
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.1)",
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <Layers className="text-[#319694]" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
          Workload & Traffic Model
        </h3>
      </div>

      <motion.div variants={itemVariants} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Sliders size={18} className="text-[#319694]" />
          Model Type
        </label>
        <motion.select
          value={modelType}
          onChange={e => onChange('modelType', e.target.value)}
          className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all appearance-none bg-white"
          whileFocus="focus"
          variants={inputVariants}
        >
          <option value="google-like">Google-like</option>
          <option value="bursty">Bursty</option>
          <option value="periodic">Periodic</option>
        </motion.select>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {modelType === 'google-like' && <GoogleLikeModel onChange={onChange} />}
        {modelType === 'bursty' && <BurstyModel onChange={onChange} />}
        {modelType === 'periodic' && <PeriodicModel onChange={onChange} />}
      </motion.div>
    </motion.div>
  );
};

export default WorkloadModelSelector;