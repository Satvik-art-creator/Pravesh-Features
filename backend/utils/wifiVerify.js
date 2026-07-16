const ipRangeCheck = require('ip-range-check');

/**
 * Checks whether a given IP address falls within the allowed WiFi ranges.
 *
 * Reads ALLOWED_IP_RANGES from environment — a comma-separated list of CIDR
 * ranges, e.g. "10.0.0.0/8,192.168.1.0/24".
 *
 * If ALLOWED_IP_RANGES is empty or unset, verification is skipped (returns true).
 * This is the intended default during the testing phase — WiFi enforcement can be
 * enabled later by simply setting the env var without changing any code.
 *
 * @param {string} requestIp - The client's IP address (from req.ip with trust proxy enabled)
 * @returns {boolean} true if the IP is within an allowed range, or if no ranges are configured
 */
const isWifiVerified = (requestIp) => {
  const ranges = (process.env.ALLOWED_IP_RANGES || '')
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);

  // No ranges configured — skip WiFi verification (testing mode)
  if (ranges.length === 0) return true;

  return ipRangeCheck(requestIp, ranges);
};

module.exports = isWifiVerified;
