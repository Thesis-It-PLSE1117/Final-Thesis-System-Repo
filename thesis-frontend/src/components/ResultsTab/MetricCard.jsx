import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  FiActivity, 
  FiClock, 
  FiZap, 
  FiServer, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiBookOpen,
  FiFileText,
  FiCpu,
  FiCode,
  FiBarChart2,
  FiHelpCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus
} from 'react-icons/fi';
import { ArrowUp, ArrowDown } from 'lucide-react';

const MetricCard = ({ title, description, eacoValue, epsoValue, unit, betterWhen, icon: Icon, backendInterpretation }) => {
  /**
   * I maintain separate state for each card's dropdown
   * Each MetricCard instance has its own state
   */
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  /**
   * I check if backend interpretation is available, otherwise use frontend logic
   */
  const hasBackendInterpretation = backendInterpretation?.eaco || backendInterpretation?.epso;
  
  // Process values with better precision handling
  const eacoNum = parseFloat(eacoValue) || 0;
  const epsoNum = parseFloat(epsoValue) || 0;
  
  const difference = epsoNum - eacoNum;
  const percentDiff = eacoNum !== 0 ? (difference / eacoNum) * 100 : 0;
  const absPercentDiff = Math.abs(percentDiff);
  
  // Statistical significance thresholds
     const isNegligible = absPercentDiff < 1;
   const isMarginal = absPercentDiff >= 1 && absPercentDiff < 5;
   const isModerate = absPercentDiff >= 5 && absPercentDiff < 15;
   const isSignificant = absPercentDiff >= 15 && absPercentDiff < 30;
   const isSubstantial = absPercentDiff >= 30;
   
   // Enhanced significance indicators
   const getSignificanceLevel = () => {
     if (isNegligible) return { level: 'Negligible', color: 'gray', icon: 'minus' };
     if (isMarginal) return { level: 'Marginal', color: 'yellow', icon: 'info' };
     if (isModerate) return { level: 'Moderate', color: 'orange', icon: 'trending-up' };
     if (isSignificant) return { level: 'Significant', color: 'red', icon: 'alert-triangle' };
     if (isSubstantial) return { level: 'Substantial', color: 'purple', icon: 'zap' };
     return { level: 'Unknown', color: 'gray', icon: 'help-circle' };
   };
  
  const isEqual = isNegligible;
  const isBetter = isEqual ? 'equal' : (betterWhen === "higher" ? 
    (epsoNum > eacoNum ? 'epso' : 'eaco') : 
    (epsoNum < eacoNum ? 'epso' : 'eaco'));

  /**
   * I only show backend interpretation or basic comparison so no inaccurate 
   */
  const getStatisticalAnalysis = () => {
    if (hasBackendInterpretation) {
      const eacoInterpretation = backendInterpretation.eaco || '';
      const epsoInterpretation = backendInterpretation.epso || '';
      
      // Extract key insights from interpretations
      const extractValue = (text) => {
        const match = text.match(/(\d+\.?\d*)\s*(seconds?|%|Wh|units?)/i);
        return match ? `${match[1]}${match[2]}` : null;
      };
      
      const extractAssessment = (text) => {
        const assessments = ['excellent', 'good', 'moderate', 'poor', 'needs improvement'];
        const lowerText = text.toLowerCase();
        for (const assessment of assessments) {
          if (lowerText.includes(assessment)) {
            return assessment;
          }
        }
        return null;
      };
      
      let userFriendlyInterpretation = '';
      
      if (eacoInterpretation && epsoInterpretation) {
        const eacoValue = extractValue(eacoInterpretation);
        const epsoValue = extractValue(epsoInterpretation);
        const eacoAssessment = extractAssessment(eacoInterpretation);
        const epsoAssessment = extractAssessment(epsoInterpretation);
        
        // Build consistent comparison format
        if (eacoValue && epsoValue) {
          userFriendlyInterpretation = `${title}: EACO (${eacoValue}) vs EPSO (${epsoValue})`;
        } else {
          userFriendlyInterpretation = `${title}: Comparison available`;
        }
        
        // Add consistent assessment format
        if (eacoAssessment && epsoAssessment) {
          if (eacoAssessment === epsoAssessment) {
            userFriendlyInterpretation += `. Both algorithms show ${eacoAssessment} performance`;
          } else {
            userFriendlyInterpretation += `. EACO: ${eacoAssessment}, EPSO: ${epsoAssessment}`;
          }
        }
        
        // Add consistent performance difference format
        if (!isEqual) {
          userFriendlyInterpretation += `. ${isBetter === 'epso' ? 'EPSO' : 'EACO'} performs ${absPercentDiff.toFixed(1)}% better`;
        }
        
        // Ensure consistent ending punctuation
        userFriendlyInterpretation += '.';
      } else {
        // Fallback to single interpretation with consistent formatting
        const singleInterpretation = eacoInterpretation || epsoInterpretation;
        userFriendlyInterpretation = singleInterpretation || `${title}: Analysis available`;
      }
      
      const betterAlg = isBetter === 'epso' ? 'EPSO' : 'EACO';
      
             return {
         category: isBetter === 'equal' ? "Equivalent Performance" : `${betterAlg} Superior`,
         interpretation: userFriendlyInterpretation,
         confidence: `Analysis based on ${backendInterpretation.eaco ? 'EACO' : ''}${backendInterpretation.eaco && backendInterpretation.epso ? ' and ' : ''}${backendInterpretation.epso ? 'EPSO' : ''} simulation data`,
         practical: `See detailed analysis for ${backendInterpretation.eaco ? 'EACO' : 'EPSO'} recommendations`,
         icon: isBetter === 'equal' ? <FiMinus className="w-4 h-4" /> : 
               (isBetter === 'epso' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />),
         source: "backend",
         hasData: true
       };
    }
    
    /**
     * I only show basic factual comparison
     */
    const betterAlg = isBetter === 'epso' ? 'EPSO' : 'EACO';
    const percentageText = absPercentDiff.toFixed(1);
    
    return {
      category: isEqual ? "Equivalent Performance" : `${percentageText}% Difference`,
      interpretation: null,
      showBasicComparison: true,
      betterAlgorithm: isEqual ? null : betterAlg,
      percentage: percentageText,
      icon: isEqual ? <FiMinus className="w-4 h-4" /> : 
            (isBetter === 'epso' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />),
      source: "comparison",
      hasData: false
    };
  };

  const analysis = getStatisticalAnalysis();

  const docSections = [
    {
      title: "About This Metric",
      icon: <FiFileText className="w-5 h-5" />,
      content: `${description} ${betterWhen === "higher" ? "Higher values are better." : "Lower values are better."}`
    },
    {
      title: "Reading Results",
      icon: <FiBarChart2 className="w-5 h-5" />,
      content: "Focus on the percentage difference and which algorithm performs better. Larger differences indicate more significant performance gaps."
    }
  ];

  const getColorScheme = () => {
    if (isEqual) return {
      primaryBg: 'bg-gradient-to-br from-slate-50 to-gray-50',
      primaryBorder: 'border-slate-200',
      primaryText: 'text-slate-700',
      secondaryBg: 'bg-slate-100',
      highlight: 'slate',
      barColor: 'bg-gradient-to-r from-slate-400 to-slate-500',
      shadow: 'shadow-slate-100'
    };

    if (isBetter === 'epso') return {
      primaryBg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      primaryBorder: 'border-emerald-200',
      primaryText: 'text-emerald-800',
      secondaryBg: 'bg-emerald-100',
      highlight: 'emerald',
      barColor: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
      shadow: 'shadow-emerald-100'
    };

    return {
      primaryBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      primaryBorder: 'border-blue-200',
      primaryText: 'text-blue-800',
      secondaryBg: 'bg-blue-100',
      highlight: 'blue',
      barColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
      shadow: 'shadow-blue-100'
    };
  };

  const colorScheme = getColorScheme();

  /**
   * I only show tooltip when we have real backend data
   */
  const StatisticalTooltip = () => (
    <AnimatePresence>
      {showTooltip && analysis.hasData && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-30"
          role="tooltip"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              {analysis.icon}
              <h4 className="font-semibold text-gray-800">{analysis.category}</h4>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Statistical Interpretation</h5>
              <p className="text-sm text-gray-600">{analysis.interpretation}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Confidence Level</h5>
              <p className="text-sm text-gray-600">{analysis.confidence}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Practical Implication</h5>
              <p className="text-sm text-gray-600">{analysis.practical}</p>
            </div>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      variants={{
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        }
      }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col h-full relative backdrop-blur-sm ${colorScheme.shadow}`}
    >
             {/* Help button - Modern styling */}
       <button 
         onClick={(e) => {
           e.stopPropagation();
           setShowHelp(!showHelp);
           if (showTooltip) setShowTooltip(false);
         }}
         className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 z-10 ${
           showHelp 
             ? 'bg-[#319694] text-white shadow-lg' 
             : 'bg-white/90 hover:bg-white text-gray-600 hover:text-[#319694] shadow-md hover:shadow-lg'
         } backdrop-blur-sm`}
         title="View documentation"
       >
         <FiBookOpen className="w-4 h-4" aria-hidden="true" />
       </button>

                           {/* Documentation dropdown - Clean and Modern UI */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              id="metric-help-content"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden backdrop-blur-sm"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#319694] to-[#4fd1c5] p-4 text-white">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="w-5 h-5" />
                  <h3 className="font-bold text-lg">{title}</h3>
                </div>
                <p className="text-sm text-white/90 mt-1">Quick Reference Guide</p>
              </div>
              
              {/* Content */}
              <div className="p-4 max-h-80 overflow-y-auto" role="document">
                <div className="space-y-4">
                  {docSections.map((section, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-[#319694]/10 rounded-lg group-hover:bg-[#319694]/20 transition-colors">
                          <div className="text-[#319694]">{section.icon}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">{section.title}</h4>
                          {section.content && (
                            <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                          )}
                        </div>
                      </div>
                      {index < docSections.length - 1 && (
                        <div className="h-px bg-gray-100 mx-3"></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Click outside to close
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      <div className="p-6 flex flex-col h-full">
        {/* Header section with enhanced styling */}
        <div className="flex items-start mb-6">
          <div className="p-3 bg-gradient-to-br from-[#319694]/10 to-[#319694]/20 rounded-xl mr-4 shadow-sm">
            <Icon size={28} className="text-[#319694]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
        
        {/* Enhanced comparison visualization */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* EACO Column */}
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-700 mb-3">EACO</div>
              <div className="relative">
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className={`h-full ${isBetter === 'eaco' ? colorScheme.barColor : 'bg-gray-400'} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <div className={`font-bold mt-3 text-xl ${isBetter === 'eaco' ? 'text-gray-800' : 'text-gray-600'}`}>
                  {eacoNum.toFixed(2)}<span className="text-sm ml-1 font-normal">{unit === 'seconds' ? 'secs' : unit}</span>
                </div>
              </div>
            </div>
            
                         {/* Comparison indicator */}
             <div className="text-center relative">
               <div className="text-xs text-gray-500 mb-2">Difference</div>
               <motion.div 
                 className={`inline-block px-3 py-2 rounded-xl text-sm font-bold ${colorScheme.primaryBg} ${colorScheme.primaryBorder} border shadow-sm`}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 0.5, delay: 0.5 }}
               >
                 {absPercentDiff.toFixed(1)}%
               </motion.div>
               {(() => {
                 const significance = getSignificanceLevel();
                 return (
                   <div className={`text-xs mt-1 px-2 py-1 rounded-full font-medium ${
                     significance.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                     significance.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                     significance.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                     significance.color === 'red' ? 'bg-red-100 text-red-700' :
                     significance.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                     'bg-gray-100 text-gray-600'
                   }`}>
                     {significance.level}
                   </div>
                 );
               })()}
               <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                 {betterWhen === "higher" ? (
                   <><ArrowUp size={12} /> Higher better</>
                 ) : (
                   <><ArrowDown size={12} /> Lower better</>
                 )}
               </div>
             </div>
            
            {/* EPSO Column */}
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-700 mb-3">EPSO</div>
              <div className="relative">
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className={`h-full ${isBetter === 'epso' ? colorScheme.barColor : 'bg-gray-400'} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${isEqual ? 100 : Math.min(100, (epsoNum / Math.max(eacoNum, epsoNum)) * 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <div className={`font-bold mt-3 text-xl ${isBetter === 'epso' ? 'text-gray-800' : 'text-gray-600'}`}>
                  {epsoNum.toFixed(2)}<span className="text-sm ml-1 font-normal">{unit === 'seconds' ? 'secs' : unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced analysis section */}
        <div className="mt-auto relative">
          <div
            onMouseEnter={() => {
              setShowTooltip(true);
              // Debounce tooltip 
              if (showHelp) setShowHelp(false);
            }}
            onMouseLeave={() => setShowTooltip(false)}
            className="cursor-help"
            role="region"
            aria-label="Statistical analysis section"
          >
                         <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setIsExpanded(!isExpanded);
                 // Close tooltip when expanding for clarity 
                 if (showTooltip) setShowTooltip(false);
               }}
               className={`w-full flex items-center justify-between p-4 rounded-xl ${colorScheme.primaryBg} ${colorScheme.primaryBorder} border-2 transition-all duration-200 hover:shadow-md`}
             >
              <div className="flex items-center text-left">
                <span className="mr-3 p-1 rounded-lg bg-white/60">{analysis.icon}</span>
                <div>
                  <span className={`font-bold ${colorScheme.primaryText}`}>{analysis.category}</span>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {analysis.hasData ? 'Click for detailed analysis' : 'Click to see comparison'}
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown className={colorScheme.primaryText} />
              </motion.div>
            </button>
          </div>

          <StatisticalTooltip />
          
          <AnimatePresence>
            {isExpanded && (
                             <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 transition={{ duration: 0.3 }}
                 className={`${colorScheme.secondaryBg} border-2 ${colorScheme.primaryBorder} border-t-0 rounded-b-xl overflow-hidden`}
               >
                <div className="p-4 space-y-3" role="document">
                  {analysis.hasData ? (
                    /**
                     * I show backend interpretation when available
                     */
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Analysis</h5>
                      <p className="text-sm text-gray-700 leading-relaxed">{analysis.interpretation}</p>
                    </div>
                  ) : (
                    /**
                     * I show only factual comparison data when backend hasn't sent interpretation yet
                     */
                                         <div className="text-center py-4">
                       <div className="mb-3">
                         <span className="text-2xl font-bold text-gray-800">
                           {analysis.percentage}%
                         </span>
                         <span className="text-sm text-gray-600 ml-2">
                           difference
                         </span>
                       </div>
                       {analysis.betterAlgorithm && (
                         <p className="text-sm text-gray-700 mb-3">
                           {analysis.betterAlgorithm} performs better
                         </p>
                       )}
                       <div className="mt-3">
                         {(() => {
                           const significance = getSignificanceLevel();
                           return (
                             <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                               significance.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                               significance.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                               significance.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                               significance.color === 'red' ? 'bg-red-100 text-red-700' :
                               significance.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                               'bg-gray-100 text-gray-600'
                             }`}>
                               {significance.level} difference
                             </div>
                           );
                         })()}
                       </div>
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;