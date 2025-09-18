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
import { dataCenterHelpContent } from "./dataCenterHelpData";

const cardHover = {
  y: -2,
  boxShadow: "0 6px 16px -4px rgba(49, 150, 148, 0.15)",
  transition: { duration: 0.2, ease: "easeOut" }
};

const listItemHover = {
  backgroundColor: "#f5f9f9",
  transform: "translateX(4px)",
  transition: { duration: 0.15, ease: "easeOut" }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Helper function to get the appropriate icon component
const getIconComponent = (iconName, props = {}) => {
  const iconMap = {
    Server: <Server {...props} />,
    HardDriveUpload: <HardDriveUpload {...props} />,
    HardDriveDownload: <HardDriveDownload {...props} />,
    Columns: <Columns {...props} />,
    Settings: <Settings {...props} />,
    HardDrive: <HardDrive {...props} />,
    Cpu: <Cpu {...props} />,
    Gauge: <Gauge {...props} />,
    MemoryStick: <MemoryStick {...props} />,
    Network: <Network {...props} />,
    Disc: <Disc {...props} />,
    List: <List {...props} />,
    Database: <Database {...props} />
  };
  
  return iconMap[iconName] || <Server {...props} />; // Default to Server if icon not found
};

const DataCenterHelp = () => {
  const { title, description, icon, sections } = dataCenterHelpContent;

  return (
    <motion.section
      className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
      initial={{ y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
      whileHover={cardHover}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          {getIconComponent(icon, { className: "text-xl text-[#319694]" })}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-8">
        {/* Host Configuration */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            {getIconComponent(sections.hostConfig.icon, { className: "text-[#319694]", size: 18 })}
            {sections.hostConfig.title}
          </h4>
          <p className="text-gray-600 mb-4 text-sm">{sections.hostConfig.description}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.hostConfig.items.map((item, index) => (
              <motion.li 
                key={`host-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">
                  {getIconComponent(item.icon, { size: 18 })}
                </span>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* VM Configuration */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            {getIconComponent(sections.vmConfig.icon, { className: "text-[#319694]", size: 18 })}
            {sections.vmConfig.title}
          </h4>
          <p className="text-gray-600 mb-4 text-sm">{sections.vmConfig.description}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.vmConfig.items.map((item, index) => (
              <motion.li 
                key={`vm-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">
                  {getIconComponent(item.icon, { size: 18 })}
                </span>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Visualization */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            {getIconComponent(sections.visualization.icon, { className: "text-[#319694]", size: 18 })}
            {sections.visualization.title}
          </h4>
          <p className="text-gray-600 mb-4 text-sm">{sections.visualization.description}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.visualization.items.map((item, index) => (
              <motion.li 
                key={`vis-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">
                  {getIconComponent(item.icon, { size: 18 })}
                </span>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DataCenterHelp;