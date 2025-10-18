import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Clock,
  Zap,
  Database,
  AlertCircle,
  BookOpen,
  CheckCircle,
  Code,
  Info,
} from "lucide-react";

const WorkloadHelp = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 pb-4 border-b border-gray-200"
      >
        <Upload className="text-[#319694]" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Workload Configuration
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload task data or use pre-configured datasets to simulate cloud
            scheduling
          </p>
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-teal-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Quick Start</h3>
        </div>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-teal-600">1.</span>
            <span>
              Choose a pre-configured dataset or upload your CSV file or you may
              just toggle the cloudlet config to use a default synthetic
              dataset.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-teal-600">2.</span>
            <span>
              Set how many tasks you want to simulate, We advice to use less
              than equal to 10k if favors a valid simulation.{" "}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-teal-600">3.</span>
            <span>Click "Run Simulation" to run your simulation.</span>
          </li>
        </ol>
      </motion.div>

      {/* File Format Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-[#319694]" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Supported File Formats
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          The system auto-detects these common formats—no manual configuration
          needed:
        </p>

        <div className="space-y-4">
          {/* Google Format */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Google Cluster Format
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs overflow-x-auto">
              <div className="text-gray-600">
                timestamp,task_id,cpu,memory,priority
              </div>
              <div className="text-gray-800">
                1234567890,task_001,0.5,1024,1
              </div>
              <div className="text-gray-800">
                1234567895,task_002,0.8,2048,2
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="font-medium">Fields:</span> timestamp (seconds),
              task_id (string), cpu (0-1), memory (MB), priority (1-10)
            </p>
          </div>

          {/* Standard Format */}
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Standard CloudSim Format
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs overflow-x-auto">
              <div className="text-gray-600">
                task_id,length,file_size,output_size,pes
              </div>
              <div className="text-gray-800">1,10000,300,300,1</div>
              <div className="text-gray-800">2,15000,500,400,2</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="font-medium">Fields:</span> task_id (number),
              length (MI), file_size (bytes), output_size (bytes), pes (cores
              needed)
            </p>
          </div>

          {/* Simple Format */}
          <div className="bg-purple-50 border border-purple-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Simple Format
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs overflow-x-auto">
              <div className="text-gray-600">id,length</div>
              <div className="text-gray-800">1,10000</div>
              <div className="text-gray-800">2,15000</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="font-medium">Fields:</span> id (task number),
              length (MI - Million Instructions)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Submission Mode */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-[#319694]" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Submission Modes
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          The system controls how tasks enter the system:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Instant Submission
            </p>
            <p className="text-sm text-gray-600 mb-2">
              All tasks arrive at once (time = 0), noticeable in synthetic
              workloads.
            </p>
            <p className="text-xs text-gray-600 italic">
              Best for: Testing scheduling algorithms, comparing performance
            </p>
          </div>

          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Gradual Submission
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Tasks arrive over time based on timestamps, e.g. Google Cluster
              Dataset.
            </p>
            <p className="text-xs text-gray-600 italic">
              Best for: Realistic scenarios, dynamic workloads
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pre-configured Datasets */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Database className="text-[#319694]" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Google Cluster Workload Presets
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          30 pre-configured benchmark datasets derived from real Google cluster traces.
          Select from "Research Benchmark Dataset" dropdown in Workload Setup.
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-800">
                Google Cluster Subsets 1-30
              </span>
            </div>
            <p className="text-xs text-gray-700 mb-2">
              Each preset contains clustered task workloads with real-world characteristics:
            </p>
            <ul className="text-xs text-gray-600 space-y-1 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>CPU and memory resource requirements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Task arrival timestamps for realistic scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Priority levels and scheduling classes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Varying task counts suitable for different scales</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="text-teal-600 mt-0.5 flex-shrink-0" size={16} />
              <div className="text-xs text-gray-700">
                <strong className="text-teal-700">How to use:</strong> Select any preset from 1-30 in the dropdown above.
                Each subset provides a different mix of task characteristics for testing your scheduling algorithms.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Troubleshooting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="text-[#319694]" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Common Issues</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              problem: "File upload fails",
              solution: "Ensure CSV has headers and no empty rows",
              example: "Remove blank lines at end of file",
            },
            {
              problem: "Tasks not executing",
              solution: "Check that task length > 0 and VMs are running",
              example: "Task length should be at least 100 MI",
            },
            {
              problem: "Format not recognized",
              solution: "Use supported column names (see formats above)",
              example: "Use 'length' not 'duration' for task size",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-red-50 border border-red-200 rounded p-3"
            >
              <p className="text-sm font-medium text-gray-800">
                {item.problem}
              </p>
              <p className="text-sm text-gray-700 mt-1">{item.solution}</p>
              <p className="text-xs text-gray-600 mt-1 italic">
                Example: {item.example}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Terms */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="text-[#319694]" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Key Terms</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { term: "Cloudlet", def: "A task or job to be executed on a VM" },
            {
              term: "MI (Million Instructions)",
              def: "Measure of computational work required",
            },
            {
              term: "Length",
              def: "Number of instructions a task needs to complete",
            },
            {
              term: "PEs",
              def: "Processing Elements (CPU cores) needed by task",
            },
            {
              term: "Timestamp",
              def: "When a task arrives in the system (seconds)",
            },
            {
              term: "Priority",
              def: "Task importance level (higher = more urgent)",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded p-3">
              <p className="text-sm font-semibold text-gray-800">{item.term}</p>
              <p className="text-sm text-gray-600 mt-1">{item.def}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkloadHelp;
