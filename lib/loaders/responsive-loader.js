const path = require('path');
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
    adapter = require(`${detectedLoaders.responsive}${path.sep}sharp`); // eslint-disable-line
  }

  return {
    ...getFileLoaderOptions(nextConfig, isServer),
    name: '[name]-[width]-[hash].[ext]',
    ...(responsive || {}),
    adapter,
  };
};

/**
 * Apply the responsive loader to the webpack configuration
 *
 * @param {object} webpackConfig - webpack configuration
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} isServer - if the build is for the server
 * @param {object} detectedLoaders - all detected and installed loaders
 * @returns {object}
 */
const applyResponsiveLoader = (webpackConfig, nextConfig, isServer, detectedLoaders) => {
  webpackConfig.module.rules.push({
    test: /\.(jpe?g|png)$/i,
    oneOf: [
      {
        use: {
          loader: 'responsive-loader',
          options: getResponsiveLoaderOptions(nextConfig, isServer, detectedLoaders),
        },
      },
    ],
  });

  return webpackConfig;
};

module.exports = {
  getResponsiveLoaderOptions,
  applyResponsiveLoader,
};
