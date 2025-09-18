import { motion } from 'framer-motion';
import { Server, Cpu, MemoryStick, Gauge, Network, Disc, HardDrive } from 'lucide-react';

const HostCard = ({ 
  hostId, 
  numPesPerHost, 
  ramPerHost, 
  peMips, 
  bwPerHost, 
  storagePerHost, 
  vms,
  isCompact = false
}) => (
  <motion.div 
    className={`bg-gradient-to-br from-white to-[#f0fdfa] rounded-xl shadow-md border border-[#319694]/15 hover:shadow-lg transition-all duration-300 ${
      isCompact ? 'p-3' : 'p-4'
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
    }}
  >
    {/* Header */}
    <div className="flex items-center mb-2">
      <div className="p-1 bg-[#319694]/10 rounded-lg mr-2">
        <Server className="text-[#319694]" size={isCompact ? 16 : 20} />
      </div>
      <div>
        <h4 className={`font-bold text-gray-800 ${isCompact ? 'text-sm' : 'text-lg'}`}>
          Host {hostId + 1}
        </h4>
        {!isCompact && (
          <p className="text-xs text-gray-500">ID: DC-{String(hostId + 1).padStart(2, '0')}</p>
        )}
      </div>
    </div>
    
    {/* Stats Grid - Compact version */}
    {isCompact ? (
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="flex items-center text-xs text-gray-600">
          <Cpu className="text-[#319694] mr-1" size={12} />
          {numPesPerHost}PEs
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <MemoryStick className="text-[#319694] mr-1" size={12} />
          {ramPerHost}MB
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Gauge className="text-[#319694] mr-1" size={12} />
          {peMips * numPesPerHost}M
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Network className="text-[#319694] mr-1" size={12} />
          {bwPerHost}MB
        </div>
      </div>
    ) : (
      /* Full version */
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-700 mb-1">
            <Cpu className="text-[#319694] mr-1" size={14} />
            <span className="text-sm font-medium">Processing</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{numPesPerHost} <span className="text-xs font-normal text-gray-500">PEs</span></p>
        </div>
        
        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-700 mb-1">
            <MemoryStick className="text-[#319694] mr-1" size={14} />
            <span className="text-sm font-medium">Memory</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{ramPerHost} <span className="text-xs font-normal text-gray-500">MB</span></p>
        </div>
        
        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-700 mb-1">
            <Gauge className="text-[#319694] mr-1" size={14} />
            <span className="text-sm font-medium">Power</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{peMips * numPesPerHost} <span className="text-xs font-normal text-gray-500">MIPS</span></p>
        </div>
        
        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-700 mb-1">
            <Network className="text-[#319694] mr-1" size={14} />
            <span className="text-sm font-medium">Bandwidth</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{bwPerHost} <span className="text-xs font-normal text-gray-500">MBps</span></p>
        </div>
      </div>
    )}
    
    {/* Storage - Only show in full version */}
    {!isCompact && (
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-700">
            <Disc className="text-[#319694] mr-1" size={14} />
            <span className="text-sm font-medium">Storage</span>
          </div>
          <span className="text-xs px-2 py-1 bg-[#319694]/10 text-[#319694] rounded-full">
            {Math.floor(storagePerHost/1024)}GB
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-[#319694] h-1.5 rounded-full" 
            style={{ width: `${Math.min(100, storagePerHost/500)}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{storagePerHost}MB</p>
      </div>
    )}
    
    {/* Virtual Machines */}
    <div>
      <div className="flex items-center mb-2 text-gray-700">
        <HardDrive className="text-[#319694] mr-1" size={isCompact ? 14 : 16} />
        <span className={`font-semibold ${isCompact ? 'text-xs' : 'text-sm'}`}>VMs</span>
        <span className={`ml-auto bg-[#319694] text-white font-bold px-1.5 py-0.5 rounded-full ${
          isCompact ? 'text-xs' : 'text-sm'
        }`}>
          {vms.length}
        </span>
      </div>
      <div className={`grid gap-1 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {vms}
      </div>
    </div>
  </motion.div>
);

export default HostCard;