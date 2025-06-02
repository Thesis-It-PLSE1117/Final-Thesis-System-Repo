import { motion } from 'framer-motion';
import { Server, Cpu, MemoryStick, Gauge, Network, Disc, HardDrive } from 'lucide-react';

const HostCard = ({ 
  hostId, 
  numPesPerHost, 
  ramPerHost, 
  peMips, 
  bwPerHost, 
  storagePerHost, 
  vms 
}) => (
  <motion.div 
    className="bg-gradient-to-br from-white to-[#f0fdfa] p-6 rounded-2xl shadow-lg border border-[#319694]/20 hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ 
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
  >
    {/* Header */}
    <div className="flex items-center mb-4">
      <div className="p-2 bg-[#319694]/10 rounded-lg mr-3">
        <Server className="text-[#319694]" size={22} />
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-xl">Host {hostId + 1}</h4>
        <p className="text-sm text-gray-500">ID: DC-{String(hostId + 1).padStart(2, '0')}</p>
      </div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center text-gray-700 mb-1">
          <Cpu className="text-[#319694] mr-2" size={16} />
          <span className="font-medium">Processing</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{numPesPerHost} <span className="text-sm font-normal text-gray-500">PEs</span></p>
      </div>
      
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center text-gray-700 mb-1">
          <MemoryStick className="text-[#319694] mr-2" size={16} />
          <span className="font-medium">Memory</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{ramPerHost} <span className="text-sm font-normal text-gray-500">MB</span></p>
      </div>
      
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center text-gray-700 mb-1">
          <Gauge className="text-[#319694] mr-2" size={16} />
          <span className="font-medium">Power</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{peMips * numPesPerHost} <span className="text-sm font-normal text-gray-500">MIPS</span></p>
      </div>
      
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center text-gray-700 mb-1">
          <Network className="text-[#319694] mr-2" size={16} />
          <span className="font-medium">Bandwidth</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{bwPerHost} <span className="text-sm font-normal text-gray-500">MBps</span></p>
      </div>
    </div>
    
    {/* Storage */}
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-gray-700">
          <Disc className="text-[#319694] mr-2" size={16} />
          <span className="font-medium">Storage</span>
        </div>
        <span className="text-xs px-2 py-1 bg-[#319694]/10 text-[#319694] rounded-full">{Math.floor(storagePerHost/1024)} GB available</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#319694] h-2 rounded-full" 
          style={{ width: `${Math.min(100, storagePerHost/500)}%` }}
        ></div>
      </div>
      <p className="text-right text-xs text-gray-500 mt-1">{storagePerHost} MB total</p>
    </div>
    
    {/* Virtual Machines */}
    <div>
      <div className="flex items-center mb-3 text-gray-700">
        <HardDrive className="text-[#319694] mr-2" size={18} />
        <span className="font-semibold">Virtual Machines</span>
        <span className="ml-auto bg-[#319694] text-white text-xs font-bold px-2 py-1 rounded-full">
          {vms.length} {vms.length === 1 ? 'VM' : 'VMs'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {vms}
      </div>
    </div>
  </motion.div>
);

export default HostCard;