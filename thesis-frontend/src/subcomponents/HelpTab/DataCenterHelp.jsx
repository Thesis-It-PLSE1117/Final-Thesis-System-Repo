import { motion } from "framer-motion";
import { 
  Server,
  HardDriveUpload,
  HardDriveDownload,
  Columns,
  Settings,
  HardDrive,
  Cpu,
  Gauge,
  MemoryStick,
  Network,
  Disc,
  List,
  Database
} from "lucide-react";

const cardHover = {
  y: -1,
  boxShadow: "0 4px 12px -2px rgba(49, 150, 148, 0.08)",
  transition: { duration: 0.15, ease: "easeOut" }
};

const listItemHover = {
  backgroundColor: "#f8faf9",
  transition: { duration: 0.15, ease: "easeOut" }
};

const DataCenterHelp = () => {
  return (
    <motion.section
      className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
      initial={{ y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
      whileHover={cardHover}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <Server className="text-xl text-[#319694]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Data Center Configuration</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Configure your virtual data center environment with hosts and virtual machines:
      </p>
      
      <div className="space-y-6">
        {/* Host Configuration */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <HardDriveUpload className="text-[#319694]" size={18} />
            Host Configuration
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: <Server className="text-[#319694]" size={18} />, text: "Number of Hosts: Physical machines in your data center" },
              { icon: <Cpu className="text-[#319694]" size={18} />, text: "PEs per Host: Processing Elements (cores) per host" },
              { icon: <Gauge className="text-[#319694]" size={18} />, text: "PE MIPS: Million Instructions Per Second for each PE" },
              { icon: <MemoryStick className="text-[#319694]" size={18} />, text: "RAM per Host: Memory allocation per host (MB)" },
              { icon: <Network className="text-[#319694]" size={18} />, text: "Bandwidth per Host: Network bandwidth (MBps)" },
              { icon: <Disc className="text-[#319694]" size={18} />, text: "Storage per Host: Disk space allocation (MB)" }
            ].map((item, index) => (
              <motion.li 
                key={`host-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span className="text-gray-700">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* VM Configuration */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <HardDriveDownload className="text-[#319694]" size={18} />
            Virtual Machine Configuration
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: <HardDrive className="text-[#319694]" size={18} />, text: "Number of VMs: Virtual machines to deploy" },
              { icon: <Gauge className="text-[#319694]" size={18} />, text: "VM MIPS: Processing power per VM (MIPS)" },
              { icon: <Cpu className="text-[#319694]" size={18} />, text: "VM PEs: Processing Elements (cores) per VM" },
              { icon: <MemoryStick className="text-[#319694]" size={18} />, text: "VM RAM: Memory allocation per VM (MB)" },
              { icon: <Network className="text-[#319694]" size={18} />, text: "VM Bandwidth: Network bandwidth per VM (MBps)" },
              { icon: <Database className="text-[#319694]" size={18} />, text: "VM Size: Disk space allocation per VM (MB)" }
            ].map((item, index) => (
              <motion.li 
                key={`vm-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span className="text-gray-700">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Visualization */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Columns className="text-[#319694]" size={18} />
            Visualization Features
          </h4>
          <ul className="space-y-3">
            {[
              { icon: <Server className="text-[#319694]" size={18} />, text: "Host cards show resource allocation and VM distribution" },
              { icon: <HardDrive className="text-[#319694]" size={18} />, text: "VM cards display individual VM configurations" },
              { icon: <List className="text-[#319694]" size={18} />, text: "Click on VMs in the distribution view to see details" },
              { icon: <Settings className="text-[#319694]" size={18} />, text: "All sections are collapsible for better organization" }
            ].map((item, index) => (
              <motion.li 
                key={`vis-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span className="text-gray-700">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default DataCenterHelp;