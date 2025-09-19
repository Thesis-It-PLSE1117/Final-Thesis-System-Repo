import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Target,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import PlotInterpretationCard from './PlotInterpretationCard';

const AnalysisDisplay = ({ analysis, algorithmName }) => {
  const [expandedSections, setExpandedSections] = useState({
    overall: true,
    metrics: false,
    efficiency: false,
    recommendations: false,
    plots: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!analysis) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">No analysis data available</p>
      </div>
    );
  }

  const { 
    overallPerformance, 
    metricInterpretations, 
    efficiencyAnalysis, 
    recommendations, 
    plotInterpretations 
  } = analysis;

  const renderGrade = (grade) => {
    const gradeColors = {
      'A+': 'text-[#319694] bg-[#319694]/10',
      'A': 'text-[#319694] bg-[#319694]/10',
      'A-': 'text-[#319694]/90 bg-[#319694]/10',
      'B+': 'text-[#319694]/80 bg-[#319694]/10',
      'B': 'text-[#319694]/70 bg-[#319694]/10',
      'B-': 'text-[#319694]/60 bg-[#319694]/10',
      'C+': 'text-amber-600 bg-amber-100',
      'C': 'text-amber-600 bg-amber-100',
      'C-': 'text-amber-500 bg-amber-100',
      'D': 'text-red-600 bg-red-100'
    };

    const colorClass = gradeColors[grade] || 'text-gray-600 bg-gray-100';

    return (
      <span className={`text-3xl font-bold px-4 py-2 rounded-lg ${colorClass}`}>
        {grade}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Performance Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('overall')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694] to-[#319694]/80 text-white flex items-center justify-between hover:from-[#267b79] hover:to-[#267b79]/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <Award size={24} />
            <h3 className="text-xl font-bold">Overall Performance Analysis</h3>
          </div>
          {expandedSections.overall ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.overall && overallPerformance && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Performance Grade</p>
                    {renderGrade(overallPerformance.grade)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Algorithm</p>
                    <p className="text-2xl font-bold text-[#319694]">{algorithmName}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-base text-gray-700 leading-relaxed">{overallPerformance.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#319694]/5 border border-[#319694]/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="text-[#319694]" size={20} />
                      <h4 className="font-semibold text-gray-800">Strengths</h4>
                    </div>
                    <p className="text-sm text-gray-600">{overallPerformance.strengths}</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-amber-600" size={20} />
                      <h4 className="font-semibold text-gray-800">Areas for Improvement</h4>
                    </div>
                    <p className="text-sm text-gray-600">{overallPerformance.weaknesses}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metric Interpretations Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('metrics')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/90 to-[#319694]/70 text-white flex items-center justify-between hover:from-[#267b79]/90 hover:to-[#267b79]/70 transition-all">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} />
            <h3 className="text-xl font-bold">Metric-Specific Analysis</h3>
          </div>
          {expandedSections.metrics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.metrics && metricInterpretations && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(metricInterpretations).map(([metric, interpretation]) => (
                    <div key={metric} className="bg-gray-50 border-l-4 border-[#319694] rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 capitalize mb-2">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Efficiency Analysis Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('efficiency')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/80 to-[#319694]/60 text-white flex items-center justify-between hover:from-[#267b79]/80 hover:to-[#267b79]/60 transition-all">
          <div className="flex items-center gap-3">
            <Zap size={24} />
            <h3 className="text-xl font-bold">Efficiency Analysis</h3>
          </div>
          {expandedSections.efficiency ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.efficiency && efficiencyAnalysis && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(efficiencyAnalysis).map(([key, value]) => (
                    <div key={key} className="bg-[#319694]/5 border border-[#319694]/20 rounded-lg p-4">
                      <Activity className="text-[#319694] mb-2" size={20} />
                      <p className="text-sm font-semibold text-gray-800 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('recommendations')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/70 to-[#319694]/50 text-white flex items-center justify-between hover:from-[#267b79]/70 hover:to-[#267b79]/50 transition-all">
          <div className="flex items-center gap-3">
            <Target size={24} />
            <h3 className="text-xl font-bold">Optimization Recommendations</h3>
          </div>
          {expandedSections.recommendations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.recommendations && recommendations && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-[#319694]/5 border border-[#319694]/20 rounded-lg p-3">
                      <AlertTriangle className="text-[#319694] mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plot Interpretations Section */}
      {plotInterpretations && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('plots')}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/60 to-[#319694]/40 text-white flex items-center justify-between hover:from-[#267b79]/60 hover:to-[#267b79]/40 transition-all">
            <div className="flex items-center gap-3">
              <Info size={24} />
              <h3 className="text-xl font-bold">Visualization Interpretations</h3>
            </div>
            {expandedSections.plots ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          <AnimatePresence>
            {expandedSections.plots && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plotInterpretations.map((interpretation) => (
                      <PlotInterpretationCard key={interpretation.plotId} interpretation={interpretation} />
                    ))}
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

export default AnalysisDisplay;

