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

  return { valid, errors, warnings, summary };
};

export const logDataStructure = (rawResults, algorithmName) => {
  // Debug logging disabled in production
};
