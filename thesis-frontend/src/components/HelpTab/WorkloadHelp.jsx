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
  y: -1,
  boxShadow: "0 4px 12px -2px rgba(49, 150, 148, 0.08)",
  transition: { duration: 0.15, ease: "easeOut" }
};

const listItemHover = {
  backgroundColor: "#f8faf9",
  transition: { duration: 0.15, ease: "easeOut" }
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
      <p className="text-gray-600 mb-4">
        The simulation expects a CSV with these columns:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: <Binary className="text-[#319694]" size={18} />, text: "job_id: Unique job identifier" },
          { icon: <ListOrdered className="text-[#319694]" size={18} />, text: "task_index: Index of task within job" },
          { icon: <CalendarClock className="text-[#319694]" size={18} />, text: "time_seconds: Submission time (seconds)" },
          { icon: <Gauge className="text-[#319694]" size={18} />, text: "scheduling_class: Class from 0–3" },
          { icon: <ClipboardCheck className="text-[#319694]" size={18} />, text: "priority: Range 0–11" },
          { icon: <Cpu className="text-[#319694]" size={18} />, text: "cpu_request: Normalized (0–1)" },
          { icon: <Disc className="text-[#319694]" size={18} />, text: "memory_request: Normalized (0–1)" },
          { icon: <HardDrive className="text-[#319694]" size={18} />, text: "disk_space_request: Normalized (0–1)" },
          { icon: <Clock className="text-[#319694]" size={18} />, text: "duration: Task duration in seconds" }
        ].map((item, index) => (
          <motion.li 
            key={`workload-${index}`}
            className="flex items-start gap-3 text-gray-700 p-3 bg-white rounded-lg border border-[#319694]/10"
            initial={{ backgroundColor: "#ffffff" }}
            whileHover={listItemHover}
          >
            <span className="text-[#319694] mt-0.5">{item.icon}</span>
            <span className="text-gray-700">{item.text}</span>
          </motion.li>
        ))}
      </ul>

      {/* Preprocessing Steps */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="text-[#319694]" size={18} />
          Preprocessing Steps
        </h4>
        <ol className="space-y-3">
          {[
            { icon: <FileText className="text-[#319694]" size={18} />, text: "Load the raw dataset with specified column names" },
            { icon: <Database className="text-[#319694]" size={18} />, text: "Sample 10,000 rows (use random_state=42)" },
            { icon: <Clock className="text-[#319694]" size={18} />, text: "Convert time from microseconds to seconds" },
            { icon: <Filter className="text-[#319694]" size={18} />, text: "Filter submission (type 0) and finish (type 4) events" },
            { icon: <GitMerge className="text-[#319694]" size={18} />, text: "Merge them to calculate task durations" },
            { icon: <Clipboard className="text-[#319694]" size={18} />, text: "Fill missing durations with the average" },
            { icon: <Clipboard className="text-[#319694]" size={18} />, text: "Clip durations between 1 and 86,400 seconds" },
            { icon: <List className="text-[#319694]" size={18} />, text: "Attach duration to submission records" },
            { icon: <Columns className="text-[#319694]" size={18} />, text: "Drop unnecessary columns" },
            { icon: <Cpu className="text-[#319694]" size={18} />, text: "Fill missing CPU/memory/disk requests with 0" },
            { icon: <Save className="text-[#319694]" size={18} />, text: "Save the final output as a preprocessed CSV" }
          ].map((step, index) => (
            <motion.li 
              key={`step-${index}`}
              className="flex items-start gap-3 text-gray-700 p-3 rounded-lg"
              initial={{ backgroundColor: "#ffffff" }}
              whileHover={listItemHover}
            >
              <div className="flex items-center justify-center w-6 h-6 bg-[#319694]/10 text-[#319694] rounded-full mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#319694] mt-0.5">{step.icon}</span>
                <span>{step.text}</span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Bottom Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Dependencies Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
          initial={{ y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
          whileHover={cardHover}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <Download className="text-xl text-[#319694]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Dependencies</h3>
          </div>
          <p className="text-gray-600 mb-3">Ensure these libraries are installed:</p>
          <motion.div 
            className="bg-[#319694]/5 p-4 rounded-lg border border-[#319694]/10"
            initial={{ backgroundColor: "rgba(49, 150, 148, 0.05)" }}
            whileHover={listItemHover}
          >
            <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
              <code>pip install pandas numpy</code>
            </pre>
          </motion.div>
        </motion.div>

        {/* Custom Dataset Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
          initial={{ y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
          whileHover={cardHover}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <Server className="text-xl text-[#319694]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Using Your Own Dataset</h3>
          </div>
          <ul className="space-y-3">
            {[
              { icon: <CheckCircle className="text-[#319694]" size={18} />, text: "Ensure it includes task time, CPU request, and duration" },
              { icon: <CheckCircle className="text-[#319694]" size={18} />, text: "Rename columns to match the required format" },
              { icon: <CheckCircle className="text-[#319694]" size={18} />, text: "Handle missing values appropriately" },
              { icon: <CheckCircle className="text-[#319694]" size={18} />, text: "Save as a CSV with the correct structure" }
            ].map((item, index) => (
              <motion.li 
                key={`custom-${index}`}
                className="flex items-start gap-3 text-gray-700 p-3 rounded-lg"
                initial={{ backgroundColor: "#ffffff" }}
                whileHover={listItemHover}
              >
                <span className="text-[#319694] mt-0.5">{item.icon}</span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WorkloadHelp;