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
  BarChart3,
  GitCompare,
  ArrowRight
} from 'lucide-react';
import PlotInterpretationCard from './PlotInterpretationCard';

/**
 * AnalysisComparison Component
 * Provides side-by-side comparison of EACO and EPSO analyses
 * Complies with ISO 9241-110 (Dialogue principles) and ISO 9241-12 (Presentation of information)
 */
const AnalysisComparison = ({ eacoAnalysis, epsoAnalysis }) => {
  const [expandedSections, setExpandedSections] = useState({
    overall: true,
    metrics: false,
    efficiency: false,
    recommendations: false,
    plots: true
  });

  const [comparisonMode, setComparisonMode] = useState('side-by-side'); // 'side-by-side' or 'toggle'

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Grade rendering with comparison indicator
  const renderGrade = (grade, isBetter = null) => {
    const gradeColors = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'A-': 'text-green-500 bg-green-50',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'B-': 'text-blue-500 bg-blue-50',
      'C+': 'text-amber-600 bg-amber-100',
      'C': 'text-amber-600 bg-amber-100',
      'C-': 'text-amber-500 bg-amber-100',
      'D': 'text-red-600 bg-red-100'
    };

    const colorClass = gradeColors[grade] || 'text-gray-600 bg-gray-100';

    return (
      <div className="relative">
        <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${colorClass}`}>
          {grade}
        </span>
        {isBetter !== null && (
          <span className={`absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
            isBetter ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
          }`}>
            {isBetter ? '✓' : ''}
          </span>
        )}
      </div>
    );
  };

  // Compare grades to determine which is better
  const compareGrades = (eacoGrade, epsoGrade) => {
    const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'];
    const eacoIndex = gradeOrder.indexOf(eacoGrade);
    const epsoIndex = gradeOrder.indexOf(epsoGrade);
    
    if (eacoIndex < epsoIndex) return { eacoBetter: true, epsoBetter: false };
    if (epsoIndex < eacoIndex) return { eacoBetter: false, epsoBetter: true };
    return { eacoBetter: null, epsoBetter: null };
  };

  if (!eacoAnalysis && !epsoAnalysis) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">No analysis data available</p>
      </div>
    );
  }

  const gradeComparison = eacoAnalysis?.overallPerformance?.grade && epsoAnalysis?.overallPerformance?.grade
    ? compareGrades(eacoAnalysis.overallPerformance.grade, epsoAnalysis.overallPerformance.grade)
    : { eacoBetter: null, epsoBetter: null };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Comparison Mode Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="text-[#319694]" size={20} />
            <h3 className="font-semibold text-gray-800">Comparison View</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setComparisonMode('side-by-side')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                comparisonMode === 'side-by-side'
                  ? 'bg-[#319694] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setComparisonMode('toggle')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                comparisonMode === 'toggle'
                  ? 'bg-[#319694] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toggle View
            </button>
          </div>
        </div>
      </div>

      {/* Overall Performance Comparison */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('overall')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694] to-[#319694]/80 text-white flex items-center justify-between hover:from-[#267b79] hover:to-[#267b79]/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <Award size={24} />
            <h3 className="text-xl font-bold">Overall Performance Comparison</h3>
          </div>
          {expandedSections.overall ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.overall && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {comparisonMode === 'side-by-side' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* EACO Column */}
                    <div className={`border-2 rounded-lg p-4 ${
                      gradeComparison.eacoBetter ? 'border-green-400 bg-green-50/30' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-[#319694]">EACO</h4>
                        {eacoAnalysis?.overallPerformance?.grade && 
                          renderGrade(eacoAnalysis.overallPerformance.grade, gradeComparison.eacoBetter)}
                      </div>
                      
                      {eacoAnalysis?.overallPerformance && (
                        <>
                          <p className="text-sm text-gray-700 mb-4">
                            {eacoAnalysis.overallPerformance.summary}
                          </p>
                          
                          <div className="space-y-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="text-green-600" size={16} />
                                <span className="font-medium text-sm text-gray-800">Strengths</span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {eacoAnalysis.overallPerformance.strengths}
                              </p>
                            </div>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="text-amber-600" size={16} />
                                <span className="font-medium text-sm text-gray-800">Improvements</span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {eacoAnalysis.overallPerformance.weaknesses}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* EPSO Column */}
                    <div className={`border-2 rounded-lg p-4 ${
                      gradeComparison.epsoBetter ? 'border-green-400 bg-green-50/30' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-purple-600">EPSO</h4>
                        {epsoAnalysis?.overallPerformance?.grade && 
                          renderGrade(epsoAnalysis.overallPerformance.grade, gradeComparison.epsoBetter)}
                      </div>
                      
                      {epsoAnalysis?.overallPerformance && (
                        <>
                          <p className="text-sm text-gray-700 mb-4">
                            {epsoAnalysis.overallPerformance.summary}
                          </p>
                          
                          <div className="space-y-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="text-green-600" size={16} />
                                <span className="font-medium text-sm text-gray-800">Strengths</span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {epsoAnalysis.overallPerformance.strengths}
                              </p>
                            </div>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="text-amber-600" size={16} />
                                <span className="font-medium text-sm text-gray-800">Improvements</span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {epsoAnalysis.overallPerformance.weaknesses}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <ToggleView 
                    eacoContent={eacoAnalysis?.overallPerformance}
                    epsoContent={epsoAnalysis?.overallPerformance}
                    type="overall"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metric Interpretations Comparison */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('metrics')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/90 to-[#319694]/70 text-white flex items-center justify-between hover:from-[#267b79]/90 hover:to-[#267b79]/70 transition-all"
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={24} />
            <h3 className="text-xl font-bold">Metric-Specific Analysis</h3>
          </div>
          {expandedSections.metrics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.metrics && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {comparisonMode === 'side-by-side' ? (
                  <MetricComparison 
                    eacoMetrics={eacoAnalysis?.metricInterpretations}
                    epsoMetrics={epsoAnalysis?.metricInterpretations}
                  />
                ) : (
                  <ToggleView 
                    eacoContent={eacoAnalysis?.metricInterpretations}
                    epsoContent={epsoAnalysis?.metricInterpretations}
                    type="metrics"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Efficiency Analysis Comparison */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('efficiency')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/80 to-[#319694]/60 text-white flex items-center justify-between hover:from-[#267b79]/80 hover:to-[#267b79]/60 transition-all"
        >
          <div className="flex items-center gap-3">
            <Zap size={24} />
            <h3 className="text-xl font-bold">Efficiency Analysis</h3>
          </div>
          {expandedSections.efficiency ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.efficiency && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {comparisonMode === 'side-by-side' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#319694]">EACO Efficiency</h4>
                      {eacoAnalysis?.efficiencyAnalysis && Object.entries(eacoAnalysis.efficiencyAnalysis).map(([key, value]) => (
                        <div key={key} className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-800 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-xs text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-600">EPSO Efficiency</h4>
                      {epsoAnalysis?.efficiencyAnalysis && Object.entries(epsoAnalysis.efficiencyAnalysis).map(([key, value]) => (
                        <div key={key} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-800 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-xs text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ToggleView 
                    eacoContent={eacoAnalysis?.efficiencyAnalysis}
                    epsoContent={epsoAnalysis?.efficiencyAnalysis}
                    type="efficiency"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recommendations Comparison */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('recommendations')}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/70 to-[#319694]/50 text-white flex items-center justify-between hover:from-[#267b79]/70 hover:to-[#267b79]/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Target size={24} />
            <h3 className="text-xl font-bold">Optimization Recommendations</h3>
          </div>
          {expandedSections.recommendations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {expandedSections.recommendations && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {comparisonMode === 'side-by-side' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-[#319694] mb-3">EACO Recommendations</h4>
                      <div className="space-y-2">
                        {eacoAnalysis?.recommendations?.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 bg-teal-50 border border-teal-200 rounded-lg p-2">
                            <ArrowRight className="text-teal-600 mt-0.5 flex-shrink-0" size={14} />
                            <p className="text-xs text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-3">EPSO Recommendations</h4>
                      <div className="space-y-2">
                        {epsoAnalysis?.recommendations?.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-lg p-2">
                            <ArrowRight className="text-purple-600 mt-0.5 flex-shrink-0" size={14} />
                            <p className="text-xs text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ToggleView 
                    eacoContent={eacoAnalysis?.recommendations}
                    epsoContent={epsoAnalysis?.recommendations}
                    type="recommendations"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plot Interpretations Comparison - render only when we actually have data */}
      {(() => {
        const hasEacoPlots = Array.isArray(eacoAnalysis?.plotInterpretations) && eacoAnalysis.plotInterpretations.length > 0;
        const hasEpsoPlots = Array.isArray(epsoAnalysis?.plotInterpretations) && epsoAnalysis.plotInterpretations.length > 0;
        const hasAnyPlots = hasEacoPlots || hasEpsoPlots;
        if (!hasAnyPlots) return null;
        return (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('plots')}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#319694]/60 to-[#319694]/40 text-white flex items-center justify-between hover:from-[#267b79]/60 hover:to-[#267b79]/40 transition-all">
              <div className="flex items-center gap-3">
                <Info size={24} />
                <h3 className="text-xl font-bold">Visualization Interpretations</h3>
              </div>
              {expandedSections.plots ? <ChevronUp size={20} /> : <ChevronDown size={20} /> }
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {hasEacoPlots && (
                        <div>
                          <h4 className="text-lg font-bold text-[#319694] mb-4">EACO Interpretations</h4>
                          {eacoAnalysis.plotInterpretations.map((interpretation) => (
                            <PlotInterpretationCard key={interpretation.plotId} interpretation={interpretation} />
                          ))}
                        </div>
                      )}
                      {hasEpsoPlots && (
                        <div>
                          <h4 className="text-lg font-bold text-purple-600 mb-4">EPSO Interpretations</h4>
                          {epsoAnalysis.plotInterpretations.map((interpretation) => (
                            <PlotInterpretationCard key={interpretation.plotId} interpretation={interpretation} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })()}
    </motion.div>
  );
};

// Component for toggle view mode
const ToggleView = ({ eacoContent, epsoContent, type }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('eaco');
  
  const renderContent = () => {
    const content = activeAlgorithm === 'eaco' ? eacoContent : epsoContent;
    const algorithmName = activeAlgorithm === 'eaco' ? 'EACO' : 'EPSO';
    const algorithmColor = activeAlgorithm === 'eaco' ? 'teal' : 'purple';
    
    if (!content) return <p className="text-gray-500">No data available</p>;
    
    switch (type) {
      case 'overall':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-lg font-bold text-${algorithmColor}-600`}>{algorithmName}</h4>
              <span className={`text-2xl font-bold px-3 py-1 rounded-lg bg-${algorithmColor}-100 text-${algorithmColor}-600`}>
                {content.grade}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{content.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 className="font-medium text-sm text-gray-800 mb-1">Strengths</h5>
                <p className="text-xs text-gray-600">{content.strengths}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <h5 className="font-medium text-sm text-gray-800 mb-1">Improvements</h5>
                <p className="text-xs text-gray-600">{content.weaknesses}</p>
              </div>
            </div>
          </div>
        );
        
      case 'metrics':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(content).map(([metric, interpretation]) => (
              <div key={metric} className={`bg-${algorithmColor}-50 border border-${algorithmColor}-200 rounded-lg p-3`}>
                <h5 className="font-medium text-sm text-gray-800 capitalize mb-1">
                  {metric.replace(/([A-Z])/g, ' $1').trim()}
                </h5>
                <p className="text-xs text-gray-600">{interpretation}</p>
              </div>
            ))}
          </div>
        );
        
      case 'efficiency':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(content).map(([key, value]) => (
              <div key={key} className={`bg-${algorithmColor}-50 border border-${algorithmColor}-200 rounded-lg p-3`}>
                <p className="text-sm font-medium text-gray-800 capitalize mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-xs text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        );
        
      case 'recommendations':
        return (
          <div className="space-y-2">
            {content.map((rec, index) => (
              <div key={index} className={`flex items-start gap-2 bg-${algorithmColor}-50 border border-${algorithmColor}-200 rounded-lg p-2`}>
                <ArrowRight className={`text-${algorithmColor}-600 mt-0.5 flex-shrink-0`} size={14} />
                <p className="text-xs text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveAlgorithm('eaco')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeAlgorithm === 'eaco'
              ? 'bg-[#319694] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          EACO
        </button>
        <button
          onClick={() => setActiveAlgorithm('epso')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeAlgorithm === 'epso'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          EPSO
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

// Component for metric comparison
const MetricComparison = ({ eacoMetrics, epsoMetrics }) => {
  if (!eacoMetrics && !epsoMetrics) return null;
  
  const allMetrics = new Set([
    ...Object.keys(eacoMetrics || {}),
    ...Object.keys(epsoMetrics || {})
  ]);
  
  return (
    <div className="space-y-4">
      {Array.from(allMetrics).map(metric => (
        <div key={metric} className="border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-800 capitalize mb-3">
            {metric.replace(/([A-Z])/g, ' $1').trim()}
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-teal-50 border-l-4 border-teal-400 rounded-lg p-3">
              <span className="text-xs font-semibold text-teal-700">EACO</span>
              <p className="text-xs text-gray-600 mt-1">
                {eacoMetrics?.[metric] || 'No interpretation available'}
              </p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-400 rounded-lg p-3">
              <span className="text-xs font-semibold text-purple-700">EPSO</span>
              <p className="text-xs text-gray-600 mt-1">
                {epsoMetrics?.[metric] || 'No interpretation available'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalysisComparison;