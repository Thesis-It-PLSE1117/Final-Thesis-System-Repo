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
        The simulation supports two CSV schemas from the manuscript specification. Each schema addresses different workload data sources with specific preprocessing requirements:
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
          <p className="text-gray-600 mb-4 text-sm">Choose the appropriate schema based on your data source and preprocessing needs</p>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              {
                icon: "Columns",
                text: "Normalized Schema: length (MI), pes (integer), file_size (0-1), output_size (0-1)",
                note: "Ideal for custom datasets or academic benchmarks"
              },
              {
                icon: "Database",
                text: "Google Cluster Schema: arrival_ts (μs), cpu_request (0.0-1.0), memory_request (0.0-1.0), pes_number (integer)",
                note: "Based on Google Cluster Traces dataset format with time-based submission"
              },
              {
                icon: "Clock",
                text: "arrival_ts: Task arrival timestamp normalized using t := (arrival_ts - min(arrival_ts)) / 1e6",
                note: "Timestamp conversion from microseconds to seconds"
              },
              {
                icon: "Gauge",
                text: "Resource fractions: CPU and memory requests as fractions (0.0-1.0) of total host capacity",
                note: "Normalized resource demand representation"
              },
              {
                icon: "HardDrive",
                text: "File sizes: Input/output data sizes normalized to 0-1 range, scaled to bytes during simulation",
                note: "Consistent data size representation across schemas"
              },
              {
                icon: "Settings",
                text: "time_window (optional): Combined with cpu_request to derive computational MI for Google schema",
                note: "Enhanced computational workload calculation"
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
                text: "Batch (default): All tasks submitted at t=0 for controlled algorithm comparison",
                note: "Ensures fair comparison between scheduling algorithms"
              },
              {
                icon: "CalendarClock",
                text: "Staged (optional): Tasks submitted according to normalized arrival times from arrival_ts",
                note: "Simulates real-world temporal workload patterns"
              },
              {
                icon: "Filter",
                text: "Missing arrival_ts handling: Tasks with missing timestamps default to t=0 (batch mode)",
                note: "Automatic fallback for incomplete temporal data"
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
                text: "Ensure it includes task time, CPU request, and duration data",
                details: "arrival_ts (microseconds), cpu_request (0.0-1.0), memory_request (0.0-1.0), pes_number (integer)"
              },
              {
                icon: "Columns",
                text: "Rename columns to match the required format",
                details: "Map your column names to schema requirements: timestamp → arrival_ts, cpu_usage → cpu_request"
              },
              {
                icon: "Filter",
                text: "Handle missing values appropriately",
                details: "Fill with reasonable defaults, remove incomplete rows, or use batch mode for missing timestamps"
              },
              {
                icon: "Save",
                text: "Save as a CSV with the correct structure",
                details: "Normalize values to proper ranges, ensure correct data types, save as UTF-8 encoded CSV"
              },
              {
                icon: "Gauge",
                text: "Validate resource fractions are between 0.0-1.0",
                details: "CPU and memory requests must represent fractions of total host capacity"
              },
              {
                icon: "HardDrive",
                text: "Normalize file sizes to 0-1 range",
                details: "Input and output file sizes should be normalized fractions, scaled during simulation"
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