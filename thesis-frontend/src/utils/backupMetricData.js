const METRIC_NAMES = {
  makespan: 'Makespan',
  energyConsumption: 'Energy Consumption',
  resourceUtilization: 'Resource Utilization',
  responseTime: 'Response Time',
  loadImbalance: 'Degree of Imbalance',
  loadBalance: 'Degree of Imbalance'
};

const safeNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return undefined;
};

const calculateImprovementPercentage = (betterValue, worseValue) => {
  if (!betterValue || !worseValue || worseValue === 0) {
    return 0;
  }
  return Math.abs(((worseValue - betterValue) / worseValue) * 100);
};

const generateMeanInterpretation = (metricKey, data) => {
  const { eacoMean, epsoMean, betterAlgorithm, pValue, significant, tStatistic, meanDifference } = data;
  
  if (eacoMean === undefined || epsoMean === undefined) {
    const metricName = METRIC_NAMES[metricKey] || metricKey;
    
    if (betterAlgorithm && pValue !== undefined) {
      let interpretation = `${betterAlgorithm} performed better for ${metricName}`;
      
    if (meanDifference !== undefined && meanDifference !== 0) {
        const lowerIsBetter = ['makespan', 'energyConsumption', 'responseTime', 'loadImbalance'].includes(metricKey);
        interpretation += ` with a mean difference of ${Math.abs(meanDifference).toFixed(3)}`;
      }
      
      interpretation += '. ';
      
      if (significant) {
        interpretation += `This difference is statistically significant (p=${pValue.toFixed(4)})`;
      } else {
        interpretation += `This difference is not statistically significant (p=${pValue.toFixed(4)})`;
      }
      
      if (tStatistic !== undefined) {
        interpretation += `, t=${tStatistic.toFixed(3)}`;
      }
      
      interpretation += '. Imported data lacks individual mean values.';
      return interpretation;
    }
    
    return 'Mean comparison data not available';
  }

  const metricName = METRIC_NAMES[metricKey] || metricKey;
  const betterValue = betterAlgorithm === 'EACO' ? eacoMean : epsoMean;
  const worseValue = betterAlgorithm === 'EACO' ? epsoMean : eacoMean;
  const worseAlgorithm = betterAlgorithm === 'EACO' ? 'EPSO' : 'EACO';
  
  const improvement = data.improvementPercentage || 
    calculateImprovementPercentage(betterValue, worseValue);

  let interpretation = `${betterAlgorithm} achieved a better mean ${metricName} `;
  interpretation += `(${betterValue.toFixed(3)}) compared to ${worseAlgorithm} `;
  interpretation += `(${worseValue.toFixed(3)}), representing a ${improvement.toFixed(2)}% improvement. `;
  
  if (significant && pValue !== undefined) {
    interpretation += `This difference is statistically significant (p=${pValue.toFixed(4)}).`;
  } else {
    interpretation += 'This difference is not statistically significant.';
  }

  return interpretation;
};

const generateStdInterpretation = (data) => {
  const { eacoStd, epsoStd, betterAlgorithm } = data;
  
  if (eacoStd === undefined || epsoStd === undefined) {
    if (betterAlgorithm) {
      return `Consistency metrics unavailable for imported data. Refer to statistical significance for ${betterAlgorithm}'s performance advantage.`;
    }
    return 'Consistency analysis data not available';
  }

  const moreConsistent = eacoStd < epsoStd ? 'EACO' : 'EPSO';
  const lessConsistent = moreConsistent === 'EACO' ? 'EPSO' : 'EACO';
  const moreStd = moreConsistent === 'EACO' ? eacoStd : epsoStd;
  const lessStd = moreConsistent === 'EACO' ? epsoStd : eacoStd;
  
  let interpretation = `${moreConsistent} shows more consistent performance with a standard deviation `;
  interpretation += `of ${moreStd.toFixed(3)}, while ${lessConsistent} has ${lessStd.toFixed(3)}. `;
  interpretation += 'Lower standard deviation indicates more predictable and stable algorithm behavior.';

  return interpretation;
};

