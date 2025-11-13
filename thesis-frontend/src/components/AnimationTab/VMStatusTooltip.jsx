import { motion } from "framer-motion";
import { AlertCircle, Zap, Activity, CheckCircle, Moon, Circle } from "lucide-react";

const STATUS_CONFIG = [
  {
    key: 'overloaded',
    label: 'Overloaded',
    icon: AlertCircle,
    color: '#ef4444'
  },
  {
    key: 'highLoad',
    label: 'High Load',
    icon: Zap,
    color: '#f97316'
  },
  {
    key: 'mediumLoad',
    label: 'Medium Load',
    icon: Activity,
    color: '#eab308'
  },
  {
    key: 'normal',
    label: 'Normal',
    icon: CheckCircle,
    color: '#3b82f6'
  },
  {
    key: 'lowLoad',
    label: 'Low Load',
    icon: Moon,
    color: '#10b981'
  },
  {
    key: 'idle',
    label: 'Idle',
    icon: Circle,
    color: '#6b7280'
  }
];

const VMStatusTooltip = ({ distribution, algorithm = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute z-50 right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4"
      role="tooltip"
      aria-live="polite"
    >
      <h4 className="text-sm font-semibold mb-3 text-gray-800">
        VM Status Distribution
        {algorithm && algorithm !== "comparison" && (
          <span className="text-gray-500 ml-1">({algorithm})</span>
        )}
      </h4>

      <div className="space-y-2">
        {STATUS_CONFIG.map(({ key, label, icon: Icon, color }) => (
          <StatusRow
            key={key}
            label={label}
            count={distribution[key] || 0}
            icon={Icon}
            color={color}
          />
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-600">Total Active:</span>
          <span className="font-bold text-gray-900">{distribution.total || 0} VMs</span>
        </div>
      </div>

      <div className="absolute top-0 right-6 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-white border-t border-l border-gray-200" />
    </motion.div>
  );
};

const StatusRow = ({ label, count, icon: Icon, color }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2">
      <Icon size={16} style={{ color }} className="flex-shrink-0" />
      <span className="text-sm text-gray-700">{label}:</span>
    </div>
    <span className="text-sm font-semibold text-gray-900 tabular-nums">{count}</span>
  </div>
);

export default VMStatusTooltip;
