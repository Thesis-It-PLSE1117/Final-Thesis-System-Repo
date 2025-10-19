export const validateEChartsData = (rawResults, algorithmName) => {
  const warnings = [];
  const errors = [];

  if (!rawResults) {
    errors.push(`[${algorithmName}] rawResults is null or undefined`);
    return { valid: false, errors, warnings };
  }

  if (!rawResults.summary) {
    errors.push(`[${algorithmName}] rawResults.summary is missing`);
    return { valid: false, errors, warnings };
  }

  const summary = rawResults.summary;

  const requiredFields = [
    { name: 'makespan', type: 'number' },
    { name: 'resourceUtilization', type: 'number' },
    { name: 'energyConsumption', type: 'number' }
  ];

  requiredFields.forEach(({ name, type }) => {
    if (summary[name] === undefined || summary[name] === null) {
      errors.push(`[${algorithmName}] summary.${name} is missing`);
    } else if (typeof summary[name] !== type) {
      warnings.push(`[${algorithmName}] summary.${name} is type ${typeof summary[name]}, expected ${type}`);
    }
  });

  if (!summary.responseTime && !summary.avgResponseTime) {
    warnings.push(`[${algorithmName}] Neither summary.responseTime nor summary.avgResponseTime found`);
  }

  if (summary.loadBalance === undefined && summary.loadImbalance === undefined) {
    warnings.push(`[${algorithmName}] Neither summary.loadBalance nor summary.loadImbalance found`);
  }

  if (rawResults.vmUtilization !== undefined) {
    if (!Array.isArray(rawResults.vmUtilization)) {
      errors.push(`[${algorithmName}] vmUtilization is not an array`);
    } else if (rawResults.vmUtilization.length > 0) {
      const firstVm = rawResults.vmUtilization[0];
      if (firstVm.cpuUtilization === undefined) {
        errors.push(`[${algorithmName}] vmUtilization[0].cpuUtilization is missing`);
      }
      if (firstVm.ramUtilization === undefined) {
        errors.push(`[${algorithmName}] vmUtilization[0].ramUtilization is missing`);
      }
    }
  }

  const valid = errors.length === 0;

  if (valid && warnings.length === 0) {
    console.log(`[${algorithmName}] ECharts data validation passed`);
  } else if (valid && warnings.length > 0) {
    console.warn(`[${algorithmName}] ECharts data validation passed with warnings:`, warnings);
  } else {
    console.error(`[${algorithmName}] ECharts data validation failed:`, errors);
    if (warnings.length > 0) {
      console.warn(`Additional warnings:`, warnings);
    }
  }

  return { valid, errors, warnings, summary };
};

export const logDataStructure = (rawResults, algorithmName) => {
  console.group(`📊 ${algorithmName} Data Structure`);
  console.log('rawResults:', rawResults);
  
  if (rawResults?.summary) {
    console.log('summary:', {
      makespan: rawResults.summary.makespan,
      responseTime: rawResults.summary.responseTime,
      avgResponseTime: rawResults.summary.avgResponseTime,
      resourceUtilization: rawResults.summary.resourceUtilization,
      energyConsumption: rawResults.summary.energyConsumption,
      loadBalance: rawResults.summary.loadBalance,
      loadImbalance: rawResults.summary.loadImbalance
    });
  }
  
  if (rawResults?.vmUtilization) {
    console.log('vmUtilization count:', rawResults.vmUtilization.length);
    if (rawResults.vmUtilization.length > 0) {
      console.log('vmUtilization[0]:', rawResults.vmUtilization[0]);
    }
  }
  
  console.groupEnd();
};
