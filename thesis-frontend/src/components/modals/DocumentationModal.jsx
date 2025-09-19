import React from 'react';
import { motion } from 'framer-motion';
import { BookText, Download, X } from 'lucide-react';

const DocumentationModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#267b79]/20 backdrop-blur-sm px-3 sm:px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        className="relative bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-[95vw] sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#4fd1c5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 sm:hidden"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-[#4fd1c5]/10 text-[#4fd1c5]">
            <BookText className="size-5 sm:size-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{content.title}</h2>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {content.sections.map((section, index) => {
            // Determine icon background color based on section type
            let iconBgColor = 'bg-gray-100';
            let iconColor = 'text-gray-600';
            
            if (section.iconType === 'blue') {
              iconBgColor = 'bg-[#319694]/10';
              iconColor = 'text-[#319694]';
            } else if (section.iconType === 'green') {
              iconBgColor = 'bg-[#4fd1c5]/10';
              iconColor = 'text-[#4fd1c5]';
            }
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2 mb-2 sm:mb-3">
                  <span className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${iconBgColor} ${iconColor}`}>
                    {React.cloneElement(section.icon, { className: "size-3 sm:size-4" })}
                  </span>
                  {section.title}
                </h3>
                {section.content && <p className="pl-8 sm:pl-10 mb-2 sm:mb-3 text-gray-700 text-sm sm:text-base">{section.content}</p>}
                {section.list && (
                  <ul className="pl-8 sm:pl-10 space-y-1 sm:space-y-2">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 rounded-full bg-[#319694]/10 text-[#319694] text-xs flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4fd1c5] to-[#319694] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md text-sm sm:text-base">
            <Download className="size-4 sm:size-5" />
            Download Full Documentation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentationModal;