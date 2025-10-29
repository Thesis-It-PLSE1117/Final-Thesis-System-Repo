import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Info, Download, FileDown } from "lucide-react";

const CSVFormatGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const downloadSampleFile = (filename) => {
    const link = document.createElement('a');
    link.href = `/samples/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSampleSelection = (file) => {
    downloadSampleFile(file.file);
    setIsDropdownOpen(false);
  };

  const requiredColumns = [
    { name: "length", desc: "Task size in MI (min 1000, e.g., 10000)." },
    { name: "pes", desc: "Processing cores required (1-8)," },
    { name: "file_size", desc: "Input data size (0-1 normalized or bytes)." },
    { name: "output_size", desc: "Output data size (0-1 normalized or bytes)." },
  ];

  const optionalColumns = [
    "arrival_time",
    "cpu_request",
    "pes_number",
    "arrival_ts",
    "time_window",
    "task_id",
  ];

  const sampleFiles = [
    { 
      name: "Minimal", 
      tasks: 5, 
      file: "sample_workload_simple.csv",
      format: "length only"
    },
    { 
      name: "Standard", 
      tasks: 10, 
      file: "sample_workload.csv",
      format: "length,pes,file_size,output_size"
    },
    { 
      name: "With Timing", 
      tasks: 20, 
      file: "sample_workload_extended.csv",
      format: "+ arrival_time"
    },
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
            <p className="text-sm text-gray-500">Compatible with Google Cluster Trace format.</p>
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

              <div className="relative mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <FileDown size={14} className="text-[#319694]" />
                  Download Sample Files:
                </h5>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm bg-white border border-[#319694]/30 rounded-lg text-gray-700 hover:border-[#319694] hover:bg-[#f0fdfa] focus:outline-none focus:ring-2 focus:ring-[#319694]/50 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Download size={16} className="text-[#319694]" />
                      <span>Select a sample format...</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-[#319694]/20 rounded-lg shadow-lg overflow-hidden"
                      >
                        {sampleFiles.map((file) => (
                          <motion.button
                            key={file.file}
                            onClick={() => handleSampleSelection(file)}
                            whileHover={{ backgroundColor: "#f0fdfa" }}
                            className="w-full px-4 py-3 flex items-start gap-3 text-left border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-8 h-8 rounded-lg bg-[#319694]/10 flex items-center justify-center">
                                <FileDown size={16} className="text-[#319694]" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-800">
                                  {file.name}
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium bg-[#319694]/10 text-[#319694]">
                                  {file.tasks} tasks
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 font-mono">
                                {file.format}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <Download size={14} className="text-gray-400" />
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                  <Info size={12} className="text-[#319694]" />
                  Click any option to download immediately.
                </p>
              </div>

              {/* Required Columns */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-[#319694] rounded-full mr-1.5"></span>
                  REQUIRED COLUMNS
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {requiredColumns.map((col) => (
                    <div key={col.name} className="flex items-start">
                      <span className="text-gray-400 mr-1 mt-0.5">▸</span>
                      <div>
                        <code className="inline-block bg-[#f0fdfa] px-2 py-0.5 rounded text-sm font-mono text-gray-700 border border-[#319694]/20">
                          {col.name}
                        </code>
                        <span className="block text-sm text-gray-500 mt-0.5">
                          {col.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Columns */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                  OPTIONAL COLUMNS
                </h5>
                <div className="flex flex-wrap gap-1">
                  {optionalColumns.map((col) => (
                    <code
                      key={col}
                      className="inline-block bg-gray-50 px-1.5 py-0.5 rounded text-sm font-mono text-gray-600 border border-gray-200"
                    >
                      {col}
                    </code>
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
