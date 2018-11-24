const { getFileLoaderOptions } = require('./file-loader');

/**
 * Build options for the webpack url loader
 *
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} isServer - if the build is for the server
 * @returns {object}
 */
const getUrlLoaderOptions = ({
  inlineImageLimit,
  ...config
}, isServer) => ({
  ...getFileLoaderOptions(config, isServer),
  limit: inlineImageLimit,
  fallback: 'file-loader',
});

module.exports = {
  getUrlLoaderOptions,
};
