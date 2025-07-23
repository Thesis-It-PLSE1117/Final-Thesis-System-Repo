import React, { useState, useEffect } from 'react';
import { Activity, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getMatlabStatus } from '../../services/testService';

const MatlabToggle = ({ enabled, onChange }) => {
  const [matlabStatus, setMatlabStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only check status when MATLAB is enabled
    if (enabled) {
      checkMatlabStatus();
    } else {
      setMatlabStatus(null);
    }
  }, [enabled]);

  const checkMatlabStatus = async () => {
    try {
      setLoading(true);
      const response = await getMatlabStatus();
      setMatlabStatus(response.data);
    } catch (error) {
      console.error('Failed to check MATLAB status:', error);
      setMatlabStatus({ matlabAvailable: false, engineReady: false });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading && !matlabStatus) {
      return <Loader2 className="animate-spin text-gray-500" size={16} />;
    }
    if (matlabStatus?.engineReady) {
      return <CheckCircle className="text-green-500" size={16} />;
    }
    if (matlabStatus && !matlabStatus.engineReady) {
      return <Loader2 className="animate-spin text-orange-500" size={16} />;
    }
    return null;
  };

  const getStatusText = () => {
    if (loading && !matlabStatus) {
      return 'Checking status...';
    }
    if (matlabStatus?.message) {
      return matlabStatus.message;
    }
    if (matlabStatus?.engineReady) {
      return 'Engine ready';
    }
    if (matlabStatus && !matlabStatus.engineReady) {
      return 'Engine initializing...';
    }
    if (matlabStatus && !matlabStatus.matlabAvailable) {
      return 'MATLAB not available';
    }
    return '';
  };
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-[#319694]" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">MATLAB Visualization</h3>
            <p className="text-sm text-gray-600">
              Enable advanced plots and charts using MATLAB engine
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#319694]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#319694]"></div>
        </label>
      </div>
      {enabled && (
        <div className="mt-3 space-y-2">
          {/* Status indicator */}
          {(matlabStatus || loading) && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              {getStatusIcon()}
              <span className="text-sm text-gray-700">
                {getStatusText()}
              </span>
            </div>
          )}
          {/* Note about initialization */}
          {(!matlabStatus || !matlabStatus.engineReady) && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> MATLAB engine may take a few seconds to initialize on first use.
              </p>
            </div>
          )}
          {/* Error message if MATLAB not available */}
          {matlabStatus && !matlabStatus.matlabAvailable && (
            <div className="p-3 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> MATLAB integration is not available. Please ensure MATLAB is installed and configured.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatlabToggle;
