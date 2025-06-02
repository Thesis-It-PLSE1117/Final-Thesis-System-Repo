import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiZap, FiServer, FiLayers, FiCheckCircle } from 'react-icons/fi';

const MetricCard = ({ title, description, eacoValue, epsoValue, unit, betterWhen, icon: Icon }) => {
  const difference = epsoValue - eacoValue;
  const percentDiff = eacoValue !== 0 ? (difference / eacoValue) * 100 : 0;
  const absPercentDiff = Math.abs(percentDiff);
  
  const isBetter = betterWhen === "higher" 
    ? epsoValue > eacoValue 
    : epsoValue < eacoValue;
  
  const comparisonResult = isBetter ? "better" : "worse";
  const improvementText = `${absPercentDiff.toFixed(1)}% ${comparisonResult}`;
  
  const getInterpretation = () => {
    if (absPercentDiff < 5) return "Nearly identical";
    if (absPercentDiff < 15) return isBetter ? "Moderate improvement" : "Slight disadvantage";
    if (absPercentDiff < 30) return isBetter ? "Significant improvement" : "Noticeable drawback";
    return isBetter ? "Dramatically better" : "Substantially worse";
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-200 h-full flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start mb-4">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
            <Icon size={20} className="opacity-90" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        
        {/* Values */}
        <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
          <div className={`p-3 rounded-lg border ${
            !isBetter ? "border-blue-200 bg-blue-50/80 ring-1 ring-blue-100" : "border-blue-100 bg-blue-50/50"
          } flex flex-col`}>
            <div className="text-xs font-medium text-blue-600 mb-1">Enhanced ACO</div>
            <div className="text-xl font-bold text-blue-800">
              {eacoValue.toFixed(2)}<span className="text-sm ml-0.5">{unit}</span>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            isBetter ? "border-pink-200 bg-pink-50/80 ring-1 ring-pink-100" : "border-pink-100 bg-pink-50/50"
          } flex flex-col`}>
            <div className="text-xs font-medium text-pink-600 mb-1">EPSO</div>
            <div className="text-xl font-bold text-pink-800">
              {epsoValue.toFixed(2)}<span className="text-sm ml-0.5">{unit}</span>
            </div>
          </div>
        </div>
        
        {/* Comparison */}
        <div className={`mt-auto p-3 rounded-lg ${
          isBetter ? "bg-green-50/80 border border-green-200" : "bg-red-50/80 border border-red-200"
        }`}>
          <div className="flex items-center">
            <div className={`p-1.5 rounded-md ${
              isBetter ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            } flex-shrink-0`}>
              {isBetter ? (
                <FiCheckCircle size={16} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </div>
            <div className="ml-2">
              <div className="text-xs font-medium text-gray-700">
                {getInterpretation()}
              </div>
              <div className={`text-xs font-semibold mt-0.5 ${
                isBetter ? "text-green-600" : "text-red-600"
              }`}>
                {improvementText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;