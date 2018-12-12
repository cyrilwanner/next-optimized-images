const { getFileLoaderOptions } = require('../file-loader');

/**
 * Build options for the webpack lqip loader
 *
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} isServer - if the build is for the server
 * @returns {object}
 */
const getLqipLoaderOptions = (nextConfig, isServer) => ({
  ...getFileLoaderOptions(nextConfig, isServer),
  ...(nextConfig.lqip || {}),
});

module.exports = {
  getLqipLoaderOptions,
};
