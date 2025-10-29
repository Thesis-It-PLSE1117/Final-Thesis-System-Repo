import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Cloud,
  FileText,
  Database,
  Zap,
  X,
  Table,
  ChevronUp,
  HelpCircle,
  Dot,
  AlertCircle,
  Info,
  CheckCircle,
  Package,
} from "lucide-react";
import Papa from "papaparse";

const WorkloadUploadCard = ({
  isDragging,
  setIsDragging,
  onFileUpload,
  workloadFile,
  csvRowCount,
  onPresetSelect,
  selectedPreset,
  presetOptions,
  onClearWorkload,
}) => {
  const [csvPreview, setCsvPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const shouldShowUploadSection =
    (!workloadFile && !selectedPreset) || csvRowCount === 0;

  // Validate CSV content
  const validateCSV = (file, callback) => {
    Papa.parse(file, {
      header: true,
      preview: 5,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.meta.fields || results.meta.fields.length === 0) {
          callback("Your CSV file needs column headers.");
          return;
        }
        if (results.data.length === 0) {
          callback("Your CSV file has no data rows.");
          return;
        }
        callback(null, results);
      },
      error: (error) => {
        callback("Cannot read your CSV file. Check the format.");
      },
    });
  };

  // Load preview when file or preset changes
  useEffect(() => {
    const loadPreview = async () => {
      if (workloadFile && csvRowCount > 0) {
        setIsLoadingPreview(true);
        setValidationError(null);

        validateCSV(workloadFile, (error, results) => {
          if (error) {
            setValidationError(error);
            setIsLoadingPreview(false);
            setCsvPreview(null);
            return;
          }

          Papa.parse(workloadFile, {
            header: true,
            preview: 10,
            skipEmptyLines: true,
            complete: (results) => {
              setCsvPreview({
                headers: results.meta.fields,
                rows: results.data,
                type: "upload",
              });
              setIsLoadingPreview(false);
            },
            error: (error) => {
              setValidationError("Cannot read your CSV file.");
              setIsLoadingPreview(false);
            },
          });
        });
      } else if (selectedPreset && csvRowCount > 0) {
        setIsLoadingPreview(true);
        setValidationError(null);
        try {
          const response = await fetch(`/presets/${selectedPreset}`);
          const text = await response.text();
          Papa.parse(text, {
            header: true,
            preview: 10,
            skipEmptyLines: true,
            complete: (results) => {
              setCsvPreview({
                headers: results.meta.fields,
                rows: results.data,
                type: "preset",
              });
              setIsLoadingPreview(false);
            },
            error: (error) => {
              setValidationError("Cannot read preset file.");
              setIsLoadingPreview(false);
            },
          });
        } catch (error) {
          setValidationError("Cannot load preset. Try again.");
          setIsLoadingPreview(false);
        }
      } else {
        setCsvPreview(null);
        setShowPreview(false);
        setValidationError(null);
      }
    };

    loadPreview();
  }, [workloadFile, selectedPreset, csvRowCount]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      onFileUpload({ target: { files: [e.dataTransfer.files[0]] } });
      onPresetSelect("");
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.[0]) {
      onFileUpload(e);
      onPresetSelect("");
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const getPresetDisplayName = () => {
    if (!selectedPreset) return "";
    const preset = presetOptions.find((opt) => opt.value === selectedPreset);
    return preset?.label || selectedPreset;
  };

  const getPresetDescription = () => {
    if (!selectedPreset) return "";
    const preset = presetOptions.find((opt) => opt.value === selectedPreset);
    return preset?.description || "";
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-[#319694]/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Upload area - shown when no file is selected or CSV has 0 rows */}
      {shouldShowUploadSection && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <Cloud className="text-[#319694]" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
                Upload Custom Workload
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload your CSV file with task data.
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Upload className="text-[#319694]" size={18} />
              <h4 className="text-sm font-semibold text-gray-700">
                Select CSV File
              </h4>
              <div className="group relative">
                <HelpCircle
                  className="text-gray-400 hover:text-[#319694] cursor-pointer transition-colors"
                  size={16}
                />
                <div className="absolute hidden group-hover:block z-10 w-64 p-2 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg left-0">
                  Check the Help tab for detailed preprocessing steps and file
                  format requirements
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <motion.label
                className="flex items-center justify-center w-full"
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="flex flex-col items-center justify-center w-full p-6 border-2 border-[#319694]/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-[#f5f9f9] transition-all"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-[#319694] to-[#4fd1c5] hover:from-[#267b79] hover:to-[#319694] text-white rounded-lg font-medium flex items-center gap-2 mb-3 shadow-sm transition-all"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 6px 16px -4px rgba(49, 150, 148, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("file-input").click();
                    }}
                  >
                    <Upload size={18} />
                    Select CSV File
                  </motion.button>
                  <p className="text-sm text-gray-600 mb-1">
                    or drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500">CSV files only</p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileInputChange}
                />
              </motion.label>
            </div>

            {/* Info about benchmark datasets */}
            <div className="flex items-start gap-2 p-3 bg-[#319694]/5 border border-[#319694]/20 rounded-lg mt-4">
              <Info className="text-[#319694] mt-0.5 flex-shrink-0" size={16} />
              <p className="text-sm text-gray-700">
                <strong className="text-[#319694]">Tip:</strong> For benchmark
                datasets (Google cluster traces), use the{" "}
                <strong>Research Benchmark Dataset</strong> dropdown in the
                Simulation Workload Setup section above.
              </p>
            </div>
          </div>

          {/* Show error message if CSV has 0 rows */}
          {csvRowCount === 0 && workloadFile && (
            <motion.div
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="text-red-500 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-red-800">
                  File Error
                </p>
                <p className="text-sm text-red-600">
                  The CSV file contains no data or is improperly formatted.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* File info and preview - IMPROVED VISIBILITY WITH SYSTEM COLORS */}
      {!shouldShowUploadSection && csvRowCount > 0 && (
        <div className="space-y-3">
          {/* Success indicator for preset selection */}
          {selectedPreset && (
            <motion.div
              className="p-3 bg-gradient-to-r from-[#f0fdfa] to-[#e0f2f1] border-2 border-[#319694]/30 rounded-lg flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-2 bg-[#319694]/10 rounded-full">
                <CheckCircle className="text-[#319694]" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#267b79]">
                  Preset Loaded Successfully!
                </p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {getPresetDisplayName()} is ready to use
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            className={`p-4 rounded-lg border-2 ${
              selectedPreset
                ? "bg-[#f0fdfa] border-[#319694]/30"
                : "bg-[#f0fdfa] border-[#319694]/20"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg mr-4 border ${
                  selectedPreset
                    ? "bg-white border-[#319694]/20"
                    : "bg-white border-[#319694]/10"
                }`}
              >
                {selectedPreset ? (
                  <Package className="text-[#319694]" size={20} />
                ) : (
                  <FileText className="text-[#319694]" size={20} />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-gray-800">
                    {workloadFile ? workloadFile.name : getPresetDisplayName()}
                  </p>
                  {selectedPreset && (
                    <span className="text-sm px-2 py-0.5 bg-[#319694] text-white rounded-full font-semibold">
                      PRESET
                    </span>
                  )}
                </div>
                {selectedPreset && getPresetDescription() && (
                  <p className="text-sm text-gray-600 mb-2">
                    {getPresetDescription()}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 items-center">
                  {workloadFile && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Database size={14} className="text-[#319694]" />
                      {(workloadFile.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#319694] flex items-center gap-1">
                    <Zap size={14} />
                    {csvRowCount} tasks loaded
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2">
                {csvPreview && !validationError && (
                  <motion.button
                    onClick={togglePreview}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-white border-2 border-[#319694]/30 hover:bg-[#319694]/10 hover:border-[#319694] text-[#319694] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPreview ? (
                      <>
                        <ChevronUp size={14} />
                        Hide
                      </>
                    ) : (
                      <>
                        <Table size={14} />
                        Preview
                      </>
                    )}
                  </motion.button>
                )}
                <motion.button
                  className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
                  onClick={onClearWorkload}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove workload"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Validation error message */}
            {validationError && (
              <motion.div
                className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="text-red-500 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Invalid CSV file
                  </p>
                  <p className="text-sm text-red-600">{validationError}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Preview section with smooth animations */}
          <AnimatePresence>
            {showPreview && csvPreview && !validationError && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: { duration: 0.3, ease: "easeInOut" },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: { duration: 0.2, ease: "easeIn" },
                }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg border border-[#319694]/20 overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                      <thead className="bg-[#f0fdfa] text-[#319694] sticky top-0">
                        <tr>
                          {csvPreview.headers.map((header, i) => (
                            <th
                              key={i}
                              className="px-3 py-2 text-left font-medium"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#319694]/10">
                        {csvPreview.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#f5f9f9] transition-colors"
                          >
                            {csvPreview.headers.map((header, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 text-gray-700 whitespace-nowrap"
                              >
                                {row[header] || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-1.5 text-sm text-[#319694]/80 bg-[#f0fdfa] border-t border-[#319694]/10 sticky bottom-0">
                    Showing {csvPreview.rows.length} of {csvRowCount} rows{" "}
                    <Dot className="inline mx-1" size={12} />{" "}
                    {csvPreview.type === "preset"
                      ? "Preset workload"
                      : "Uploaded file"}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default WorkloadUploadCard;
