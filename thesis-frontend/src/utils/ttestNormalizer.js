/**
 * since for t-test in backend has camel issues
 * plan for backend response formats and normalizes them for the UI
 */

/**
 * parse numeric values from various formats
 */
const parseNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const match = value.trim().match(/-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?/);
    if (match) {
      const n = Number(match[0]);
      return Number.isFinite(n) ? n : undefined;
    }
  }
  return undefined;
};

/**
 * normalize metric keys to standard names
 */
const normalizeMetricKey = (key) => {
  const k = (key || '').toString();
  const map = {
    avgResponseTime: 'responseTime',
    averageResponseTime: 'responseTime',
    response_time: 'responseTime',
    energy: 'energyConsumption',
    energy_consumption: 'energyConsumption',
    utilization: 'resourceUtilization',
    resource_utilization: 'resourceUtilization',
    load_balance: 'loadBalance',
    completionTime: 'makespan',
    completion_time: 'makespan',
  };
  return map[k] || k;
};

/**
 * calculate effect size category based on Cohen's d
 */
const getEffectSizeCategory = (cohensD) => {
  if (!Number.isFinite(cohensD)) return undefined;
  const d = Math.abs(cohensD);
  if (d < 0.2) return 'negligible';
  if (d < 0.5) return 'small';
  if (d < 0.8) return 'medium';
  return 'large';
};

/**
 * normalize T-Test results from various backend formats
 */
export const normalizeTTestResults = (raw) => {
  if (!raw) return null;

  // handle various possible property names for the metrics tests
  const rawMetricTests = 
    raw.metricTests || 
    raw.metrics || 
    raw.tests || 
    raw.perMetric || 
    raw.per_metric || 
    {};

  // convert to entries array, handling both array and object formats
  const entries = Array.isArray(rawMetricTests)
    ? rawMetricTests.map((item) => [
        normalizeMetricKey(item?.metric || item?.name),
        item
      ])
    : Object.entries(rawMetricTests).map(([k, v]) => [
        normalizeMetricKey(k),
        v
      ]);

  const metricTests = {};
  
  for (const [metric, test] of entries) {
    if (!metric) continue;
    
    // extract p-value with multiple possible property names
    const pValue = parseNumber(
      test?.pValue ?? 
      test?.pvalue ?? 
      test?.pVal ?? 
      test?.p_value ?? 
      test?.p_two_tailed ?? 
      test?.pTwoTailed ?? 
      test?.p_twotailed ?? 
      test?.p_two_tail ?? 
      test?.pTwoTail ?? 
      test?.p ?? 
      test?.pval
    );
    
    // extract t-statistic
    const tStatistic = parseNumber(
      test?.tStatistic ?? 
      test?.t_statistic ?? 
      test?.tStat ?? 
      test?.t_value ?? 
      test?.tValue ?? 
      test?.statistic ?? 
      test?.t
    );
    
    // extract degrees of freedom
    const degreesOfFreedom = parseNumber(
      test?.degreesOfFreedom ?? 
      test?.degrees_of_freedom ?? 
      test?.degreesFreedom ?? 
      test?.degFreedom ?? 
      test?.df ?? 
      test?.dof ?? 
      test?.d_f
    );
    
    // extract mean difference
    const meanDifference = parseNumber(
      test?.meanDifference ?? 
      test?.mean_difference ?? 
      test?.meanDiff ?? 
      test?.diffMean
    );
    
    // extract standard error
    const standardError = parseNumber(
      test?.standardError ?? 
      test?.stdError ?? 
      test?.standard_error ?? 
      test?.se
    );
    
    // extract confidence interval bounds
    const ciLower = parseNumber(
      test?.ciLower ?? 
      test?.ci_lower ?? 
      test?.confidenceIntervalLower ?? 
      test?.ciLow
    );
    
    const ciUpper = parseNumber(
      test?.ciUpper ?? 
      test?.ci_upper ?? 
      test?.confidenceIntervalUpper ?? 
      test?.ciHigh
    );
    
    // extract Cohen's d
    const cohensD = parseNumber(
      test?.cohensD ?? 
      test?.cohenD ?? 
      test?.cohen_d ?? 
      test?.effectSizeValue
    );
    
    // determine effect size category
    let effectSize = test?.effectSize;
    if (!effectSize && Number.isFinite(cohensD)) {
      effectSize = getEffectSizeCategory(cohensD);
    }
    
    // extract significance
    const significant = Boolean(
      test?.significant ?? 
      test?.isSignificant ?? 
      test?.sig
    );
    
    // Extract better algorithm
    const betterAlgorithm = 
      test?.betterAlgorithm ?? 
      test?.winnerAlgorithm ?? 
      test?.better_algo;
    
    // extract improvement percentage
    const improvementPercentage = parseNumber(
      test?.improvementPercentage ?? 
      test?.improvement_percent ?? 
      test?.improvementPercent
    );

    metricTests[metric] = {
      pValue,
      tStatistic,
      degreesOfFreedom,
      meanDifference,
      standardError,
      ciLower,
      ciUpper,
      cohensD,
      effectSize,
      significant,
      betterAlgorithm,
      improvementPercentage,
    };
  }

  return {
    metricTests,
    overallWinner: 
      raw.overallWinner ?? 
      raw.winner ?? 
      'No clear winner for the both algorithms',
    significantDifferences: 
      raw.significantDifferences ?? 
      raw.num_significant ?? 
      0,
    sampleSize: parseNumber(
      raw.sampleSize ?? 
      raw.n ?? 
      raw.sample_size
    ) ?? undefined,
    alpha: parseNumber(
      raw.alpha ?? 
      raw.significance ?? 
      raw.p_threshold
    ) ?? undefined,
  };
};
