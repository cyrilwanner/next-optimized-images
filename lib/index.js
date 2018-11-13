import { detectLoaders, getNumLoadersInstalled, appendLoaders } from './loaders';
import { showWarning } from './migrater';

/**
 * Configure webpack and next.js to handle and optimize images with this plugin.
 *
 * @param {object} nextConfig - configuration, see the readme for possible values
 * @param {object} nextComposePlugins - additional information when loaded with next-compose-plugins
 */
const withOptimizedImages = (nextConfig = {}, nextComposePlugins = {}) => {
  const {
    optimizeImages = true,
    optimizeImagesInDev = false,
    /* v1 options:
    inlineImageLimit = 8192,
    imagesPublicPath,
    imagesOutputPath,
    imagesFolder = 'images',
    imagesName = '[name]-[hash].[ext]',
    mozjpeg,
    optipng,
    pngquant = false,
    gifsicle,
    webp,
    svgo,
    svgSpriteLoader, */
  } = nextConfig;

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
      const detectedLoaders = detectLoaders();

      // check if it should optimize images in the current step
      const optimizeInCurrentStep = nextComposePlugins && typeof nextComposePlugins.phase === 'string'
        ? (
          nextComposePlugins.phase === 'phase-production-build'
          || nextComposePlugins.phase === 'phase-export'
          || (nextComposePlugins.phase === 'phase-development-server' && optimizeImagesInDev)
        )
        : (!dev || optimizeImagesInDev);

      // show a warning if images should get optimized but no loader is installed
      if (optimizeImages && optimizeInCurrentStep && !getNumLoadersInstalled(detectedLoaders)) {
        showWarning();
      }

      // append loaders
      enrichedConfig = appendLoaders(config, nextConfig, detectedLoaders,
        isServer, optimizeInCurrentStep);

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(enrichedConfig, options);
      }

      return enrichedConfig;
    },
  });
};

module.exports = withOptimizedImages;
