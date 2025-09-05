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
        The simulation supports two CSV schemas from the manuscript specification. Each schema addresses different workload data sources with specific preprocessing requirements:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-[#319694]/10 bg-white/80">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Columns className="text-[#319694]" size={18} /> Normalized Schema
          </h4>
          <p className="text-xs text-gray-600 mb-3">For preprocessed workload data with normalized task parameters</p>
          <ul className="space-y-2">
            {[
              "length: Cloudlet computational work measured in Million Instructions (MI)",
              "pes: Number of Processing Elements required per task (integer)",
              "file_size: Input data size normalized to 0–1 range, scaled to bytes during simulation",
              "output_size: Output data size normalized to 0–1 range, scaled to bytes during simulation"
            ].map((text, i) => (
              <motion.li key={`norm-${i}`} className="text-gray-700 p-2 rounded text-sm" whileHover={listItemHover}>
                {text}
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            <strong>Usage:</strong> Ideal for custom datasets or academic benchmarks
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[#319694]/10 bg-white/80">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Columns className="text-[#319694]" size={18} /> Google Cluster Schema
          </h4>
          <p className="text-xs text-gray-600 mb-3">Based on Google Cluster Traces dataset format with time-based submission</p>
          <ul className="space-y-2">
            {[
              "arrival_ts (μs): Task arrival timestamp in microseconds, normalized using t := (arrival_ts - min(arrival_ts)) / 1e6",
              "cpu_request: CPU resource demand as fraction (0.0–1.0) of total host capacity",
              "memory_request: Memory resource demand as fraction (0.0–1.0) of total host capacity",
              "file_size: Input file size treated as normalized fraction (0–1), scaled to bytes",
              "output_size: Output file size treated as normalized fraction (0–1), scaled to bytes",
              "pes_number: Processing elements required, rounded to nearest integer",
              "time_window (optional): If present, combined with cpu_request to derive computational MI"
            ].map((text, i) => (
              <motion.li key={`ggl-${i}`} className="text-gray-700 p-2 rounded text-sm" whileHover={listItemHover}>
                {text}
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-800">
            <strong>Source:</strong> Preprocessed subset of Google Cluster Dataset
          </div>
        </div>
      </div>

      {/* Submission Modes */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Settings className="text-[#319694]" size={18} />
          Submission Modes
        </h4>
        <ul className="space-y-2">
          {[
            "Batch (default): All tasks are submitted at t=0 for controlled algorithm comparison.",
            "Staged (optional): If arrival_ts is present and enabled, tasks are submitted according to their normalized arrival times.",
            "If some rows have missing arrival_ts, they default to 0 (documented in Results > Methodology)."
          ].map((text, i) => (
            <motion.li key={`mode-${i}`} className="text-gray-700 p-2 rounded" whileHover={listItemHover}>
              {text}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Documentation Breadcrumbs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
          initial={{ y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
          whileHover={cardHover}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <FileText className="text-xl text-[#319694]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Documentation Notes</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#319694] text-sm font-mono mt-0.5">•</span>
              <span><strong>Timestamp Normalization:</strong> arrival_ts converted from microseconds to seconds using: <code className="bg-gray-100 px-1 rounded text-xs">t := (arrival_ts - min(arrival_ts)) / 1e6</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#319694] text-sm font-mono mt-0.5">•</span>
              <span><strong>Data Scaling:</strong> file_size and output_size values interpreted as normalized fractions (0–1) and scaled to bytes during simulation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#319694] text-sm font-mono mt-0.5">•</span>
              <span><strong>Survey Methodology:</strong> End-user and IT-expert evaluation via Google Forms (Likert scale); aggregated findings reported in manuscript</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#319694] text-sm font-mono mt-0.5">•</span>
              <span><strong>Missing Data:</strong> Tasks with missing arrival_ts default to t=0 (batch submission mode)</span>
            </li>
          </ul>
        </motion.div>
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