import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Activity, Info, CheckCircle, AlertTriangle, Layers, Target, ChevronDown } from "lucide-react";
import { useState } from "react";

const StatisticalMethodology = () => {
  const [expandedSection, setExpandedSection] = useState('ttest');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Layers className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3 leading-tight">Overview</h2>
            <p className="text-blue-50 leading-relaxed text-base max-w-2xl">
              Two complementary methods validate algorithm performance differences with 95% confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-blue-100" />
                  <span className="font-semibold text-sm">Paired T-Test</span>
                </div>
                <p className="text-sm text-blue-100">Parametric • Assumes normality • Compares means</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={18} className="text-blue-100" />
                  <span className="font-semibold text-sm">Wilcoxon Test</span>
                </div>
                <p className="text-sm text-blue-100">Non-parametric • No assumptions • Compares medians</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('ttest')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Paired T-Test</h3>
              <p className="text-sm text-gray-500 mt-0.5">Parametric method comparing mean differences</p>
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-lg font-bold text-gray-900">Purpose</h4>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed max-w-2xl">
                    Determines whether the <strong className="text-gray-900 font-semibold">mean difference</strong> between paired algorithm runs 
                    is statistically significant. Assumes differences follow a normal distribution.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-5">
                    <Target size={20} className="text-blue-600" />
                    <h4 className="font-bold text-gray-900 text-lg">Test Statistic</h4>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm">
                    <div className="font-mono text-2xl font-bold text-gray-900 mb-6 text-center">
                      t = d̄ / (Sd / √n)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">d̄</span>
                        <span className="text-gray-700 leading-relaxed text-sm">Mean difference (EACO - EPSO)</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">Sd</span>
                        <span className="text-gray-700 leading-relaxed text-sm">Standard deviation of differences</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">n</span>
                        <span className="text-gray-700 leading-relaxed text-sm">Number of paired observations</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">df</span>
                        <span className="text-gray-700 leading-relaxed text-sm">Degrees of freedom (n - 1)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-lg font-bold text-gray-900">Assumptions</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 hover:shadow-md transition-shadow">
                      <CheckCircle size={20} className="text-green-600 mb-3" />
                      <p className="font-semibold text-gray-900 mb-2">Independence</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Pairs are independent across iterations</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 hover:shadow-md transition-shadow">
                      <CheckCircle size={20} className="text-green-600 mb-3" />
                      <p className="font-semibold text-gray-900 mb-2">Normality</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Differences follow normal distribution</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 hover:shadow-md transition-shadow">
                      <CheckCircle size={20} className="text-green-600 mb-3" />
                      <p className="font-semibold text-gray-900 mb-2">Scale</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Continuous/interval measurements</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-bold text-blue-900">Effect Size: Cohen's d</h4>
                  </div>
                  <div className="font-mono text-xl font-bold text-blue-900 mb-6 text-center py-3 bg-white rounded-lg border-2 border-blue-300 shadow-sm">
                    d = d̄ / Sd
                  </div>
                  <div className="space-y-3">
                    {[
                      { threshold: '|d| < 0.3', label: 'Negligible', borderColor: 'border-gray-200', dotColor: 'bg-gray-400', textColor: 'text-gray-500', bgColor: 'bg-gray-100' },
                      { threshold: '0.3 \u2264 |d| < 0.5', label: 'Small', borderColor: 'border-blue-200', dotColor: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-100' },
                      { threshold: '0.5 \u2264 |d| < 0.8', label: 'Medium', borderColor: 'border-indigo-200', dotColor: 'bg-indigo-600', textColor: 'text-indigo-700', bgColor: 'bg-indigo-100' },
                      { threshold: '|d| \u2265 0.8', label: 'Large', borderColor: 'border-purple-200', dotColor: 'bg-purple-700', textColor: 'text-purple-700', bgColor: 'bg-purple-100' },
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-4 bg-white rounded-xl p-4 border-2 ${item.borderColor} hover:shadow-md transition-all`}>
                        <div className={`w-3 h-3 rounded-full ${item.dotColor} flex-shrink-0`}></div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-mono text-sm font-semibold text-gray-700">{item.threshold}</span>
                          <span className={`text-xs font-bold ${item.textColor} uppercase tracking-wider px-3 py-1 ${item.bgColor} rounded-full`}>{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-3">Stability Metrics (CV%)</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-semibold text-green-700 mb-1">CV &lt; 10%</div>
                      <div className="text-xs text-gray-600">Highly stable</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-semibold text-blue-700 mb-1">10-30%</div>
                      <div className="text-xs text-gray-600">Stable</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-semibold text-amber-700 mb-1">30-50%</div>
                      <div className="text-xs text-gray-600">Moderate</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-semibold text-red-700 mb-1">&ge; 50%</div>
                      <div className="text-xs text-gray-600">Unstable</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('wilcoxon')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Activity className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Wilcoxon Signed-Rank Test</h3>
              <p className="text-sm text-gray-500 mt-0.5">Non-parametric method comparing medians</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expandedSection === 'wilcoxon' ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="text-gray-400" size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedSection === 'wilcoxon' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-lg font-bold text-gray-900">Purpose</h4>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed max-w-2xl">
                    Distribution-free alternative comparing <strong className="text-gray-900 font-semibold">medians</strong> rather than means. 
                    Makes <strong className="text-blue-700 font-semibold">no assumptions about normality</strong>, making it robust for skewed data or outliers.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-5">
                    <Target size={20} className="text-blue-600" />
                    <h4 className="font-bold text-gray-900 text-lg">Test Statistic</h4>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm">
                    <div className="font-mono text-2xl font-bold text-gray-900 mb-4 text-center">
                      W = Σ(sign(dᵢ) × Rᵢ)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">dᵢ</span>
                        <span className="text-gray-700 leading-relaxed text-sm">EACO - EPSO for observation i</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-lg">
                        <span className="text-blue-600 font-bold text-lg">Rᵢ</span>
                        <span className="text-gray-700 leading-relaxed text-sm">Rank of |dᵢ| (absolute difference)</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-900">Note:</strong> Zero differences excluded • For n &ge; 20, Z-score with continuity correction used
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-bold text-blue-900">Effect Size: Rank-Biserial (r)</h4>
                  </div>
                  <div className="font-mono text-xl font-bold text-blue-900 mb-6 text-center py-3 bg-white rounded-lg border-2 border-blue-300 shadow-sm">
                    r = |Z| / √n
                  </div>
                  <div className="space-y-3">
                    {[
                      { threshold: 'r < 0.1', label: 'Negligible', borderColor: 'border-gray-200', dotColor: 'bg-gray-400', textColor: 'text-gray-500', bgColor: 'bg-gray-100' },
                      { threshold: '0.1 \u2264 r < 0.3', label: 'Small', borderColor: 'border-blue-200', dotColor: 'bg-blue-400', textColor: 'text-purple-700', bgColor: 'bg-purple-100' },
                      { threshold: '0.3 \u2264 r < 0.5', label: 'Medium', borderColor: 'border-blue-300', dotColor: 'bg-blue-600', textColor: 'text-purple-700', bgColor: 'bg-purple-100' },
                      { threshold: 'r \u2265 0.5', label: 'Large', borderColor: 'border-blue-400', dotColor: 'bg-blue-800', textColor: 'text-purple-700', bgColor: 'bg-purple-100' },
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-4 bg-white rounded-xl p-4 border-2 ${item.borderColor} hover:shadow-md transition-all`}>
                        <div className={`w-3 h-3 rounded-full ${item.dotColor} flex-shrink-0`}></div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-mono text-sm font-semibold text-gray-700">{item.threshold}</span>
                          <span className={`text-xs font-bold ${item.textColor} uppercase tracking-wider px-3 py-1 ${item.bgColor} rounded-full`}>{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 p-4 bg-white rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong className="text-blue-900">Example:</strong> r = 0.7 means better algorithm wins ~85% of pairwise comparisons.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                  <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Info size={18} className="text-green-600" />
                    Why MAD Instead of Standard Deviation?
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>MAD uses median (not mean), aligning with Wilcoxon's rank-based approach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Resistant to outliers and extreme values</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Statistically consistent with non-parametric methods</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
          <h3 className="text-xl font-bold text-amber-900">When to Use Which Test?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-amber-200">
            <h4 className="font-semibold text-blue-900 mb-3">Use Paired T-Test</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span>Normal distribution of differences</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span>More powerful with valid assumptions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span>Provides narrower confidence intervals</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-5 border border-amber-200">
            <h4 className="font-semibold text-blue-900 mb-3">Use Wilcoxon Test</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span>Non-normal/skewed distributions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span>Presence of outliers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span>Ordinal data or small samples</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="text-sm text-gray-600 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} className="text-gray-500" />
          <h4 className="font-semibold text-gray-900">Implementation Details</h4>
        </div>
        <p className="mb-3 leading-relaxed">
          Both tests implemented using <strong className="text-gray-900">Apache Commons Math 3</strong> library 
          with significance level α = 0.05 (95% confidence).
        </p>
        <p className="text-xs text-gray-500">
          <strong>References:</strong> Student (1908), Wilcoxon (1945), Cohen (1988), Hodges & Lehmann (1963).
        </p>
      </footer>
    </motion.div>
  );
};

export default StatisticalMethodology;
