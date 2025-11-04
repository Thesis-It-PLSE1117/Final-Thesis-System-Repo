import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  BarChart2,
  TrendingUp,
  Eye,
  FileText,
  Download,
  Activity,
  Zap,
  Info,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

const AnimationResultsHelp = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 pb-4 border-b border-gray-200"
      >
        <Activity className="text-gray-700" size={28} />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Animation & Results Guide
          </h2>
          <p className="text-base text-gray-700 mt-1">
            Understanding what happens after you hit run.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-gray-700" size={22} />
          <h3 className="text-xl font-medium text-gray-900">Quick Overview</h3>
        </div>
        <p className="text-base text-gray-700 mb-3">
          After running a simulation, you'll move through three stages:
        </p>
        <div className="space-y-2 text-base text-gray-700">
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">1.</span>
            <span><span className="font-semibold">Processing</span> - The system runs your simulation in the background.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">2.</span>
            <span><span className="font-semibold">Animation</span> - Watch how tasks get distributed across VMs.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">3.</span>
            <span><span className="font-semibold">Results</span> - Dive into metrics, statistics, and comparisons.</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="text-gray-700" size={22} />
          <h3 className="text-xl font-medium text-gray-900">Key Terms</h3>
        </div>
        <p className="text-base text-gray-600 mb-4">
          The animation shows you how both algorithms (EACO and EPSO) distribute tasks across your VMs in real-time.
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">What You're Seeing</span>
            </div>
            <p className="text-base text-gray-700 mb-3">
              Each VM card shows its workload in real-time. Darker colors mean higher CPU usage. 
              The number on each card tells you how many tasks that VM is handling.
            </p>
            <div className="bg-gray-50 rounded p-3 text-base text-gray-600">
              <strong className="font-medium">Look for:</strong> Uneven distribution means load imbalance—some VMs working harder than others
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">Control the Playback</span>
            </div>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex items-start gap-2">
                <Play size={14} className="mt-0.5 flex-shrink-0 text-gray-600" />
                <div>
                  <span className="font-semibold">Play/Pause</span> - Start or stop the animation to study the distribution.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RotateCcw size={14} className="mt-0.5 flex-shrink-0 text-gray-600" />
                <div>
                  <span className="font-semibold">Reset</span> - Watch it again from the beginning.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp size={14} className="mt-0.5 flex-shrink-0 text-gray-600" />
                <div>
                  <span className="font-semibold">Switch Algorithms</span> - Toggle between EACO and EPSO views to compare.
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">Live Metrics Panel</span>
            </div>
            <p className="text-base text-gray-700">
              While the animation runs, watch the metrics panel for real-time stats: 
              <span className="font-semibold"> Imbalance</span>, <span className="font-semibold">Makespan</span>, 
              and <span className="font-semibold">Utilization</span>. Lower imbalance and makespan mean better performance.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="text-gray-700" size={22} />
          <h3 className="text-xl font-medium text-gray-900">Reading the Results</h3>
        </div>
        <p className="text-base text-gray-600 mb-4">
          After the animation, you get the full picture. Results are organized into tabs for easy exploration.
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">Metadata Tab</span>
            </div>
            <p className="text-base text-gray-700 mb-2">
              Shows your configuration details: how many VMs, hosts, tasks, and iterations you ran. 
              Useful for documenting your experiments.
            </p>
            <div className="bg-gray-50 rounded p-3 text-base text-gray-600">
              <strong className="font-medium">What's here:</strong> Timestamp, configuration summary, execution time
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">Analysis Tab</span>
            </div>
            <p className="text-base text-gray-700 mb-3">
              This is where the magic happens. You'll see:
            </p>
            <div className="space-y-2 text-base">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#319694]" />
                <div>
                  <span className="font-semibold text-gray-900">Single Iteration:</span> Direct comparison of EACO vs EPSO with interpretations per metric.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#319694]" />
                <div>
                  <span className="font-semibold text-gray-900">Multiple Iterations:</span> Statistical tests that tell you which algorithm actually performs better.
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">Visualizations Tab</span>
            </div>
            <p className="text-base text-gray-700 mb-2">
              Charts and plots that show performance patterns. You'll see CPU usage, response times, 
              and task distribution visualized for easy understanding.
            </p>
            <div className="bg-gray-50 rounded p-3 text-base text-gray-600">
              <strong className="font-medium">Note:</strong> Only available when running single iterations or if MATLAB plots are enabled
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-gray-600" size={20} />
              <span className="font-medium text-base text-gray-900">Logs Tab</span>
            </div>
            <p className="text-base text-gray-700">
              Detailed execution logs for both algorithms. See exactly which task went to which VM, 
              response times, and completion order. Great for debugging or detailed analysis.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="text-gray-700" size={22} />
          <h3 className="text-xl font-medium text-gray-900">What Do the Stats Actually Mean?</h3>
        </div>
        <p className="text-base text-gray-600 mb-4">
          When you run multiple iterations, you get statistical tests. Here's what they're telling you:
        </p>

        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <BarChart2 className="text-gray-700 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-base font-medium text-gray-900 mb-1">Paired T-Test</p>
                <p className="text-base text-gray-700">
                  Compares the two algorithms directly. If the <span className="font-semibold">p-value is below 0.05</span>, 
                  the difference is real, not just random chance. Check which algorithm has the better mean.
                </p>
              </div>
            </div>
          </div>

          

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="text-gray-700 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-base font-medium text-gray-900 mb-1">Normality Test</p>
                <p className="text-base text-gray-700">
                  Checks if your data follows a bell curve. If it does, the T-test is trustworthy. 
                  If not, rely on other test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Download className="text-gray-700" size={22} />
          <h3 className="text-xl font-medium text-gray-900">Exporting Your Results</h3>
        </div>
        <p className="text-base text-gray-600 mb-4">
          Need to save your data? You've got options:
        </p>

        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-base font-medium text-gray-900 mb-1">From the <span className="font-semibold"> Results Page </span> </p>
            <p className="text-base text-gray-700">
              Look for export buttons in the <span className="font-semibold">Analysis tab</span>. 
              You can download data per-iteration  as CSV for further analysis in Excel or other tools.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-base font-medium text-gray-900 mb-1"> From <span className="font-semibold"> Simulation History Tab </span> </p>
            <p className="text-base text-gray-700">
              Click on any past result and use the export option to save complete simulation data, 
              including configuration and outcomes.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="text-gray-700" size={22} />
          <h3 className="text-xl font-medium text-gray-900">Confused by the Numbers?</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              problem: "Animation looks frozen",
              solution: "Hit the reset button and play again. The animation runs for 10 seconds, if you miss it, just replay.",
              action: "Use the reset button in the controls panel.",
            },
            {
              problem: "Can't tell which algorithm is better",
              solution: "Look at the Analysis tab. For single runs, compare the metric cards and read the provided interpretations directly. For multiple iterations, check the p-values.",
              action: "P-value < 0.05 = significant difference.",
            },
            {
              problem: "Visualizations tab is missing",
              solution: "This tab only shows up for single iterations. If you ran multiple iterations, you won't see it.",
              action: "Run a single iteration to access interactive charts.",
            },
            {
              problem: "Results seem inconsistent",
              solution: "Single runs can vary. That's why multiple iterations exist, they average out random fluctuations and give you reliable stats.",
              action: "Run 30+ iterations for consistent comparisons, us recommend 50 iteration.",
            },
          ].map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3">
              <p className="text-base font-medium text-gray-900">{item.problem}</p>
              <p className="text-base text-gray-700 mt-1">{item.solution}</p>
              <p className="text-base text-gray-600 mt-1">
                <strong className="font-medium">Quick fix:</strong> {item.action}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-[#e0f7f6] border border-[#319694]/20 rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Info className="text-[#319694]" size={20} />
          <h3 className="text-xl font-medium text-gray-900">Pro Tip</h3>
        </div>
        <p className="text-base text-gray-700">
          After viewing results, head to the <span className="font-semibold">History tab</span> to see all your past runs. 
          You can compare different configurations side-by-side, reload settings to rerun tests, 
          or export data for reports. Every simulation gets saved automatically—nothing gets lost.
        </p>
      </motion.div>
    </div>
  );
};

export default AnimationResultsHelp;
