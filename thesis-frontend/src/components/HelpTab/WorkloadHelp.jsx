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
            Upload your task data or choose a ready-made dataset to test cloud scheduling.
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
              Pick a dataset from our library, upload your own CSV file, or use the default synthetic dataset.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-teal-600">2.</span>
            <span>
              Set how many tasks to simulate. We recommend 10,000 or fewer for accurate results.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-teal-600">3.</span>
            <span>Click "Run Simulation" to start.</span>
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
          The system detects these formats automatically. No setup needed.
        </p>

        <div className="space-y-4">
          {/* Google Format */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Google Cluster Format
            </p>
            <div className="bg-white rounded p-3 font-mono text-sm overflow-x-auto">
              <div className="text-gray-600">
                cpu_request,pes_number,file_size,output_size,arrival_ts
              </div>
              <div className="text-gray-800">
                0.5,1,0.1,0.1,1234567890000
              </div>
              <div className="text-gray-800">
                0.8,2,0.3,0.2,1234567895000
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Fields:</span> CPU usage (0 to 1), cores needed (1-8), file size, output size, and arrival time (optional).
            </p>
          </div>

          {/* Standard Format */}
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Standard CloudSim Format (Normalized)
            </p>
            <div className="bg-white rounded p-3 font-mono text-sm overflow-x-auto">
              <div className="text-gray-600">
                length,pes,file_size,output_size
              </div>
              <div className="text-gray-800">10000,1,0.1,0.1</div>
              <div className="text-gray-800">15000,2,0.3,0.2</div>
              <div className="text-gray-800">20000,1,0.5,0.4</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Fields:</span> task length in MI (minimum 1000), cores needed (1-8), file size, and output size.
            </p>
          </div>

          {/* Simple Format */}
          <div className="bg-purple-50 border border-purple-200 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Minimal Format (Auto-filled defaults)
            </p>
            <div className="bg-white rounded p-3 font-mono text-sm overflow-x-auto">
              <div className="text-gray-600">length</div>
              <div className="text-gray-800">10000</div>
              <div className="text-gray-800">15000</div>
              <div className="text-gray-800">20000</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Fields:</span> only task length needed (minimum 1000 MI). We auto-fill the rest.
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
          Choose when tasks enter the system:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Instant Submission
            </p>
            <p className="text-sm text-gray-600 mb-2">
              All tasks arrive at time zero. This works well for testing.
            </p>
            <p className="text-sm text-gray-600 italic">
              Best for: Comparing how algorithms perform.
            </p>
          </div>

          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Gradual Submission
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Tasks arrive at different times using your timestamps. More realistic.
            </p>
            <p className="text-sm text-gray-600 italic">
              Best for: Real-world testing with changing workloads.
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
          We provide 30 ready-made datasets from real Google servers. Pick one from the "Research Benchmark Dataset" dropdown.
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-800">
                Google Cluster Subsets 1-30
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Each preset contains clustered task workloads with real-world characteristics:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
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
              <div className="text-sm text-gray-700">
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
              <p className="text-sm text-gray-600 mt-1 italic">
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
