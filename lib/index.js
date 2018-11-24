const { getConfig } = require('./config');
const { detectLoaders, getNumOptimizationLoadersInstalled, appendLoaders } = require('./loaders');
const { showWarning } = require('./migrater');

/**
 * Configure webpack and next.js to handle and optimize images with this plugin.
 *
 * @param {object} nextConfig - configuration, see the readme for possible values
 * @param {object} nextComposePlugins - additional information when loaded with next-compose-plugins
 * @returns {object}
 */
const withOptimizedImages = (nextConfig = {}, nextComposePlugins = {}) => {
  const { optimizeImages, optimizeImagesInDev, overwriteImageLoaderPaths } = getConfig(nextConfig);

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const { dev, isServer } = options;
      let enrichedConfig = config;

      // detect all installed loaders
      const detectedLoaders = detectLoaders(overwriteImageLoaderPaths);

      // check if it should optimize images in the current step
      const optimizeInCurrentStep = nextComposePlugins && typeof nextComposePlugins.phase === 'string'
        ? (
          nextComposePlugins.phase === 'phase-production-build'
          || nextComposePlugins.phase === 'phase-export'
          || (nextComposePlugins.phase === 'phase-development-server' && optimizeImagesInDev)
        )
        : (!dev || optimizeImagesInDev);

      // show a warning if images should get optimized but no loader is installed
      if (optimizeImages && getNumOptimizationLoadersInstalled(detectedLoaders) === 0 && isServer) {
        showWarning();
      }

      // append loaders
      enrichedConfig = appendLoaders(config, getConfig(nextConfig), detectedLoaders,
        isServer, optimizeInCurrentStep);

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(enrichedConfig, options);
      }

      return enrichedConfig;
    },
  });
};

module.exports = withOptimizedImages;
