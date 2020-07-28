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
          (nextComposePlugins.phase === 'phase-production-build' && optimizeImages)
          || (nextComposePlugins.phase === 'phase-export' && optimizeImages)
          || (nextComposePlugins.phase === 'phase-development-server' && optimizeImagesInDev)
        )
        : ((!dev && optimizeImages) || (dev && optimizeImagesInDev));

      // show a warning if images should get optimized but no loader is installed
      if (optimizeImages && getNumOptimizationLoadersInstalled(detectedLoaders) === 0 && isServer) {
        showWarning();
      }

      // remove (unoptimized) builtin image processing introduced in next.js 9.2
      if (enrichedConfig.module.rules) {
        enrichedConfig.module.rules.forEach((rule) => {
          if (rule.oneOf) {
            rule.oneOf.forEach((subRule) => {
              if (
                subRule.issuer && !subRule.test && !subRule.include && subRule.exclude
                && subRule.use && subRule.use.options && subRule.use.options.name
              ) {
                if ((String(subRule.issuer.test) === '/\\.(css|scss|sass)$/' || String(subRule.issuer) === '/\\.(css|scss|sass)$/') && subRule.use.options.name.startsWith('static/media/')) {
                  subRule.exclude.push(/\.(jpg|jpeg|png|svg|webp|gif|ico)$/);
                }
              }
            });
          }
        });
      }

      // append loaders
      enrichedConfig = appendLoaders(enrichedConfig, getConfig(nextConfig), detectedLoaders,
        isServer, optimizeInCurrentStep);

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(enrichedConfig, options);
      }

      return enrichedConfig;
    },
  });
};

module.exports = withOptimizedImages;
