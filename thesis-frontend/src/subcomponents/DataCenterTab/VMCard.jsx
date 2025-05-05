import { motion, AnimatePresence } from 'framer-motion'; 
import { Cpu, MemoryStick, Database, Network, HardDrive, Gauge } from 'lucide-react';

const VMCard = ({ vmId, vmMips, vmRam, vmSize, vmBw, vmPes }) => (
  <motion.div 
    className="bg-[#f0fdfa] p-4 rounded-lg shadow-sm border border-[#319694]/20 hover:border-[#319694]/40 transition-colors"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center mb-2">
      <HardDrive className="text-[#319694] mr-2" size={18} />
      <h4 className="font-semibold text-gray-700">VM {vmId + 1}</h4>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center">
        <Cpu className="text-gray-500 mr-1" size={16} />
        <span className="text-sm">{vmMips} MIPS</span>
      </div>
      <div className="flex items-center">
        <MemoryStick className="text-gray-500 mr-1" size={16} />
        <span className="text-sm">{vmRam} MB</span>
      </div>
      <div className="flex items-center">
        <Database className="text-gray-500 mr-1" size={16} />
        <span className="text-sm">{vmSize} MB</span>
      </div>
      <div className="flex items-center">
        <Network className="text-gray-500 mr-1" size={16} />
        <span className="text-sm">{vmBw} MBps</span>
      </div>
      <div className="flex items-center">
        <Cpu className="text-gray-500 mr-1" size={16} />
        <span className="text-sm">{vmPes} PEs</span>
      </div>
      <div className="flex items-center">
        <Gauge className="text-gray-500 mr-1" size={16} />
        <span className="text-sm">{Math.round((vmMips * vmPes) / 1000)} GHz</span>
      </div>
    </div>
  </motion.div>
);

export default VMCard;