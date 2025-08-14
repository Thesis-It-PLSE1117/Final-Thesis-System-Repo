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
  
  const isEqual = isNegligible;
  const isBetter = isEqual ? 'equal' : (betterWhen === "higher" ? 
    (epsoNum > eacoNum ? 'epso' : 'eaco') : 
    (epsoNum < eacoNum ? 'epso' : 'eaco'));

  /**
   * I only show backend interpretation or basic comparison, no inaccurate placeholders
   */
  const getStatisticalAnalysis = () => {
    // Use backend interpretation if available
    if (hasBackendInterpretation) {
      const interpretation = backendInterpretation.eaco || backendInterpretation.epso;
      const betterAlg = isBetter === 'epso' ? 'EPSO' : 'EACO';
      
      return {
        category: isBetter === 'equal' ? "Equivalent Performance" : `${betterAlg} Superior`,
        interpretation: interpretation,
        confidence: "Analysis based on comprehensive simulation data",
        practical: "See detailed analysis section for specific recommendations",
        icon: isBetter === 'equal' ? <FiMinus className="w-4 h-4" /> : 
              (isBetter === 'epso' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />),
        source: "backend",
        hasData: true
      };
    }
    
    /**
     * I only show basic factual comparison without making up interpretations
     */
    const betterAlg = isBetter === 'epso' ? 'EPSO' : 'EACO';
    const percentageText = absPercentDiff.toFixed(1);
    
    return {
      category: isEqual ? "Equivalent" : `${percentageText}% Difference`,
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

  // Documentation sections
  const docSections = [
    {
      title: "Metric Definition",
      icon: <FiFileText className="w-5 h-5" />,
      content: description
    },
    {
      title: "Statistical Framework",
      icon: <FiBarChart2 className="w-5 h-5" />,
      content: "Differences are categorized as: Negligible (<1%), Marginal (1-5%), Moderate (5-15%), Significant (15-30%), or Substantial (>30%). These thresholds help evaluate practical importance beyond raw numbers."
    },
    {
      title: "Algorithm Comparison",
      icon: <FiCode className="w-5 h-5" />,
      subsections: [
        {
          title: "EACO (Enhanced Ant Colony Optimization)",
          content: "Adaptive ACO with diversity-driven pheromone evaporation, heuristic information combining execution time and resource fit, load-aware reinforcement, and multi-objective fitness."
        },
        {
          title: "EPSO (Enhanced Particle Swarm Optimization)",
          content: "PSO with nonlinear inertia weight decay, adaptive velocity clamping, and multi-objective fitness combining makespan, energy, utilization, and degree of imbalance."
        }
      ]
    },
    {
      title: "Interpretation Guide",
      icon: <FiHelpCircle className="w-5 h-5" />,
      content: betterWhen === "higher" 
        ? "For this metric, higher values indicate superior performance." 
        : "For this metric, lower values indicate superior performance."
    }
  ];

  // Enhanced color scheme with gradient backgrounds
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
      {/* Help button - ISO 9241-11 Usability Standards */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowHelp(!showHelp);
          if (showTooltip) setShowTooltip(false);
        }}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition-all duration-200 z-10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#319694] focus:ring-offset-2"
        aria-label={`Help and documentation for ${title}`}
        aria-expanded={showHelp}
        aria-controls="metric-help-content"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowHelp(!showHelp);
          }
        }}
      >
        <FiBookOpen className="text-gray-600 w-4 h-4" aria-hidden="true" />
      </button>

      {/* Documentation dropdown - WCAG 2.1 AA Compliant */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            id="metric-help-content"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden backdrop-blur-sm"
            role="dialog"
            aria-labelledby="help-dialog-title"
            aria-describedby="help-dialog-description"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowHelp(false);
              }
            }}
          >
            <div className="p-5 max-h-96 overflow-y-auto" role="document">
              <h3 id="help-dialog-title" className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiBookOpen className="text-[#319694]" aria-hidden="true" />
                {title} Documentation
              </h3>
              <p id="help-dialog-description" className="sr-only">
                Detailed documentation and information about {title} metric
              </p>
              
              <div className="space-y-4">
                {docSections.map((section, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="text-[#319694] mt-0.5 flex-shrink-0">{section.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{section.title}</h4>
                        {section.content && (
                          <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                        )}
                        {section.subsections && (
                          <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
                            {section.subsections.map((sub, subIndex) => (
                              <div key={subIndex}>
                                <h5 className="text-sm font-semibold text-[#319694] mb-1">{sub.title}</h5>
                                <p className="text-xs text-gray-500 leading-relaxed">{sub.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                  {eacoNum.toFixed(3)}<span className="text-sm ml-1 font-normal">{unit}</span>
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
              <div className="text-xs text-gray-500 mt-1">
                {betterWhen === "higher" ? "↑ Higher better" : "↓ Lower better"}
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
                  {epsoNum.toFixed(3)}<span className="text-sm ml-1 font-normal">{unit}</span>
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
              className={`w-full flex items-center justify-between p-4 rounded-xl ${colorScheme.primaryBg} ${colorScheme.primaryBorder} border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#319694] focus:ring-offset-2`}
              aria-expanded={isExpanded}
              aria-controls="metric-analysis-content"
              aria-label={`Expand analysis for ${title}: ${analysis.category}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }
              }}
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
                id="metric-analysis-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`${colorScheme.secondaryBg} border-2 ${colorScheme.primaryBorder} border-t-0 rounded-b-xl overflow-hidden`}
                role="region"
                aria-labelledby="analysis-content-title"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="p-4 space-y-3" role="document">
                  {analysis.hasData ? (
                    /**
                     * I show backend interpretation when available
                     */
                    <>
                      <div>
                        <h5 id="analysis-content-title" className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                          Interpretation 
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                            Data-Driven Analysis
                          </span>
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.interpretation}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">Confidence Level</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.confidence}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">Practical Significance</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.practical}</p>
                      </div>
                    </>
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
                          difference observed
                        </span>
                      </div>
                      {analysis.betterAlgorithm && (
                        <p className="text-sm text-gray-700">
                          {analysis.betterAlgorithm} shows {betterWhen === 'lower' ? 'lower' : 'higher'} {title.toLowerCase()}
                        </p>
                      )}
                      <div className="mt-3 text-xs text-gray-500">
                        <p>Based on {absPercentDiff < 1 ? 'negligible' : 
                           absPercentDiff < 5 ? 'marginal' :
                           absPercentDiff < 15 ? 'moderate' :
                           absPercentDiff < 30 ? 'significant' : 'substantial'} difference</p>
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