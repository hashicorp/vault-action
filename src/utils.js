/**
 * Replaces any dot chars to __ and removes non-ascii charts
 * @param {string} dataKey
 * @param {boolean=} isEnvVar
 */
function normalizeOutputKey(dataKey, upperCase = false) {
  let outputKey = dataKey
    .replace(".", "__")
    .replace(new RegExp("-", "g"), "")
    .replace(/[^\p{L}\p{N}_-]/gu, "");
  if (upperCase) {
    outputKey = outputKey.toUpperCase();
  }
  return outputKey;
}

module.exports = { 
    normalizeOutputKey 
};
