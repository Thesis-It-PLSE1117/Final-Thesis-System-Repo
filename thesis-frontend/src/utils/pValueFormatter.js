export const formatPValue = (pValue, decimals = 4) => {
  if (typeof pValue !== "number" || isNaN(pValue)) {
    return "—";
  }

  if (pValue >= Math.pow(10, -decimals)) {
    return pValue.toFixed(decimals);
  }

  if (pValue <= 0) {
    return "0.0000";
  }

  const exponent = Math.floor(Math.log10(Math.abs(pValue)));
  const mantissa = pValue / Math.pow(10, exponent);

  const formattedMantissa = mantissa.toFixed(decimals - 1);
  const trimmedMantissa = formattedMantissa.replace(/\.?0+$/, "");

  return `${trimmedMantissa}×10${exponent >= 0 ? "+" : ""}${exponent}`;
};
