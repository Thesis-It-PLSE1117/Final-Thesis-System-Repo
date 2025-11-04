/**
 * @typedef {Object} WilcoxonMetricTest
 * @property {number} wStatistic - Wilcoxon W statistic
 * @property {number} zScore - Z-score for large samples
 * @property {number} pValue - Two-tailed p-value
 * @property {boolean} significant - Whether result is statistically significant
 * @property {string} betterAlgorithm - Algorithm with better performance (EACO/EPSO)
 * @property {number} improvementPercentage - Percentage improvement
 * @property {number} rankBiserialCorrelation - Effect size measure
 * @property {number} ciLower - Lower bound of 95% confidence interval
 * @property {number} ciUpper - Upper bound of 95% confidence interval
 * @property {number} eacoMedian - EACO median value
 * @property {number} epsoMedian - EPSO median value
 * @property {number} eacoMAD - EACO Median Absolute Deviation (robust std equivalent)
 * @property {number} epsoMAD - EPSO Median Absolute Deviation
 * @property {number} eacoIQR - EACO Interquartile Range (Q3-Q1)
 * @property {number} epsoIQR - EPSO Interquartile Range
 * @property {string} variabilityInterpretation - Algorithm stability interpretation
 * @property {string} effectSize - Effect size category (Negligible/Small/Medium/Large)
 */

/**
 * @typedef {Object} WilcoxonResults
 * @property {Object.<string, WilcoxonMetricTest>} metricTests - Test results per metric
 * @property {string} overallWinner - Overall winning algorithm or 'No clear winner'
 * @property {number} significantDifferences - Count of significant differences
 * @property {number} sampleSize - Number of paired observations
 * @property {number} alpha - Significance level threshold
 * @property {Object} interpretation - Statistical interpretation object
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Gauge,
  Timer,
  Scale,
  Activity,
  Target,
  LineChart,
  Shield,
  Lightbulb,
} from "lucide-react";
import { formatPValue } from "../../utils/pValueFormatter";

/**
 * displays Wilcoxon signed-rank test results with progressive disclosure.
 *
 * @param {Object} props - Component props
 * @param {WilcoxonResults} props.wilcoxonResults - Normalized Wilcoxon test results
 * @param {Object} props.comparisonResults - Comparison execution metadata
 * @param {boolean} [props.isLoading=false] - Loading state
 * @returns {JSX.Element|null} Rendered component or null if no data
 */
