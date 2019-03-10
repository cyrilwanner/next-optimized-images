/**
 * Build options for the webpack image trace loader
 *
 * @param {object} nextConfig - next.js configuration
 * @returns {object}
 */
const getImageTraceLoaderOptions = ({
  imageTrace,
}) => ({
  ...(imageTrace || {}),
});

module.exports = {
  getImageTraceLoaderOptions,
};
