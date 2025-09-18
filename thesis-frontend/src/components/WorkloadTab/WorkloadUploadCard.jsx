import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Cloud, FileText, Database, Zap, X, Table, ChevronUp, HelpCircle, Dot, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

const WorkloadUploadCard = ({
  isDragging,
  setIsDragging,
  onFileUpload,
  workloadFile,
  csvRowCount,
  onPresetSelect,
  selectedPreset,
  presetOptions,
  onClearWorkload
}) => {
  const [csvPreview, setCsvPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Check if we should show the upload section
  // In the WorkloadUploadCard component, update the shouldShowUploadSection logic:
  const shouldShowUploadSection = !workloadFile && !selectedPreset || csvRowCount === 0;

  // Validate CSV content
  const validateCSV = (file, callback) => {
    Papa.parse(file, {
      header: true,
      preview: 5, // Check first 5 rows for validation
      skipEmptyLines: true,
      complete: (results) => {
        // Basic validation - check if it has headers and at least one data row
        if (!results.meta.fields || results.meta.fields.length === 0) {
          callback('CSV file must have headers');
          return;
        }
        
        if (results.data.length === 0) {
          callback('CSV file must contain data rows');
          return;
        }
        
        // If validation passes
        callback(null, results);
      },
      error: (error) => {
        callback('Failed to parse CSV file');
      }
    });
  };

  // Load preview when file or preset changes
  useEffect(() => {
    const loadPreview = async () => {
      if (workloadFile && csvRowCount > 0) {
        setIsLoadingPreview(true);
        setValidationError(null);
        
        // Validate the file first
        validateCSV(workloadFile, (error, results) => {
          if (error) {
            setValidationError(error);
            setIsLoadingPreview(false);
            setCsvPreview(null);
            return;
          }
          
          // If validation passed, load full preview
          Papa.parse(workloadFile, {
            header: true,
            preview: 10,
            skipEmptyLines: true,
            complete: (results) => {
              setCsvPreview({
                headers: results.meta.fields,
                rows: results.data,
                type: 'upload'
              });
              setIsLoadingPreview(false);
            },
            error: (error) => {
              setValidationError('Failed to parse CSV file');
              setIsLoadingPreview(false);
            }
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
                type: 'preset'
              });
              setIsLoadingPreview(false);
            },
            error: (error) => {
              setValidationError('Failed to parse preset CSV');
              setIsLoadingPreview(false);
            }
          });
        } catch (error) {
          setValidationError('Failed to load preset');
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
      onPresetSelect('');
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.[0]) {
      onFileUpload(e);
      onPresetSelect('');
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const getPresetDisplayName = () => {
    if (!selectedPreset) return '';
    const preset = presetOptions.find(opt => opt.value === selectedPreset);
    return preset?.label || selectedPreset;
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
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <Cloud className="text-[#319694]" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
                Upload Your Own CSV
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-sm text-gray-500">It should contain the workload and its traffic model</p>
                <div className="group relative">
                  <HelpCircle className="text-gray-400 hover:text-[#319694] cursor-pointer" size={16} />
                  <div className="absolute hidden group-hover:block z-10 w-64 p-2 mt-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg">
                    Check the Help tab for detailed preprocessing steps and file format requirements
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full">
            <motion.label 
              className="flex items-center justify-center w-full"
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-[#319694]/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-[#f0fdfa] transition-all"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <motion.button
                  className="px-6 py-3 bg-[#319694] text-white rounded-lg font-medium flex items-center gap-2 mb-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('file-input').click();
                  }}
                >
                  <Upload size={18} />
                  Select CSV File
                </motion.button>
                <p className="text-sm text-gray-600 mb-1">or drag and drop your file here</p>
                <p className="text-xs text-gray-500">CSV files only</p>
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

          {/* Show error message if CSV has 0 rows */}
          {csvRowCount === 0 && workloadFile && (
            <motion.div 
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="text-red-500 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-red-800">Invalid CSV file</p>
                <p className="text-xs text-red-600">The CSV file contains no data or is improperly formatted.</p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* File info and preview - only shown when file is selected and has rows */}
      {!shouldShowUploadSection && csvRowCount > 0 && (
        <div className="space-y-3">
          <motion.div 
            className="p-4 bg-[#f0fdfa] rounded-lg border border-[#319694]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-4 border border-[#319694]/10">
                <FileText className="text-[#319694]" size={20} />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800">
                  {workloadFile ? workloadFile.name : getPresetDisplayName()}
                </p>
                <div className="flex flex-wrap gap-3 mt-2 items-center">
                  {workloadFile && (
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Database size={14} className="text-[#319694]" /> 
                      {(workloadFile.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Zap size={14} className="text-[#319694]" /> 
                    {csvRowCount} tasks
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {csvPreview && !validationError && (
                  <motion.button
                    onClick={togglePreview}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-[#319694]/20 hover:bg-[#319694]/10 text-[#319694] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPreview ? (
                      <>
                        <ChevronUp size={14} />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Table size={14} />
                        Show Preview
                      </>
                    )}
                  </motion.button>
                )}
                <motion.button 
                  className="p-1 text-gray-400 hover:text-[#319694] rounded-full"
                  onClick={onClearWorkload}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
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
                  <p className="text-sm font-medium text-red-800">Invalid CSV file</p>
                  <p className="text-xs text-red-600">{validationError}</p>
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
                  height: 'auto',
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { duration: 0.2, ease: "easeIn" }
                }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg border border-[#319694]/20 overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                      <thead className="bg-[#f0fdfa] text-[#319694] sticky top-0">
                        <tr>
                          {csvPreview.headers.map((header, i) => (
                            <th key={i} className="px-3 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#319694]/10">
                        {csvPreview.rows.map((row, i) => (
                          <tr key={i}>
                            {csvPreview.headers.map((header, j) => (
                              <td key={j} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                                {row[header] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-1.5 text-xs text-[#319694]/80 bg-[#f0fdfa] border-t border-[#319694]/10 sticky bottom-0">
                    Showing {csvPreview.rows.length} of {csvRowCount} rows <Dot className="inline mx-1" size={12} /> {csvPreview.type === 'preset' ? 'Preset workload' : 'Uploaded file'}
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