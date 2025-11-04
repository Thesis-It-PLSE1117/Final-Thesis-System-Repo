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
    //tng ina finally found a fix for supscript
  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '-': '⁻', '+': '⁺'
  };

  const exponentStr = exponent >= 0 ? `+${exponent}` : String(exponent);
  const superscriptExponent = exponentStr
    .split('')
    .map(char => superscripts[char] || char)
    .join('');

  return `${trimmedMantissa}×10${superscriptExponent}`;
};
