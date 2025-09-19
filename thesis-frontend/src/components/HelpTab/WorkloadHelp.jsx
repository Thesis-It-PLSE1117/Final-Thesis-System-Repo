import { motion } from "framer-motion";
import { 
  Columns,
  Binary,
  ListOrdered,
  CalendarClock,
  ClipboardCheck,
  Cpu,
  Disc,
  HardDrive,
  Clock,
  Settings,
  FileText,
  Database,
  Filter,
  GitMerge,
  Clipboard,
  List,
  Save,
  Download,
  Server,
  CheckCircle,
  Gauge
} from "lucide-react";

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

const WorkloadHelp = () => {
  return (
    <motion.section
      className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
      initial={{ y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
      whileHover={cardHover}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <Columns className="text-xl text-[#319694]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Workload Configuration</h3>
      </div>
      <p className="text-gray-600 mb-6">
        This system processes task workloads to simulate cloud scheduling scenarios. You can upload your own CSV file or select from pre-configured Google cluster datasets. The system automatically recognizes the data format and converts it appropriately - no manual configuration needed.
      </p>
      
      <div className="space-y-8">
        {/* Schema Configuration */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Database className="text-[#319694]" size={18} />
            Supported CSV Schemas
          </h4>
          <p className="text-gray-600 mb-4 text-sm">The system automatically recognizes these common data formats - no manual configuration needed</p>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              {
                icon: "Columns",
                text: "Simple Format: Contains task length (Million Instructions), CPU cores needed, and data file sizes",
                note: "Perfect for custom workloads - system expects: length, pes, file_size, output_size"
              },
              {
                icon: "Database",
                text: "Google Cluster Format: Real datacenter traces with arrival times and resource requests",
                note: "Uses actual Google usage patterns - system detects: arrival_ts, cpu_request, pes_number columns"
              },
              {
                icon: "Clock",
                text: "Arrival Times: When each task starts (converted from microseconds to simulation seconds)",
                note: "Enables realistic temporal patterns - system normalizes timestamps automatically"
              },
              {
                icon: "Gauge",
                text: "Resource Requests: CPU and memory needs as fractions (0.0 to 1.0 of server capacity)",
                note: "System scales these values to actual resource allocations during simulation"
              },
              {
                icon: "HardDrive",
                text: "Data Sizes: Input and output file sizes (normalized 0-1 values scaled to bytes)",
                note: "System converts small decimal values to realistic byte amounts (up to 1GB max)"
              },
              {
                icon: "Settings",
                text: "Processing Work: Task complexity calculated from CPU request and optional time window",
                note: "System computes Million Instructions automatically based on resource demands"
              }
            ].map((item, index) => {
              const IconComponent = {
                Columns: <Columns size={18} />,
                Database: <Database size={18} />,
                Clock: <Clock size={18} />,
                Gauge: <Gauge size={18} />,
                HardDrive: <HardDrive size={18} />,
                Settings: <Settings size={18} />
              }[item.icon] || <Columns size={18} />;
              
              return (
                <motion.li 
                  key={`schema-${index}`}
                  className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                  initial={{ backgroundColor: "#ffffff" }}
                  whileHover={listItemHover}
                >
                  <span className="text-[#319694] mt-0.5">
                    {IconComponent}
                  </span>
                  <div>
                    <span className="text-gray-700 text-sm block">{item.text}</span>
                    <span className="text-xs text-gray-500 mt-1 block italic">{item.note}</span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* Submission Modes */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Settings className="text-[#319694]" size={18} />
            Task Submission Modes
          </h4>
          <p className="text-gray-600 mb-4 text-sm">Control how tasks are submitted to the simulation environment</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: "List",
                text: "Batch Mode (default): All tasks start at the same time for fair algorithm testing",
                note: "Used when no arrival times are present - ensures controlled comparison conditions"
              },
              {
                icon: "CalendarClock",
                text: "Staged Mode (automatic): Tasks arrive over time based on their timestamps",
                note: "Activated when arrival_ts column is detected - creates realistic workload patterns"
              },
              {
                icon: "Filter",
                text: "Smart Fallback: Tasks without timestamps automatically use batch mode (time=0)",
                note: "System handles mixed data gracefully - no manual configuration needed"
              }
            ].map((item, index) => {
              const IconComponent = {
                List: <List size={18} />,
                CalendarClock: <CalendarClock size={18} />,
                Filter: <Filter size={18} />
              }[item.icon] || <List size={18} />;
              
              return (
                <motion.li 
                  key={`mode-${index}`}
                  className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                  initial={{ backgroundColor: "#ffffff" }}
                  whileHover={listItemHover}
                >
                  <span className="text-[#319694] mt-0.5">
                    {IconComponent}
                  </span>
                  <div>
                    <span className="text-gray-700 text-sm block">{item.text}</span>
                    <span className="text-xs text-gray-500 mt-1 block italic">{item.note}</span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* Using Your Own Dataset */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Server className="text-[#319694]" size={18} />
            Using Your Own Dataset
          </h4>
          <p className="text-gray-600 mb-4 text-sm">Prepare your custom workload data following these essential steps</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: "CheckCircle",
                text: "Choose your data format: Simple (length, pes, file_size, output_size) or Google-style",
                details: "Simple format is easier - just specify task size, CPU cores needed, and data amounts"
              },
              {
                icon: "Columns",
                text: "Use recognizable column names - the system detects formats automatically",
                details: "Examples: 'length' or 'task_length' for work amount, 'pes' or 'pes_number' for CPU cores"
              },
              {
                icon: "Filter",
                text: "Clean up missing values or leave them blank - the system provides sensible defaults",
                details: "Missing data gets reasonable fallback values: length=1000MI, pes=1, file_size=300bytes"
              },
              {
                icon: "Save",
                text: "Save as standard CSV with headers - UTF-8 encoding recommended",
                details: "First row should contain column names, subsequent rows contain your task data"
              },
              {
                icon: "Gauge",
                text: "For resource values, use fractions (0.1 = 10%) or small decimals work best",
                details: "System automatically scales: 0.1 becomes 10% of server capacity, 0.5 becomes 50%"
              },
              {
                icon: "HardDrive",
                text: "File sizes can be small decimals (0.001 to 1.0) - system scales them to realistic bytes",
                details: "Values like 0.1 become ~100MB, 0.5 becomes ~500MB, 1.0 becomes ~1GB"
              }
            ].map((item, index) => {
              const IconComponent = {
                CheckCircle: <CheckCircle size={18} />,
                Columns: <Columns size={18} />,
                Filter: <Filter size={18} />,
                Save: <Save size={18} />,
                Gauge: <Gauge size={18} />,
                HardDrive: <HardDrive size={18} />
              }[item.icon] || <CheckCircle size={18} />;
              
              return (
                <motion.li 
                  key={`dataset-${index}`}
                  className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
                  initial={{ backgroundColor: "#ffffff" }}
                  whileHover={listItemHover}
                >
                  <span className="text-[#319694] mt-0.5">
                    {IconComponent}
                  </span>
                  <div>
                    <span className="text-gray-700 text-sm block">{item.text}</span>
                    <span className="text-xs text-gray-500 mt-1 block italic">{item.details}</span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WorkloadHelp;