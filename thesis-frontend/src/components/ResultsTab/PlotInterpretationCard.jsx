import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  Eye,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

/**
 * Enhanced PlotInterpretationCard - Displays comprehensive plot analysis
 * Refactored to show all interpretation fields from backend
 */
const PlotInterpretationCard = ({ interpretation, plotTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!interpretation) return null;

  // Extract all fields from interpretation object
  const {
    summary,
    keyFindings,
    recommendations,
    metricExplanations,
    visualPattern,
    performanceGrade
  } = interpretation;

  // Simple grade color mapping
  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-600';
    const gradeStr = grade.toString().toUpperCase();
    
    if (gradeStr === 'EXCELLENT' || gradeStr.includes('A')) 
      return 'bg-green-100 text-green-700';
    if (gradeStr === 'VERY_GOOD' || gradeStr.includes('B+')) 
      return 'bg-blue-100 text-blue-700';
    if (gradeStr === 'GOOD' || gradeStr.includes('B')) 
      return 'bg-cyan-100 text-cyan-700';
    if (gradeStr === 'SATISFACTORY' || gradeStr.includes('C')) 
      return 'bg-yellow-100 text-yellow-700';
    return 'bg-orange-100 text-orange-700';
  };

  // Format grade for display
  const formatGrade = (grade) => {
    if (!grade) return null;
    return grade.toString().replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-[#319694]" />
              <h5 className="font-semibold text-gray-800">
                {plotTitle || 'Plot Analysis'}
              </h5>
              {performanceGrade && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(performanceGrade)}`}>
                  {formatGrade(performanceGrade)}
                </span>
              )}
            </div>
            
            {/* Summary - Always show */}
            {summary && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {summary}
              </p>
            )}
          </div>
          
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Key Findings */}
              {keyFindings && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-blue-600" />
                    <span className="font-medium text-sm text-blue-800">Key Findings</span>
                  </div>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {keyFindings}
                  </p>
                </div>
              )}

              {/* Visual Pattern */}
              {visualPattern && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-purple-600" />
                    <span className="font-medium text-sm text-purple-800">Visual Pattern</span>
                  </div>
                  <p className="text-sm text-purple-700 leading-relaxed">
                    {visualPattern}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {recommendations && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={16} className="text-amber-600" />
                    <span className="font-medium text-sm text-amber-800">Recommendations</span>
                  </div>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    {recommendations}
                  </p>
                </div>
              )}

              {/* Metric Explanations */}
              {metricExplanations && Object.keys(metricExplanations).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-gray-600" />
                    <span className="font-medium text-sm text-gray-800">Detailed Metrics</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(metricExplanations).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-gray-600 ml-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlotInterpretationCard;