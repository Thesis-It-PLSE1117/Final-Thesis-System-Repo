import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Info, Download } from "lucide-react";

const CSVFormatGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const requiredColumns = [
    { name: "execution_time", desc: "Task runtime (microseconds)" },
    { name: "pes_number", desc: "Processing cores (1-4)" },
    { name: "file_size", desc: "Input data (0-1 normalized)" },
    { name: "output_size", desc: "Output data (0-1 normalized)" },
  ];

  const optionalColumns = [
    "cpu_request",
    "memory_request",
    "priority",
    "job_ID",
    "machine_ID",
  ];

  const sampleFiles = [
    { name: "Simple", tasks: 5, file: "sample_workload_simple.csv" },
    { name: "Basic", tasks: 10, file: "sample_workload.csv" },
    { name: "Full", tasks: 20, file: "sample_workload_extended.csv" },
  ];

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Info className="text-[#319694]" size={20} />
          <div className="text-left">
            <h4 className="text-sm font-semibold text-gray-800">CSV Format Guide</h4>
            <p className="text-xs text-gray-500">Compatible with Google Cluster Trace format</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="text-gray-400" size={20} />
        ) : (
          <ChevronRight className="text-gray-400" size={20} />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
              {/* Required Columns */}
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-[#319694] rounded-full mr-1.5"></span>
                  REQUIRED COLUMNS
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {requiredColumns.map((col) => (
                    <div key={col.name} className="flex items-start">
                      <span className="text-gray-400 mr-1 mt-0.5">▸</span>
                      <div>
                        <code className="inline-block bg-[#f0fdfa] px-2 py-0.5 rounded text-xs font-mono text-gray-700 border border-[#319694]/20">
                          {col.name}
                        </code>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {col.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Columns */}
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                  OPTIONAL COLUMNS
                </h5>
                <div className="flex flex-wrap gap-1">
                  {optionalColumns.map((col) => (
                    <code
                      key={col}
                      className="inline-block bg-gray-50 px-1.5 py-0.5 rounded text-xs font-mono text-gray-600 border border-gray-200"
                    >
                      {col}
                    </code>
                  ))}
                </div>
              </div>

              {/* Sample Files */}
              <div>
                <h5 className="text-xs font-semibold text-gray-700 mb-2">
                  Download Sample Files:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {sampleFiles.map((file, index) => (
                    <a
                      key={file.name}
                      href={`/samples/${file.file}`}
                      download={file.file}
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                        transition-all duration-200 hover:scale-105 active:scale-95
                        ${
                          index === 2
                            ? "bg-[#319694] text-white shadow-md hover:shadow-lg"
                            : index === 1
                            ? "bg-[#319694]/90 text-white"
                            : "bg-white text-[#319694] border border-[#319694]/30"
                        }
                      `}
                    >
                      <Download size={14} className="mr-1.5" />
                      <span>{file.name}</span>
                      <span className="ml-1 opacity-75 text-xs">
                        ({file.tasks} tasks)
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CSVFormatGuide;