export const backupMetricData = (metricKey, metricData, eacoResults, epsoResults) => {
  if (!metricData) {
    return metricData;
  }

  if (metricData.eacoMean !== undefined &&
      metricData.epsoMean !== undefined &&
      metricData.meanInterpretation &&
      metricData.stdInterpretation) {
    return metricData;
  }

  const enriched = { ...metricData };

  const eacoAvgMetrics = eacoResults?.averageMetrics;
  const epsoAvgMetrics = epsoResults?.averageMetrics;
  const eacoSummary = eacoResults?.summary;
  const epsoSummary = epsoResults?.summary;
  const eacoStdDevs = eacoResults?.stdDevMetrics;
  const epsoStdDevs = epsoResults?.stdDevMetrics;

  if (enriched.eacoMean === undefined) {
    enriched.eacoMean = safeNumber(eacoAvgMetrics?.[metricKey]) || safeNumber(eacoSummary?.[metricKey]);
  }
  
  if (enriched.epsoMean === undefined) {
    enriched.epsoMean = safeNumber(epsoAvgMetrics?.[metricKey]) || safeNumber(epsoSummary?.[metricKey]);
  }

  if ((enriched.eacoMean === undefined || enriched.epsoMean === undefined) && enriched.meanDifference !== undefined) {
    const meanDiff = enriched.meanDifference;
    const lowerIsBetter = ['makespan', 'energyConsumption', 'responseTime', 'loadImbalance'].includes(metricKey);
    
    if (enriched.eacoMean === undefined && enriched.epsoMean === undefined) {
      const eacoIndividual = eacoResults?.individualResults;
      const epsoIndividual = epsoResults?.individualResults;
      
      if (eacoIndividual && eacoIndividual.length > 0) {
        const values = eacoIndividual.map(r => r.summary?.[metricKey]).filter(v => v !== undefined && v !== null);
        if (values.length > 0) {
          enriched.eacoMean = values.reduce((sum, v) => sum + v, 0) / values.length;
        }
      }
      
      if (epsoIndividual && epsoIndividual.length > 0) {
        const values = epsoIndividual.map(r => r.summary?.[metricKey]).filter(v => v !== undefined && v !== null);
        if (values.length > 0) {
          enriched.epsoMean = values.reduce((sum, v) => sum + v, 0) / values.length;
        }
      }
    }
    
    if (enriched.betterAlgorithm === 'EACO') {
      if (enriched.eacoMean !== undefined && enriched.epsoMean === undefined) {
        enriched.epsoMean = lowerIsBetter ? enriched.eacoMean + Math.abs(meanDiff) : enriched.eacoMean - Math.abs(meanDiff);
      } else if (enriched.epsoMean !== undefined && enriched.eacoMean === undefined) {
        enriched.eacoMean = lowerIsBetter ? enriched.epsoMean - Math.abs(meanDiff) : enriched.epsoMean + Math.abs(meanDiff);
      }
    } else if (enriched.betterAlgorithm === 'EPSO') {
      if (enriched.epsoMean !== undefined && enriched.eacoMean === undefined) {
        enriched.eacoMean = lowerIsBetter ? enriched.epsoMean + Math.abs(meanDiff) : enriched.epsoMean - Math.abs(meanDiff);
      } else if (enriched.eacoMean !== undefined && enriched.epsoMean === undefined) {
        enriched.epsoMean = lowerIsBetter ? enriched.eacoMean - Math.abs(meanDiff) : enriched.eacoMean + Math.abs(meanDiff);
      }
    }
  }
  
  if (enriched.eacoStd === undefined && eacoStdDevs?.[metricKey] !== undefined) {
    enriched.eacoStd = safeNumber(eacoStdDevs[metricKey]);
  }
  
  if (enriched.epsoStd === undefined && epsoStdDevs?.[metricKey] !== undefined) {
    enriched.epsoStd = safeNumber(epsoStdDevs[metricKey]);
  }

  if (!enriched.betterAlgorithm && enriched.eacoMean !== undefined && enriched.epsoMean !== undefined) {
    const lowerIsBetter = ['makespan', 'energyConsumption', 'responseTime', 'loadImbalance'].includes(metricKey);
    if (lowerIsBetter) {
      enriched.betterAlgorithm = enriched.eacoMean < enriched.epsoMean ? 'EACO' : 'EPSO';
    } else {
      enriched.betterAlgorithm = enriched.eacoMean > enriched.epsoMean ? 'EACO' : 'EPSO';
    }
  }

  if (!enriched.meanInterpretation) {
    enriched.meanInterpretation = generateMeanInterpretation(metricKey, enriched);
  }

  if (!enriched.stdInterpretation) {
    enriched.stdInterpretation = generateStdInterpretation(enriched);
  }

  return enriched;
};
