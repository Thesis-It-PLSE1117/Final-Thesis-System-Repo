import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiZap, FiServer, FiCheckCircle } from 'react-icons/fi';

const MetricCard = ({ title, description, eacoValue, epsoValue, unit, betterWhen, icon: Icon }) => {
  // Ensure values are numbers
  const eacoNum = parseFloat(eacoValue) || 0;
  const epsoNum = parseFloat(epsoValue) || 0;
  
  const difference = epsoNum - eacoNum;
  const percentDiff = eacoNum !== 0 ? (difference / eacoNum) * 100 : 0;
  const absPercentDiff = Math.abs(percentDiff);
  
  const isBetter = betterWhen === "higher" 
    ? epsoNum > eacoNum 
    : epsoNum < eacoNum;
  
  const comparisonResult = isBetter ? "better" : "worse";
  const improvementText = `${absPercentDiff.toFixed(1)}% ${comparisonResult}`;
  
  // Verbal interpretation based on performance difference
  const getInterpretation = () => {
    if (absPercentDiff < 5) return "Nearly identical performance";
    if (absPercentDiff < 15) return isBetter ? "Moderate improvement" : "Slight disadvantage";
    if (absPercentDiff < 30) return isBetter ? "Significant improvement" : "Noticeable drawback";
    return isBetter ? "Dramatically better" : "Substantially worse";
  };

  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5
          }
        }
      }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start mb-3">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-4 rounded-lg border ${
            !isBetter ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100" : "bg-blue-50 border-blue-100"
          }`}>
            <div className="text-sm font-medium mb-1 text-blue-600">EACO</div>
            <div className="text-2xl font-bold text-blue-800">
              {eacoNum.toFixed(2)}{unit}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            isBetter ? "bg-pink-50 border-pink-200 ring-2 ring-pink-100" : "bg-pink-50 border-pink-100"
          }`}>
            <div className="text-sm font-medium mb-1 text-pink-600">EPSO</div>
            <div className="text-2xl font-bold text-pink-800">
              {epsoNum.toFixed(2)}{unit}
            </div>
          </div>
        </div>
        
        {/* Enhanced comparison section */}
        <div className={`mt-3 p-3 rounded-lg ${
          isBetter ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          <div className="flex items-center">
            <div className={`mr-3 p-2 rounded-full ${
              isBetter ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              {isBetter ? (
                <FiCheckCircle size={18} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {getInterpretation()}
              </div>
              <div className={`text-xs font-semibold ${
                isBetter ? "text-green-600" : "text-red-600"
              }`}>
                EPSO is {improvementText} than EACO
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional visual indicator */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Performance difference:</span>
          <span className={`font-medium ${
            isBetter ? "text-green-600" : "text-red-600"
          }`}>
            {difference > 0 ? '+' : ''}{difference.toFixed(2)}{unit}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;