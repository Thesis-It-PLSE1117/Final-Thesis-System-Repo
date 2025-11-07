import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { X, Maximize2 } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
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
            className="relative bg-white rounded-lg sm:rounded-xl shadow-2xl w-full h-full sm:w-[95vw] sm:h-[92vh] max-w-[1800px] max-h-[95vh] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chart-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Maximize2 className="text-[#319694] flex-shrink-0" size={18} />
                <div className="min-w-0 flex-1">
                  <h2 id="chart-modal-title" className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {algorithm} - {chartTitle}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Expanded View</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 sm:p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800 flex-shrink-0 ml-2"
                aria-label="Close modal"
                autoFocus
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Chart Content */}
            <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-white">
              {isMultiChart ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-full auto-rows-min">
                  {chartOption.map((option, idx) => (
                    <div key={idx} className="min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
                      <ReactECharts
                        option={option}
                        style={{ height: '100%', width: '100%', minHeight: '300px' }}
                        opts={{ renderer: 'canvas', locale: 'EN' }}
                        notMerge={true}
                        lazyUpdate={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[300px]">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas', locale: 'EN' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200 text-center flex-shrink-0">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white border border-gray-300 rounded text-gray-700 font-mono text-xs">ESC</kbd> or click outside to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChartModal;