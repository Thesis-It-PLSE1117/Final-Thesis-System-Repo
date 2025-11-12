import { motion } from "framer-motion";
import {
  Navigation,
  Settings,
  Repeat,
  Play,
  BarChart2,
  Save,
  RotateCcw,
  RotateCw,
  Database,
  Upload,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Zap,
  Clock,
  Info,
  Target,
  Lightbulb,
} from "lucide-react";

const SystemNavigationHelp = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 pb-4 border-b border-gray-200"
      >
        <Navigation className="text-gray-700" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            System Navigation & Features
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Everything you need to navigate the system like a pro.
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
          <Zap className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Getting Started</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          The system walks you through five tabs—each one builds on the last. Complete them in order and you're good to go.
        </p>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">1.</span>
            <span><span className="font-semibold">Data Center</span> - Set up your virtual machines and hosts.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">2.</span>
            <span><span className="font-semibold">Iterations</span> - Decide how many test runs you want.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">3.</span>
            <span><span className="font-semibold">Workload</span> - Upload your tasks and hit run.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">4.</span>
            <span><span className="font-semibold">Saved Results</span> - Check out past runs and their results.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-teal-600">5.</span>
            <span><span className="font-semibold">Help</span> - That's where you are right now.</span>
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
          <Target className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Sweet Spot: 5,000 Tasks</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Want reliable results without waiting too much? Stick to around <span className="font-semibold">5,000 tasks</span>.
        </p>

        <div className="space-y-3">
          <div className="bg-[#e0f7f6] border border-[#319694]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-[#319694] mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="text-md font-bold text-gray-900 mb-1"> <span className="font-semibold text-sm"> Why </span> 5,000?</p>
                <p className="text-sm text-gray-700">
                  This size gives you meaningful statistical insights without overloading the system. 
                  You'll see real performance differences between algorithms, and the simulation finishes 
                  in a reasonable time, usually under this takes time but it's worthwhile.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-gray-700 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Going bigger?</p>
                <p className="text-sm text-gray-700">
                  Online deployments have a 5-minute timeout. If you need to test with 5k+ tasks, 
                  clone the repo and run it locally. That way you can take all the time you need.
                </p>
              </div>
            </div>
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
          <Navigation className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">How the Tabs Work</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Each tab does one thing well. Here's what to expect:
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Data Center Tab</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Build your cloud setup here. You can fill in numbers yourself or pick a preset 
              like <span className="font-semibold">Medium Scale (5,000 tasks)</span> or <span className="font-semibold">Small Scale (1,000 tasks)</span> 
              to start the setup  .
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
              <strong className="font-medium">What you'll find:</strong> Quick presets, manual settings, host and VM configuration.
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Iterations Tab</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Choose between a quick single run or multiple iterations. More iterations means 
              better stats, go with 50 if you want to compare algorithms properly.
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
              <strong className="font-medium">Your options:</strong> Single run (fast comparison) or multiple runs (full statistics).
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Play className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Workload Tab</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Upload a CSV, pick one of our benchmark datasets, or just use the defaults. 
              Once everything's configured, the <span className="font-semibold">Run Simulation</span> button shows up here.
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
              <strong className="font-medium">What happens here:</strong> File uploads, dataset selection, launching simulations.
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Saved Results Tab</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              All your past runs live here. Reload old configs, compare results side-by-side, 
              or export data for your reports. Everything saves automatically after each run.
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
              <strong className="font-medium">What you can do:</strong> View results, reload settings, export data, compare runs.
            </div>
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
          <Save className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Don't Worry About Saving</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          The system saves your work automatically. Close the tab, grab coffee, come back—your setup will be waiting.
        </p>

        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="text-gray-700 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900">Pick up where you left off</p>
                <p className="text-sm text-gray-700 mt-1">
                  Next time you visit, you'll get asked if you want to restore your last configuration. 
                  One click and you're back in business.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Clock className="text-gray-700 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900">Check the bottom-left corner</p>
                <p className="text-sm text-gray-700 mt-1">
                  You'll see when your config was last saved. It happens quietly in the background 
                  while you work.
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
          <div className="flex items-center gap-2">
            <RotateCcw className="text-gray-700" size={20} />
            <RotateCw className="text-gray-700" size={20} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Made a Mistake? No Problem</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Look at the <span className="font-semibold">bottom-right corner</span>. Those undo/redo buttons 
          let you walk backward and forward through your changes.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="text-gray-600" size={16} />
              <span className="text-sm font-medium text-gray-900">Undo</span>
            </div>
            <p className="text-sm text-gray-700">
              Step back to your previous settings. Perfect for when you want to compare different configs.
            </p>
          </div>

          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <RotateCw className="text-gray-600" size={16} />
              <span className="text-sm font-medium text-gray-900">Redo</span>
            </div>
            <p className="text-sm text-gray-700">
              Changed your mind? Redo brings back what you just undid. Simple as that.
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
          <Database className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Skip the Setup with Presets</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Not in the mood to configure everything? We've got ready-made setups you can use right away.
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900">Workload Presets</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Three ready-to-go configurations matched to standard research benchmarks:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="font-bold text-blue-600">•</span>
                <div>
                  <span className="font-semibold text-gray-900">Small Scale</span> - 1,000 tasks for quick algorithm testing
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="font-bold text-purple-600">•</span>
                <div>
                  <span className="font-semibold text-gray-900">Medium Scale</span> - 5,000 tasks for real-world comparison (recommended)
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="font-bold text-orange-600">•</span>
                <div>
                  <span className="font-semibold text-gray-900">Research Scale</span> - 10,000 tasks for comprehensive analysis
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded p-3 mt-3 text-sm text-gray-600">
              <strong className="font-medium">The benefit:</strong> Start testing immediately with optimized infrastructure settings.
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Upload size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900">Custom Workloads</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Drop in a CSV and the system figures out the format. We support Google Cluster data, 
              standard CloudSim format, or just a simple list of task lengths.
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
              <strong className="font-medium">Choose from:</strong> Your own CSV, 10 benchmark datasets, or default synthetic tasks.
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Stuck? Try These Paths</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              situation: "First time here?",
              steps: "Pick Medium Scale preset → Set single iteration → Run → Check results",
              tip: "You'll get meaningful results in under 5 minutes.",
            },
            {
              situation: "Testing your own data?",
              steps: "Configure data center → Upload CSV → Choose task count → Hit run",
              tip: "Double-check your CSV format in the Workload Help tab before uploading.",
            },
            {
              situation: "Need solid statistics?",
              steps: "Pick a preset → Set 50 iterations → Run → Dive into analysis",
              tip: "More iterations = more reliable stats. 30 is the minimum, 50 is better.",
            },
            
          ].map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">{item.situation}</p>
              <p className="text-sm text-gray-700 mt-1">{item.steps}</p>
              <p className="text-sm text-gray-600 mt-1">
                <strong className="font-medium">Pro tip:</strong> {item.tip}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="text-gray-700" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Quick Reference</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            {
              term: "Configuration",
              def: "All your settings in one place—data center, iterations, workload.",
            },
            {
              term: "Preset",
              def: "Pre-built settings that fill in multiple fields at once. Big time-saver.",
            },
            {
              term: "Auto-Save",
              def: "The system saves your work silently while you configure. No save button needed.",
            },
            {
              term: "Saved Results",
              def: "Your archive of past runs. Every simulation result gets stored automatically.",
            },
            {
              term: "Undo/Redo",
              def: "Time travel for your configuration. Go back, go forward, compare settings.",
            },
            {
              term: "Simulation Lifecycle",
              def: "The whole journey: Configure → Run → Watch Animation → Analyze Results.",
            },
          ].map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">{item.term}</p>
              <p className="text-sm text-gray-700 mt-1">{item.def}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-[#e0f7f6] border border-[#319694]/20 rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Info className="text-[#319694]" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Need More Details?</h3>
        </div>
        <p className="text-sm text-gray-700">
          Check out the other help tabs. You'll find deep dives on data center config, 
          workload file formats, the research behind this system, and how to read statistical results. 
          Everything's broken down by topic so you can jump straight to what you need.
        </p>
      </motion.div>
    </div>
  );
};

export default SystemNavigationHelp;
