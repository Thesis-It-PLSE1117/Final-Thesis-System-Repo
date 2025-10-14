import { motion } from "framer-motion";
import {
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Database,
  Gauge,
} from "lucide-react";

const VMCard = ({
  vmId,
  vmMips,
  vmRam,
  vmSize,
  vmBw,
  vmPes,
  isCompact = false,
}) => (
  <motion.div
    className={`bg-gradient-to-br from-white to-[#f0fdfa] rounded-lg shadow-sm border border-[#319694]/10 hover:shadow-md transition-all duration-300 ${
      isCompact ? "p-2" : "p-3"
    }`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Header */}
    <div className="flex items-center mb-2 overflow-hidden">
      <div className="p-1 bg-[#319694]/10 rounded mr-1 flex-shrink-0">
        <HardDrive className="text-[#319694]" size={isCompact ? 12 : 14} />
      </div>
      <h4
        className={`font-bold text-gray-800 truncate ${isCompact ? "text-xs" : "text-sm"}`}
        title={`VM ${vmId + 1}`}
      >
        VM {vmId + 1}
      </h4>
    </div>

    {/* Stats - Compact version */}
    {isCompact ? (
      <div className="space-y-1">
        <div className="flex items-center text-xs text-gray-600 overflow-hidden">
          <Cpu className="text-[#319694] mr-1 flex-shrink-0" size={10} />
          <span className="truncate" title={`${vmPes} Processing Elements`}>
            {vmPes}PEs
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-600 overflow-hidden">
          <Gauge className="text-[#319694] mr-1 flex-shrink-0" size={10} />
          <span className="truncate" title={`${vmMips} MIPS`}>
            {vmMips}MIPS
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-600 overflow-hidden">
          <MemoryStick
            className="text-[#319694] mr-1 flex-shrink-0"
            size={10}
          />
          <span className="truncate" title={`${vmRam} MB RAM`}>
            {vmRam}MB
          </span>
        </div>
      </div>
    ) : (
      /* Full version */
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-1 rounded border border-gray-100">
          <div className="flex items-center text-gray-700">
            <Cpu className="text-[#319694] mr-1" size={12} />
            <span className="text-xs">PEs</span>
          </div>
          <p
            className="text-sm font-bold text-gray-800 truncate"
            title={`${vmPes} PEs`}
          >
            {vmPes}
          </p>
        </div>

        <div className="bg-white p-1 rounded border border-gray-100">
          <div className="flex items-center text-gray-700">
            <Gauge className="text-[#319694] mr-1" size={12} />
            <span className="text-xs">MIPS</span>
          </div>
          <p
            className="text-sm font-bold text-gray-800 truncate"
            title={`${vmMips} MIPS`}
          >
            {vmMips}
          </p>
        </div>

        <div className="bg-white p-1 rounded border border-gray-100">
          <div className="flex items-center text-gray-700">
            <MemoryStick className="text-[#319694] mr-1" size={12} />
            <span className="text-xs">RAM</span>
          </div>
          <p
            className="text-sm font-bold text-gray-800 truncate"
            title={`${vmRam} MB`}
          >
            {vmRam}
          </p>
        </div>

        <div className="bg-white p-1 rounded border border-gray-100">
          <div className="flex items-center text-gray-700">
            <Network className="text-[#319694] mr-1" size={12} />
            <span className="text-xs">BW</span>
          </div>
          <p
            className="text-sm font-bold text-gray-800 truncate"
            title={`${vmBw} MBps`}
          >
            {vmBw}
          </p>
        </div>

        <div className="bg-white p-1 rounded border border-gray-100 col-span-2">
          <div className="flex items-center text-gray-700">
            <Database className="text-[#319694] mr-1" size={12} />
            <span className="text-xs">Size</span>
          </div>
          <p
            className="text-sm font-bold text-gray-800 truncate"
            title={`${vmSize} MB`}
          >
            {vmSize}MB
          </p>
        </div>
      </div>
    )}
  </motion.div>
);

export default VMCard;
