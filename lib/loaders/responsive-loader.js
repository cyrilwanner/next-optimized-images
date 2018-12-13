const { getFileLoaderOptions } = require('./file-loader');

/**
 * Build options for the webpack responsive loader
 *
 * @param {object} nextConfig - next.js configuration
 * @param {object} detectedLoaders - all detected and installed loaders
 * @returns {object}
 */
const getResponsiveLoaderOptions = ({
  responsive,
  ...nextConfig
}, isServer, detectedLoaders) => {
  let adapter = responsive ? responsive.adapter : undefined;

  if (!adapter && detectedLoaders.responsiveAdapter === 'sharp') {
    adapter = require(`${detectedLoaders.responsive}/sharp`); // eslint-disable-line
  }

  return {
    ...getFileLoaderOptions(nextConfig, isServer),
    name: '[name]-[width]-[hash].[ext]',
    ...(responsive || {}),
    adapter,
  };
};

module.exports = {
  getResponsiveLoaderOptions,
};
