import React from 'react';
import { BarChart3, Activity, CheckCircle } from 'lucide-react';
import { formatPValue } from '../../utils/pValueFormatter';

const MetricInterpretations = ({ data }) => {
  if (!data) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">No interpretation data available</p>
      </div>
    );
  }

  const formatInterpretationText = (text) => {
    if (!text) return text;
    return text.replace(/p=([0-9.]+)/g, (match, pValueStr) => {
      const pValue = parseFloat(pValueStr);
      return `p=${formatPValue(pValue)}`;
    });
  };

  const formattedMeanInterpretation = formatInterpretationText(data.meanInterpretation);
  const formattedStdInterpretation = formatInterpretationText(data.stdInterpretation);

  return (
    <div className="mt-4 space-y-3">
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-3 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-start gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Mean Interpretation</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
              {formattedMeanInterpretation?.split('. ').join('.\n') || 'No interpretation available'}
            </p>
            {data.significant && (
              <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Significant (p={formatPValue(data.pValue)})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-400">
        <div className="flex items-start gap-2">
          <Activity className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Consistency Analysis</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
              {formattedStdInterpretation?.split('. ').join('.\n') || 'Consistency data not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricInterpretations;
