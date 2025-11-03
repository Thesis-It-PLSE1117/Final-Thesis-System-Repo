import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { X, Maximize2 } from 'lucide-react';
//chart mod template, just found on tailwind docs for ui.
const ChartModal = ({ isOpen, onClose, chartOption, chartTitle, algorithm, isMultiChart = false }) => {
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleBodyScroll = () => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    document.addEventListener('keydown', handleEscKey);
    handleBodyScroll();

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close modal backdrop"
          />
          
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white rounded-xl shadow-2xl w-[95vw] h-[92vh] max-w-[1800px] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chart-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Maximize2 className="text-[#319694]" size={20} />
                <div>
                  <h2 id="chart-modal-title" className="text-lg font-semibold text-gray-800">
                    {algorithm} - {chartTitle}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Expanded View</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
                aria-label="Close modal"
                autoFocus
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-auto bg-white">
              {isMultiChart ? (
                <div className="grid grid-cols-2 gap-6 h-full">
                  {chartOption.map((option, idx) => (
                    <div key={idx} className="min-h-[400px]">
                      <ReactECharts
                        option={option}
                        style={{ height: '100%', width: '100%', minHeight: '400px' }}
                        opts={{ renderer: 'canvas', locale: 'EN' }}
                        notMerge={true}
                        lazyUpdate={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ReactECharts
                  option={chartOption}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas', locale: 'EN' }}
                  notMerge={true}
                  lazyUpdate={true}
                />
              )}
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 font-mono">ESC</kbd> or click outside to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChartModal;
