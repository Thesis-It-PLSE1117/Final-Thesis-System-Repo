import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDownload, 
  FiPrinter, 
  FiMaximize2,
  FiInfo
} from 'react-icons/fi';
import PlotInterpretationCard from './PlotInterpretationCard';

/**
 * PlotWithInterpretation - Combines plot image with its interpretation
 * Simple solution that displays plot and analysis together
 */
const PlotWithInterpretation = ({ 
  plotUrl, 
  plotTitle, 
  algorithm,
  interpretation,
  onImageClick,
  onDownload,
  onPrint,
  onError
}) => {
  const [showInterpretation, setShowInterpretation] = useState(true);
  const [imageError, setImageError] = useState(false);



  const handleImageError = () => {
    setImageError(true);
    if (onError) onError();
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload();
  };

  const handlePrint = (e) => {
    e.stopPropagation();
    if (onPrint) onPrint();
  };

  const handleImageClick = () => {
    if (onImageClick && !imageError) onImageClick();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">{algorithm}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{plotTitle}</span>
          </div>
                     <button
             onClick={() => setShowInterpretation(!showInterpretation)}
             className={`text-sm px-2 py-1 rounded-md transition-colors ${
               showInterpretation 
                 ? 'bg-[#319694] text-white' 
                 : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
             }`}
             title="Toggle interpretation"
           >
            <FiInfo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plot Image */}
      <div className="relative group">
        {!imageError ? (
          <>
            <img 
              src={plotUrl} 
              alt={`${algorithm} - ${plotTitle}`}
              className="w-full h-auto object-contain cursor-pointer hover:opacity-95 transition-opacity"
              onClick={handleImageClick}
              onError={handleImageError}
              style={{ maxHeight: '400px', backgroundColor: '#f9fafb' }}
            />
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-2">
                                   <motion.button
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={handleImageClick}
                   className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                   title="View fullscreen"
                 >
                   <FiMaximize2 className="w-4 h-4" />
                 </motion.button>
                 <motion.button
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={handleDownload}
                   className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                   title="Download image"
                 >
                   <FiDownload className="w-4 h-4" />
                 </motion.button>
                 <motion.button
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={handlePrint}
                   className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-md hover:bg-white transition-colors"
                   title="Print image"
                 >
                   <FiPrinter className="w-4 h-4" />
                 </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">Plot not available</p>
            <p className="text-xs mt-1 text-gray-400">Unable to load {algorithm} {plotTitle}</p>
          </div>
        )}
      </div>

      {/* Interpretation Section */}
      {showInterpretation && interpretation && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <PlotInterpretationCard 
            interpretation={interpretation}
            plotTitle={plotTitle}
          />
        </div>
      )}
    </div>
  );
};

export default PlotWithInterpretation;