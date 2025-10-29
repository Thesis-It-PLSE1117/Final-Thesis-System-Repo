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

const getEffectSizeCategory = (rankBiserial) => {
  if (!Number.isFinite(rankBiserial)) return undefined;
  const rb = Math.abs(rankBiserial);
  if (rb < 0.3) return 'Negligible';
  if (rb < 0.5) return 'Small';
  if (rb < 0.7) return 'Medium';
  return 'Large';
};

export const normalizeWilcoxonResults = (raw) => {
  console.log('[DEBUG] Wilcoxon normalizer called with:', raw);
  
  if (!raw) {
    console.warn('[DEBUG] Wilcoxon normalizer: NULL/UNDEFINED input');
    return null;
  }

  // Backend sends wilcoxonTests as flat object with metric keys
  // If raw is already the tests object, use it directly
  const rawMetricTests = 
    raw.metricTests || 
    raw.metrics || 
    raw.tests || 
    raw.perMetric || 
    raw.per_metric || 
    raw || // Backend sends flat structure directly
    {};

  const metadataKeys = ['interpretation', 'overallWinner', 'significantDifferences', 'sampleSize', 'alpha', 'plotPaths'];
  
  const entries = Array.isArray(rawMetricTests)
    ? rawMetricTests.map((item) => [
        normalizeMetricKey(item?.metric || item?.name),
        item
      ])
    : Object.entries(rawMetricTests)
        .filter(([k]) => !metadataKeys.includes(k))  // Filter out metadata
        .map(([k, v]) => [
          normalizeMetricKey(k),
          v
        ]);

  const metricTests = {};
  
  for (const [metric, test] of entries) {
    if (!metric) continue;
    
    const pValue = parseNumber(
      test?.pValue ?? 
      test?.pvalue ?? 
      test?.pVal ?? 
      test?.p_value ?? 
      test?.p ?? 
      test?.pval
    );
    
    const wStatistic = parseNumber(
      test?.wStatistic ?? 
      test?.w_statistic ?? 
      test?.wStat ?? 
      test?.w_value ?? 
      test?.wValue ?? 
      test?.statistic ?? 
      test?.testStatistic ?? 
      test?.w
    );
    
    const zScore = parseNumber(
      test?.zScore ?? 
      test?.z_score ?? 
      test?.zStat ?? 
      test?.z_value ?? 
      test?.zValue ?? 
      test?.zscore ?? 
      test?.z
    );
    
    const rankBiserialCorrelation = parseNumber(
      test?.rankBiserialCorrelation ?? 
      test?.rank_biserial_correlation ?? 
      test?.rankBiserial ?? 
      test?.rank_biserial ?? 
      test?.effectSizeR ?? 
      test?.effectSize_r ?? 
      test?.r
    );
    
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
    
    let effectSize = test?.effectSizeLabel ?? test?.effectSizeCategory;
    // Backend sends effectSize as string (e.g., 'Large', 'Medium')
    if (!effectSize && typeof test?.effectSize === 'string') {
      effectSize = test.effectSize;
    }
    if (!effectSize && Number.isFinite(rankBiserialCorrelation)) {
      effectSize = getEffectSizeCategory(rankBiserialCorrelation);
    }
    
    const significant = Boolean(
      test?.significant ?? 
      test?.isSignificant ?? 
      test?.sig
    );
    
    const betterAlgorithm = 
      test?.betterAlgorithm ?? 
      test?.winnerAlgorithm ?? 
      test?.better_algo;
    
    const improvementPercentage = parseNumber(
      test?.improvementPercentage ?? 
      test?.improvement_percent ?? 
      test?.improvementPercent
    );
    
    const eacoMedian = parseNumber(
      test?.eacoMedian ?? 
      test?.eaco_median
    );
    
    const epsoMedian = parseNumber(
      test?.epsoMedian ?? 
      test?.epso_median
    );
    
    const eacoMAD = parseNumber(
      test?.eacoMAD ?? 
      test?.eaco_mad ?? 
      test?.eacoMad
    );
    
    const epsoMAD = parseNumber(
      test?.epsoMAD ?? 
      test?.epso_mad ?? 
      test?.epsoMad
    );
    
    const eacoIQR = parseNumber(
      test?.eacoIQR ?? 
      test?.eaco_iqr ?? 
      test?.eacoIqr
    );
    
    const epsoIQR = parseNumber(
      test?.epsoIQR ?? 
      test?.epso_iqr ?? 
      test?.epsoIqr
    );
    
    const variabilityInterpretation = 
      test?.variabilityInterpretation ?? 
      test?.variability_interpretation ?? 
      test?.stabilityInterpretation ?? 
      undefined;
    
    const zeroExclusions = parseNumber(
      test?.zeroExclusions ?? 
      test?.zero_exclusions ?? 
      test?.zerosExcluded
    ) ?? 0;
    
    const tiesPresent = Boolean(
      test?.tiesPresent ?? 
      test?.ties_present ?? 
      test?.hasTies
    );
    
    const tiesCount = parseNumber(
      test?.tiesCount ?? 
      test?.ties_count ?? 
      test?.numTies
    ) ?? 0;

    metricTests[metric] = {
      pValue,
      wStatistic,
      zScore,
      rankBiserialCorrelation,
      ciLower,
      ciUpper,
      effectSize,
      significant,
      betterAlgorithm,
      improvementPercentage,
      eacoMedian,
      epsoMedian,
      eacoMAD,
      epsoMAD,
      eacoIQR,
      epsoIQR,
      variabilityInterpretation,
      sampleSize: parseNumber(test?.sampleSize ?? test?.n),
      zeroExclusions,
      tiesPresent,
      tiesCount,
    };
  }

  // Calculate overall winner and significant differences from metric tests
  const significantTests = Object.values(metricTests).filter(t => t.significant);
  const eacoWins = significantTests.filter(t => t.betterAlgorithm === 'EACO').length;
  const epsoWins = significantTests.filter(t => t.betterAlgorithm === 'EPSO').length;
  
  let derivedWinner = 'No clear winner';
  if (eacoWins > epsoWins) derivedWinner = 'EACO';
  else if (epsoWins > eacoWins) derivedWinner = 'EPSO';
  
  // Get sample size from first metric test if not in raw
  const firstTest = Object.values(metricTests)[0];
  const derivedSampleSize = firstTest?.sampleSize || 
                           parseNumber(raw.sampleSize ?? raw.n ?? raw.sample_size);
  
  const normalizedResult = {
    metricTests,
    overallWinner: 
      raw.overallWinner ?? 
      raw.winner ?? 
      derivedWinner,
    significantDifferences: 
      raw.significantDifferences ?? 
      raw.num_significant ?? 
      significantTests.length,
    sampleSize: derivedSampleSize ?? undefined,
    alpha: parseNumber(
      raw.alpha ?? 
      raw.significance ?? 
      raw.p_threshold
    ) ?? 0.05,
    interpretation: raw.interpretation ?? null,
  };
  
  console.log('[DEBUG] Wilcoxon normalizer output:', {
    hasMetricTests: Object.keys(metricTests).length > 0,
    metricsCount: Object.keys(metricTests).length,
    overallWinner: normalizedResult.overallWinner,
    sampleSize: normalizedResult.sampleSize
  });
  
  return normalizedResult;
};
