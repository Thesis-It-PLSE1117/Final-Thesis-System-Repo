import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Info, CheckCircle, AlertTriangle, Layers, Target, ChevronDown } from "lucide-react";
import { useState } from "react";

const StatisticalMethodology = () => {
  const [expandedSection, setExpandedSection] = useState('ttest');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Layers className="text-gray-700 mt-1" size={24} />
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Overview</h2>
            <p className="text-gray-700 mb-4">
              Statistical validation of algorithm performance differences with 95% confidence using paired T-test methodology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 max-w-md">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-900">Paired T-Test</span>
                </div>
                <p className="text-sm text-gray-600">Parametric • Assumes normality • Compares means</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paired T-Test Section */}
      <section className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('ttest')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp className="text-gray-700" size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900">Paired T-Test</h3>
              <p className="text-sm text-gray-600">Parametric method comparing mean differences</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expandedSection === 'ttest' ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="text-gray-400" size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedSection === 'ttest' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="p-6 space-y-8">
                {/* Purpose */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Purpose</h4>
                  <p className="text-gray-700">
                    Determines whether the <strong className="font-semibold">mean difference</strong> between paired algorithm runs 
                    is statistically significant. Assumes differences follow a normal distribution.
                  </p>
                </div>

                {/* Test Statistic */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={20} className="text-gray-700" />
                    <h4 className="font-medium text-gray-900">Test Statistic</h4>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="font-mono text-xl font-medium text-gray-900 mb-6 text-center">
                      t = d̄ / (Sd / √n)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3 bg-white rounded border">
                        <span className="font-medium text-gray-900">d̄</span>
                        <span className="text-gray-700 text-sm">Mean difference (EACO - EPSO)</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded border">
                        <span className="font-medium text-gray-900">Sd</span>
                        <span className="text-gray-700 text-sm">Standard deviation of differences</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded border">
                        <span className="font-medium text-gray-900">n</span>
                        <span className="text-gray-700 text-sm">Number of paired observations</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded border">
                        <span className="font-medium text-gray-900">df</span>
                        <span className="text-gray-700 text-sm">Degrees of freedom (n - 1)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assumptions */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Assumptions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <CheckCircle size={20} className="text-gray-700 mb-2" />
                      <p className="font-medium text-gray-900 mb-1">Independence</p>
                      <p className="text-sm text-gray-600">Pairs are independent across iterations</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <CheckCircle size={20} className="text-gray-700 mb-2" />
                      <p className="font-medium text-gray-900 mb-1">Normality</p>
                      <p className="text-sm text-gray-600">Differences follow normal distribution</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <CheckCircle size={20} className="text-gray-700 mb-2" />
                      <p className="font-medium text-gray-900 mb-1">Scale</p>
                      <p className="text-sm text-gray-600">Continuous/interval measurements</p>
                    </div>
                  </div>
                </div>

                {/* Effect Size */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Effect Size: Cohen's d</h4>
                  <div className="font-mono text-lg font-medium text-gray-900 mb-6 text-center p-4 bg-gray-50 rounded border">
                    d = d̄ / Sd
                  </div>
                  <div className="space-y-3">
                    {[
                      { threshold: '|d| < 0.3', label: 'Negligible' },
                      { threshold: '0.3 ≤ |d| < 0.5', label: 'Small' },
                      { threshold: '0.5 ≤ |d| < 0.8', label: 'Medium' },
                      { threshold: '|d| ≥ 0.8', label: 'Large' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <span className="font-mono text-sm text-gray-900">{item.threshold}</span>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stability Metrics */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h5 className="font-medium text-gray-900 mb-3">Stability Metrics (CV%)</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="p-3 border border-gray-200 rounded text-center">
                      <div className="font-medium text-gray-900 mb-1">CV &lt; 10%</div>
                      <div className="text-gray-600">Highly stable</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded text-center">
                      <div className="font-medium text-gray-900 mb-1">10-30%</div>
                      <div className="text-gray-600">Stable</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded text-center">
                      <div className="font-medium text-gray-900 mb-1">30-50%</div>
                      <div className="text-gray-600">Moderate</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded text-center">
                      <div className="font-medium text-gray-900 mb-1">≥ 50%</div>
                      <div className="text-gray-600">Unstable</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Test Selection Guidance */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle className="text-gray-700 flex-shrink-0 mt-1" size={20} />
          <h3 className="text-lg font-medium text-gray-900">When to Use Paired T-Test</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Ideal Conditions</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Normal distribution of differences between paired observations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>More powerful than non-parametric tests when assumptions are met</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Provides narrower confidence intervals for mean differences</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Suitable for continuous data with adequate sample size</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} className="text-gray-700" />
          <h4 className="font-medium text-gray-900">Implementation Details</h4>
        </div>
        <p className="text-gray-700 mb-3">
          Paired T-test implemented using <strong>Apache Commons Math 3</strong> library 
          with significance level α = 0.05 (95% confidence).
        </p>
        <p className="text-sm text-gray-600">
          <strong>References:</strong> Student (1908), Cohen (1988).
        </p>
      </div>
    </div>
  );
};

export default StatisticalMethodology;