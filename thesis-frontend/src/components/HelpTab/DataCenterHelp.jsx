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
        Configure your virtual data center environment with hosts and virtual machines. These settings determine the computing resources available for your cloud simulation.
      </p>
      
      <div className="space-y-6">
        {/* Host Configuration */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <HardDriveUpload className="text-[#319694]" size={18} />
            Host Configuration
          </h4>
          <p className="text-gray-600 mb-3 text-sm">
            Hosts represent the physical servers in your data center that will run virtual machines.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { 
                icon: <Server className="text-[#319694]" size={18} />, 
                text: "Number of Hosts: Defines how many physical servers are available in your data center" 
              },
              { 
                icon: <Cpu className="text-[#319694]" size={18} />, 
                text: "PEs per Host: Specifies the number of Processing Elements (CPU cores) available on each host" 
              },
              { 
                icon: <Gauge className="text-[#319694]" size={18} />, 
                text: "PE MIPS: Sets the computing power of each Processing Element in Million Instructions Per Second" 
              },
              { 
                icon: <MemoryStick className="text-[#319694]" size={18} />, 
                text: "RAM per Host: Allocates memory (in MB) available on each physical host" 
              },
              { 
                icon: <Network className="text-[#319694]" size={18} />, 
                text: "Bandwidth per Host: Defines the network bandwidth capacity (in MBps) for each host" 
              },
              { 
                icon: <Disc className="text-[#319694]" size={18} />, 
                text: "Storage per Host: Sets the storage capacity (in MB) available on each host" 
              }
            ].map((item, index) => (
              <motion.li 
                key={`host-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span className="text-gray-700 text-sm">{item.text}</span>
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
          <p className="text-gray-600 mb-3 text-sm">
            Virtual Machines are the virtualized computing instances that will be deployed on your physical hosts.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { 
                icon: <HardDrive className="text-[#319694]" size={18} />, 
                text: "Number of VMs: Determines how many virtual machines will be created and deployed across hosts" 
              },
              { 
                icon: <Gauge className="text-[#319694]" size={18} />, 
                text: "VM MIPS: Sets the computing power (in MIPS) that each virtual machine can utilize" 
              },
              { 
                icon: <Cpu className="text-[#319694]" size={18} />, 
                text: "VM PEs: Defines the number of virtual Processing Elements (vCPUs) allocated to each VM" 
              },
              { 
                icon: <MemoryStick className="text-[#319694]" size={18} />, 
                text: "VM RAM: Allocates memory (in MB) available to each virtual machine" 
              },
              { 
                icon: <Network className="text-[#319694]" size={18} />, 
                text: "VM Bandwidth: Sets the network bandwidth (in MBps) allocated to each virtual machine" 
              },
              { 
                icon: <Database className="text-[#319694]" size={18} />, 
                text: "VM Size: Defines the storage space (in MB) allocated to each virtual machine" 
              }
            ].map((item, index) => (
              <motion.li 
                key={`vm-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span className="text-gray-700 text-sm">{item.text}</span>
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
          <p className="text-gray-600 mb-3 text-sm">
            The interface provides visual feedback to help you understand resource allocation and distribution.
          </p>
          <ul className="space-y-3">
            {[
              { 
                icon: <Server className="text-[#319694]" size={18} />, 
                text: "Host cards display resource utilization metrics and show which VMs are running on each host" 
              },
              { 
                icon: <HardDrive className="text-[#319694]" size={18} />, 
                text: "VM cards show detailed configuration and current status of each virtual machine" 
              },
              { 
                icon: <List className="text-[#319694]" size={18} />, 
                text: "Click on any VM in the distribution view to see its detailed specifications and resource usage" 
              },
              { 
                icon: <Settings className="text-[#319694]" size={18} />, 
                text: "All sections can be collapsed or expanded to customize your view and focus on relevant information" 
              }
            ].map((item, index) => (
              <motion.li 
                key={`vis-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default DataCenterHelp;