const WilcoxonTestDisplay = ({
  wilcoxonResults,
  comparisonResults,
  isLoading = false,
}) => {
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(true);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">
            Performing non-parametric analysis...
          </span>
        </div>
      </div>
    );
  }

  if (!wilcoxonResults) {
    return null;
  }

  const metricTests =
    wilcoxonResults.metricTests || wilcoxonResults.wilcoxonTests;
  const overallWinner = wilcoxonResults.overallWinner;
  const significantDifferences = wilcoxonResults.significantDifferences;

  const sampleSizes = metricTests
    ? Object.values(metricTests)
        .map((t) => t?.sampleSize)
        .filter(Boolean)
    : [];
  const minSampleSize = sampleSizes.length > 0 ? Math.min(...sampleSizes) : 30;
  const maxSampleSize = sampleSizes.length > 0 ? Math.max(...sampleSizes) : 30;
  const sampleSizeDisplay =
    minSampleSize === maxSampleSize
      ? `n = ${minSampleSize}`
      : `n = ${minSampleSize}-${maxSampleSize}`;

  const alpha = wilcoxonResults.alpha || 0.05; // Default significance level

  const eacoWins = Object.values(metricTests || {}).filter(
    (t) => t && t.significant && t.betterAlgorithm === "EACO",
  ).length;
  const epsoWins = Object.values(metricTests || {}).filter(
    (t) => t && t.significant && t.betterAlgorithm === "EPSO",
  ).length;
  const winnerCount =
    overallWinner === "EACO"
      ? eacoWins
      : overallWinner === "EPSO"
        ? epsoWins
        : 0;

  const derivedSignificant = Object.values(metricTests || {}).filter(
    (t) => t && t.significant,
  ).length;
  const significantCount =
    typeof significantDifferences === "number"
      ? significantDifferences
      : derivedSignificant;

  const formatDuration = (milliseconds) => {
    if (!milliseconds || milliseconds < 0) return "N/A";
    const seconds = milliseconds / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
  };

  const getMetricMeta = (metricName) => {
    switch (metricName) {
      case "makespan":
        return {
          Icon: Clock,
          label: "Total Completion Time (Makespan)",
          unit: "secs",
          betterWhen: "lower",
        };
      case "energyConsumption":
        return {
          Icon: Zap,
          label: "Energy Consumption",
          unit: "Wh",
          betterWhen: "lower",
        };
      case "resourceUtilization":
        return {
          Icon: Gauge,
          label: "Resource Utilization",
          unit: "%",
          betterWhen: "higher",
        };
      case "responseTime":
        return {
          Icon: Timer,
          label: "Average Response Time",
          unit: "secs",
          betterWhen: "lower",
        };
      case "loadBalance":
      case "loadImbalance":
      case "degreeOfImbalance":
        return {
          Icon: Scale,
          label: "Degree of Imbalance (DI)",
          unit: "",
          betterWhen: "lower",
        };
      default:
        return {
          Icon: BarChart3,
          label: metricName,
          unit: "",
          betterWhen: "lower",
        };
    }
  };

  const getAlgorithmColor = (algorithm) => {
    return algorithm === "EACO" ? "text-blue-600" : "text-blue-800";
  };

  const getSignificanceColor = (pValue) => {
    if (pValue < 0.001) return "text-blue-900 font-bold";
    if (pValue < 0.01) return "text-blue-800 font-semibold";
    if (pValue < 0.05) return "text-blue-700 font-medium";
    return "text-gray-500";
  };

  const getEffectSizeColor = (rankBiserial) => {
    const absValue = Math.abs(rankBiserial);
    if (absValue < 0.3) return "bg-blue-300";
    if (absValue < 0.5) return "bg-blue-400";
    if (absValue < 0.7) return "bg-blue-500";
    return "bg-blue-600";
  };

  const getEffectSizeLabel = (rankBiserial) => {
    const absValue = Math.abs(rankBiserial);
    if (absValue < 0.3) return "Negligible";
    if (absValue < 0.5) return "Small";
    if (absValue < 0.7) return "Medium";
    return "Large";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 mb-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-4 mb-6 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-blue-700"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 leading-tight">
              Non-Parametric Analysis Results
            </h4>
            <p className="text-sm sm:text-sm text-slate-700 leading-relaxed mb-1">
              The Wilcoxon test compares algorithms without assuming normal
              data. It ranks the differences to find which algorithm performs
              better.
            </p>
            <p className="text-sm sm:text-sm text-slate-600">
              <strong className="text-slate-800">See each test run</strong> by
              expanding the section below.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl shadow-sm border border-blue-100">
            <TrendingUp className="text-blue-700" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                Wilcoxon Signed-Rank Test
              </h3>
              <button
                onClick={() => setShowMethodology(!showMethodology)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full border-2 transition-all duration-300 whitespace-nowrap self-start focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    showMethodology
                      ? "bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700 hover:border-blue-700"
                      : "bg-white text-blue-700 border-blue-300 hover:border-blue-500 hover:bg-blue-50 shadow-sm hover:shadow-md"
                  }`}
                aria-pressed={showMethodology}
                aria-label={
                  showMethodology
                    ? "Hide statistical methodology details"
                    : "View statistical methodology details"
                }
              >
                <Info
                  size={14}
                  className={showMethodology ? "text-white" : "text-blue-600"}
                  aria-hidden="true"
                />
                <span>{showMethodology ? "Hide Details" : "View Details"}</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 hidden sm:block leading-relaxed">
              Rank-based test for non-normal data.
            </p>
          </div>
        </div>
        {comparisonResults?.totalExecutionTime && (
          <div className="text-left sm:text-right">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-gray-700">
                Analysis Time
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {formatDuration(comparisonResults.totalExecutionTime)}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showMethodology && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-blue-600" size={18} />
              <h4 className="font-semibold text-blue-700 text-base">
                Statistical Methodology
              </h4>
            </div>

            <div className="space-y-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                The{" "}
                <span className="font-semibold text-blue-700">
                  Wilcoxon test
                </span>{" "}
                works with any data distribution. It ranks the differences
                between algorithm pairs to find the winner.
              </p>

              <div className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="font-mono text-sm sm:text-base mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-700 font-semibold">
                      Formula:
                    </span>
                    <span className="font-bold">W = Σ(Rᵢ × sign(dᵢ))</span>
                  </div>
                  <div className="text-sm sm:text-sm text-gray-600 ml-4 space-y-1">
                    <p>where Rᵢ = rank of |dᵢ| (absolute difference)</p>
                    <p>sign(dᵢ) = sign of difference (EACO - EPSO)</p>
                    <p>n = varies per metric (zero differences excluded)</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 text-sm sm:text-sm text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-semibold text-blue-700">
                        Significance level (α):
                      </span>{" "}
                      {alpha}
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">
                        Test type:
                      </span>{" "}
                      Two-tailed
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">
                        Degrees of freedom:
                      </span>{" "}
                      N/A (this is a rank-based test).
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">
                        Library:
                      </span>{" "}
                      Apache Commons Math3
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm sm:text-sm text-gray-600 leading-relaxed">
                <p className="mb-2">
                  <span className="font-semibold">How it works:</span> We rank
                  the size of differences between algorithms. Ties are excluded,
                  so sample sizes may vary per metric.
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Confidence Range:</span> 95%
                  CI shows the likely range of performance difference between
                  algorithms.
                </p>
                <p>
                  <span className="font-semibold">What it means:</span> Results
                  with p &lt; 0.05 show a real difference between algorithms. No
                  normal distribution needed.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg p-4 sm:p-6 mb-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Award className="text-blue-600" size={28} />
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Overall Winner (Rank Test)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {overallWinner === "No clear winner" ? (
                  "No Significant Difference"
                ) : (
                  <span className={getAlgorithmColor(overallWinner)}>
                    {overallWinner} Algorithm
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {overallWinner === "No clear winner"
                ? `${significantCount}/${Object.keys(metricTests || {}).length}`
                : `${winnerCount}/${Object.keys(metricTests || {}).length}`}
            </p>
            <p className="text-sm text-gray-600">
              {overallWinner === "No clear winner"
                ? "Significant Metrics"
                : "Metrics Won"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700 text-base sm:text-lg flex items-center gap-2">
          <BarChart3 size={18} className="text-gray-500" />
          Individual Metric Analysis
        </h4>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-blue-400 rounded-lg p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h5 className="text-sm sm:text-base font-semibold text-blue-700 mb-1">
                Metric Details
              </h5>
              <p className="text-sm sm:text-sm text-gray-700 leading-relaxed">
                Click any metric below to see detailed statistics like W score,
                Z-score, and effect size.
              </p>
            </div>
          </div>
        </motion.div>

        {Object.entries(metricTests || {}).map(([metricName, test]) => (
          <motion.div
            key={metricName}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-3 sm:p-4 bg-white cursor-pointer"
              onClick={() =>
                setExpandedMetric(
                  expandedMetric === metricName ? null : metricName,
                )
              }
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const { Icon } = getMetricMeta(metricName);
                    return (
                      <span
                        className="p-2 rounded-md bg-gray-100 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="text-gray-700" size={16} />
                      </span>
                    );
                  })()}
                  <div className="min-w-0">
                    <h5
                      className="font-semibold text-gray-800 text-sm sm:text-base"
                      title={getMetricMeta(metricName).label}
                      aria-label={getMetricMeta(metricName).label}
                    >
                      {getMetricMeta(metricName).label}
                      {getMetricMeta(metricName).betterWhen && (
                        <span className="text-sm sm:text-sm text-gray-500 ml-2 block sm:inline">
                          ({getMetricMeta(metricName).betterWhen} is better)
                        </span>
                      )}
                    </h5>
                    <div className="flex items-start gap-2 mt-1">
                      {test.significant ? (
                        <>
                          <CheckCircle
                            className="text-green-500 flex-shrink-0 mt-0.5"
                            size={14}
                          />
                          <span className="text-sm sm:text-base text-green-600 font-medium">
                            Significant: {test.betterAlgorithm} performs{" "}
                            {Number(test.improvementPercentage).toFixed(2)}%
                            better
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle
                            className="text-gray-400 flex-shrink-0 mt-0.5"
                            size={14}
                          />
                          <span className="text-sm sm:text-base text-gray-500">
                            No significant difference
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <p
                      className={`text-sm sm:text-base font-mono ${getSignificanceColor(test?.pValue)}`}
                    >
                      p ={" "}
                      {formatPValue(test?.pValue)}
                      {typeof test?.pValue === "number" &&
                        test.pValue < 0.001 &&
                        " ***"}
                      {typeof test?.pValue === "number" &&
                        test.pValue >= 0.001 &&
                        test.pValue < 0.01 &&
                        " **"}
                      {typeof test?.pValue === "number" &&
                        test.pValue >= 0.01 &&
                        test.pValue < 0.05 &&
                        " *"}
                    </p>
                    <p className="text-sm sm:text-sm text-gray-500">
                      W ={" "}
                      {typeof test?.wStatistic === "number"
                        ? test.wStatistic.toFixed(1)
                        : "—"}
                      , Z ={" "}
                      {typeof test?.zScore === "number"
                        ? test.zScore.toFixed(2)
                        : "—"}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedMetric === metricName ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedMetric === metricName && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">W Statistic</p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.wStatistic === "number"
                          ? test.wStatistic.toFixed(2)
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Z-Score</p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.zScore === "number"
                          ? test.zScore.toFixed(3)
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">95% CI</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        [
                        {typeof test?.ciLower === "number"
                          ? test.ciLower.toFixed(2)
                          : "—"}
                        ,{" "}
                        {typeof test?.ciUpper === "number"
                          ? test.ciUpper.toFixed(2)
                          : "—"}
                        ]
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Median difference
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Rank-Biserial
                      </p>
                      <p className="font-semibold text-gray-800">
                        {typeof test?.rankBiserialCorrelation === "number"
                          ? test.rankBiserialCorrelation.toFixed(3)
                          : "—"}{" "}
                        (
                        {getEffectSizeLabel(test?.rankBiserialCorrelation || 0)}
                        )
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        n ={" "}
                        {typeof test?.sampleSize === "number"
                          ? test.sampleSize
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {(test?.eacoMAD !== undefined ||
                    test?.epsoMAD !== undefined ||
                    test?.variabilityInterpretation) && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="text-blue-600" size={18} />
                          <h6 className="font-semibold text-gray-800 text-sm">
                            Algorithm Stability Analysis
                          </h6>
                        </div>

                        {(test?.eacoMAD !== undefined ||
                          test?.epsoMAD !== undefined) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <LineChart
                                    className="text-blue-600"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    EACO Variability
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-lg font-bold text-blue-600">
                                    MAD ={" "}
                                    {typeof test?.eacoMAD === "number"
                                      ? test.eacoMAD.toFixed(4)
                                      : "—"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Median Absolute Deviation
                                  </p>
                                </div>
                                {typeof test?.eacoMedian === "number" && (
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Median: {test.eacoMedian.toFixed(4)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <LineChart
                                    className="text-blue-800"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    EPSO Variability
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-lg font-bold text-blue-800">
                                    MAD ={" "}
                                    {typeof test?.epsoMAD === "number"
                                      ? test.epsoMAD.toFixed(4)
                                      : "—"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Median Absolute Deviation
                                  </p>
                                </div>
                                {typeof test?.epsoMedian === "number" && (
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Median: {test.epsoMedian.toFixed(4)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {test?.variabilityInterpretation && (
                          <div className="bg-white rounded-lg p-3 border border-blue-100 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="text-blue-600" size={14} />
                              <span className="text-sm font-semibold text-gray-700">
                                Stability Interpretation
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {test.variabilityInterpretation}
                            </p>
                          </div>
                        )}
                        
                        {(test?.zeroExclusions > 0 || test?.tiesPresent) && (
                          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="text-amber-600" size={14} />
                              <span className="text-sm font-semibold text-gray-700">
                                Methodology Notes
                              </span>
                            </div>
                            <div className="space-y-1.5 text-sm text-gray-700">
                              {test?.zeroExclusions > 0 && (
                                <p>
                                  <strong>{test.zeroExclusions}</strong> zero difference{test.zeroExclusions !== 1 ? 's' : ''} excluded per Pratt (1959) methodology.
                                </p>
                              )}
                              {test?.tiesPresent && test?.tiesCount > 0 && (
                                <p>
                                  <strong>{test.tiesCount}</strong> tied rank{test.tiesCount !== 1 ? 's' : ''} detected. Normal approximation adjusted accordingly.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          Effect Size Scale (Rank-Biserial)
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {getEffectSizeLabel(
                            test?.rankBiserialCorrelation || 0,
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getEffectSizeColor(test?.rankBiserialCorrelation || 0)}`}
                          style={{
                            width: `${Math.min(100, Math.abs(test?.rankBiserialCorrelation || 0) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>0</span>
                        <span>0.3</span>
                        <span>0.5</span>
                        <span>0.7</span>
                        <span>1.0</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {wilcoxonResults?.interpretation?.wilcoxonAnalysis && (
        <div className="mt-6">
          <button
            onClick={() => setShowInterpretation(!showInterpretation)}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white p-3 sm:p-4 rounded-lg flex items-center justify-between hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <span className="font-semibold text-sm sm:text-base">
                Statistical Analysis Interpretation
              </span>
            </div>
            {showInterpretation ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          <AnimatePresence>
            {showInterpretation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-300 rounded-b-lg p-4 sm:p-6"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Award className="text-blue-600" size={18} />
                    Overall Conclusion
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {wilcoxonResults.interpretation.wilcoxonAnalysis.conclusion}
                    {wilcoxonResults.interpretation.wilcoxonAnalysis
                      .conclusion &&
                      !wilcoxonResults.interpretation.wilcoxonAnalysis.conclusion
                        .trim()
                        .endsWith(".") &&
                      "."}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={18} />
                    Practical Significance
                  </h4>
                  <div className="text-base text-gray-700 leading-relaxed">
                    {wilcoxonResults.interpretation.wilcoxonAnalysis.effectSizeExplanation
                      .split(/[;]+/)
                      .filter((sentence) => sentence.trim())
                      .map((sentence, index) => (
                        <p key={index} className="mb-2">
                          {sentence.trim()}.
                        </p>
                      ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Info className="text-blue-600" size={18} />
                    Confidence Level
                  </h4>
                  <div className="text-base text-gray-700 leading-relaxed">
                    {wilcoxonResults.interpretation.wilcoxonAnalysis.confidenceExplanation
                      .split(/[;]+/)
                      .filter((sentence) => sentence.trim())
                      .map((sentence, index) => (
                        <p key={index} className="mb-2">
                          {sentence.trim()}.
                        </p>
                      ))}
                  </div>
                </div>

                {wilcoxonResults.interpretation.wilcoxonAnalysis
                  .metricAnalysis && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="text-blue-600" size={18} />
                      Metric Analysis
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(
                        wilcoxonResults.interpretation.wilcoxonAnalysis
                          .metricAnalysis,
                      ).map(([metric, analysis]) => {
                        const displayName =
                          metric === "loadBalance"
                            ? "Degree of Imbalance"
                            : metric.replace(/([A-Z])/g, " $1").trim();
                        return (
                          <div
                            key={metric}
                            className="bg-white rounded-lg p-3 border border-gray-200"
                          >
                            <h5 className="font-medium text-gray-800 text-base mb-1 capitalize">
                              {displayName}
                            </h5>
                            <p className="text-base text-gray-600 leading-relaxed">
                              {analysis}
                              {analysis &&
                                !analysis.trim().endsWith(".") &&
                                "."}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {wilcoxonResults.interpretation.wilcoxonAnalysis
                  .assumptions && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Shield className="text-blue-600" size={18} />
                      Test Assumptions
                    </h4>
                    <div className="text-base text-gray-700 leading-relaxed">
                      {wilcoxonResults.interpretation.wilcoxonAnalysis.assumptions
                        .split(/[.;:]+/)
                        .filter((sentence) => sentence.trim())
                        .map((sentence, index) => (
                          <p key={index} className="mb-2">
                            {sentence.trim()}.
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {wilcoxonResults.interpretation.wilcoxonAnalysis
                  .practicalImplications && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="text-blue-600" size={18} />
                      Practical Implications
                    </h4>
                    <div className="text-base text-gray-700 leading-relaxed">
                      {wilcoxonResults.interpretation.wilcoxonAnalysis.practicalImplications
                        .split(/[.;]+/)
                        .filter((sentence) => sentence.trim())
                        .map((sentence, index) => (
                          <p key={index} className="mb-2">
                            {sentence.trim()}.
                          </p>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-bold text-blue-900">***</span>
            <span>p &lt; 0.001</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-blue-800">**</span>
            <span>p &lt; 0.01</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-blue-700">*</span>
            <span>p &lt; 0.05</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">ns</span>
            <span>Not significant</span>
          </div>
          <div className="sm:ml-auto flex items-center gap-1 mt-2 sm:mt-0">
            <AlertCircle size={14} className="text-gray-400 flex-shrink-0" />
            <span>
              Sample size varies by metric (excludes zero differences). Wilcoxon
              signed-rank test using rank-based analysis (EACO - EPSO).
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WilcoxonTestDisplay;
