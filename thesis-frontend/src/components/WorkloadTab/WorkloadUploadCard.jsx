import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Cloud, FileText, Database, Zap, X, Table, ChevronDown, ChevronUp } from 'lucide-react';
import Papa from 'papaparse';

const WorkloadUploadCard = ({
  isDragging,
  setIsDragging,
  onFileUpload,
  workloadFile,
  csvRowCount,
  onPresetSelect,
  selectedPreset,
  presetOptions
}) => {
  const [csvPreview, setCsvPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Load preview when file or preset changes
  useEffect(() => {
    const loadPreview = async () => {
      if (workloadFile) {
        setIsLoadingPreview(true);
        Papa.parse(workloadFile, {
          header: true,
          preview: 5,
          complete: (results) => {
            setCsvPreview({
              headers: results.meta.fields,
              rows: results.data,
              type: 'upload'
            });
            setIsLoadingPreview(false);
          },
          error: (error) => {
            setIsLoadingPreview(false);
          }
        });
      } else if (selectedPreset) {
        setIsLoadingPreview(true);
        try {
          const response = await fetch(`/presets/${selectedPreset}`);
          const text = await response.text();
          Papa.parse(text, {
            header: true,
            preview: 5,
            complete: (results) => {
              setCsvPreview({
                headers: results.meta.fields,
                rows: results.data,
                type: 'preset'
              });
              setIsLoadingPreview(false);
            },
            error: (error) => {
              setIsLoadingPreview(false);
            }
          });
        } catch (error) {
          setIsLoadingPreview(false);
        }
      } else {
        setCsvPreview(null);
        setShowPreview(false);
      }
    };

    loadPreview();
  }, [workloadFile, selectedPreset]);

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

  const handleClearWorkload = () => {
    onFileUpload({ target: { files: [] } });
    onPresetSelect('');
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
      {/* Upload area */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <Cloud className="text-[#319694]" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
          Upload Your Own CSV
        </h3>
      </div>

      <div className="flex items-center justify-center w-full">
        <motion.label 
          className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
            isDragging ? 'border-[#319694] bg-[#f0fdfa]' : 'border-[#319694]/30'
          } border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-[#f0fdfa] transition-all`}
          whileTap={{ scale: 0.98 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <motion.div animate={{ y: isDragging ? [-3, 3, -3] : 0 }}>
              <Upload className="text-[#319694] mb-3" size={28} />
            </motion.div>
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold text-[#319694]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleFileInputChange}
          />
        </motion.label>
      </div>

      {/* File info and preview */}
      {(workloadFile || selectedPreset) && (
        <div className="mt-6 space-y-3">
          <motion.div 
            className="p-4 bg-[#f0fdfa] rounded-lg border border-[#319694]/20 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
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
              {csvPreview && (
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
                onClick={handleClearWorkload}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>
          </motion.div>

          {/* Preview section */}
          {showPreview && csvPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-lg border border-[#319694]/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f0fdfa] text-[#319694]">
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
                <div className="px-3 py-1.5 text-xs text-[#319694]/80 bg-[#f0fdfa] border-t border-[#319694]/10">
                  Previewing {csvPreview.rows.length} rows • {csvPreview.type === 'preset' ? 'Preset workload' : 'Uploaded file'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WorkloadUploadCard;