import { motion } from 'framer-motion';
import { BookText, Cpu, Settings, LineChart, Download } from 'lucide-react';

const DocumentationModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#267b79]/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        className="relative bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#4fd1c5]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-[#4fd1c5]/10 text-[#4fd1c5]">
            <BookText size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
        </div>
        
        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full ${section.icon.props.className.includes('blue') ? 'bg-[#319694]/10' : section.icon.props.className.includes('green') ? 'bg-[#4fd1c5]/10' : 'bg-gray-100'} ${section.icon.props.className}`}>
                  {section.icon}
                </span>
                {section.title}
              </h3>
              {section.content && <p className="pl-10 mb-3 text-gray-700">{section.content}</p>}
              {section.list && (
                <ul className="pl-10 space-y-2">
                  {section.list.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex items-center justify-center w-5 h-5 mt-0.5 mr-2 rounded-full bg-[#319694]/10 text-[#319694] text-xs flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4fd1c5] to-[#319694] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md">
            <Download size={18} />
            Download Full Documentation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentationModal;