/**
 * Converts possible configuration values for an image optimizer.
 *
 * @param {object|boolean} config - configuration for the optimizer
 * @param {object} defaultOptions - default configuration if `config` is undefined (optional)
 * @returns {object|boolean} configuration object or false if this optimizer is disabled
 */
const getOptimizerConfig = (config, defaultOptions = {}) => {
  if (config === null || config === false) {
    return false;
  }

  return config || defaultOptions;
};

/**
 * Build the regex for webpack for all image types which should get handled by this plugin.
 *
 * @param {object|boolean} mozjpeg - configuration for mozjpeg or false to disable handling jpg files
 * @param {object|boolean} optipng - configuration for optipng or false to disable handling png files if pngquant is also set to false
 * @param {object|boolean} pngquant - configuration for pngquant or false to disable handling png files if optipng is also set to false
 * @param {object|boolean} gifsicle - configuration for gifsicle or false to disable handling gif files
 * @param {object|boolean} svgo - configuration for svgo or false to disable handling svg files
 * @returns {RegExp} RegExp matching all files which this plugin should handle
 */
const getHandledFilesRegex = (mozjpeg, optipng, pngquant, gifsicle, svgo) => {
  const handledFiles = [];

  if (mozjpeg !== false) {
    handledFiles.push('jpe?g');
  }
  if (optipng !== false || pngquant !== false) {
    handledFiles.push('png');
  }
  if (gifsicle !== false) {
    handledFiles.push('gif');
  }
  if (svgo !== false) {
    handledFiles.push('svg');
  }

  return new RegExp(`\.(${handledFiles.join('|')})$`, 'i');
};

/**
 * Configure webpack and next.js to handle and optimize images with this plugin.
 *
 * @param {object} param0 - configuration for next-optimized-plugins, see the readme for possible values
 */
const withOptimizedImages = ({
  inlineImageLimit = 8192,
  imagesFolder = 'images',
  imagesName = '[name]-[hash].[ext]',
  optimizeImagesInDev = false,
  mozjpeg,
  optipng,
  pngquant = false,
  gifsicle,
  webp = {},
  svgo,
  ...nextConfig
} = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      const { dev } = options;

      // build options for url-loader with file-loader as fallback
      const urlLoaderOptions = {
        limit: inlineImageLimit,
        fallback: 'file-loader',
        publicPath: `/_next/static/${imagesFolder}/`,
        outputPath: `static/${imagesFolder}/`,
        name: imagesName,
      };

      // build options for img-loader
      const imgLoaderOptions = {
        enabled: !dev || optimizeImagesInDev,
        mozjpeg: getOptimizerConfig(mozjpeg),
        optipng: getOptimizerConfig(optipng),
        pngquant: getOptimizerConfig(pngquant),
        gifsicle: getOptimizerConfig(gifsicle, {
          interlaced: true,
          optimizationLevel: 3,
        }),
        svgo: getOptimizerConfig(svgo),
      };

      // push the loaders to the webpack configuration of next.js
      config.module.rules.push({
        test: getHandledFilesRegex(mozjpeg, optipng, pngquant, gifsicle, svgo),
        oneOf: [
          // ?include: include the image directly, no data uri or external file
          {
            resourceQuery: /include/,
            use: [
              {
                loader: 'raw-loader',
              },
              {
                loader: 'img-loader',
                options: imgLoaderOptions,
              },
            ],
          },

          // ?inline: force inlining an image regardless of the defined limit
          {
            resourceQuery: /inline/,
            use: [
              {
                loader: 'url-loader',
                options: Object.assign(
                  {},
                  urlLoaderOptions,
                  {
                    limit: undefined,
                  },
                ),
              },
              {
                loader: 'img-loader',
                options: imgLoaderOptions,
              },
            ],
          },

          // ?webp: convert an image to webp
          {
            resourceQuery: /webp/,
            use: [
              {
                loader: 'url-loader',
                options: Object.assign(
                  {},
                  urlLoaderOptions,
                  {
                    name: `${imagesName}.webp`,
                  },
                ),
              },
              {
                loader: `webp-loader`,
                options: webp,
              },
            ],
          },

          // default behavior: inline if below the definied limit, external file if above
          {
            use: [
              {
                loader: 'url-loader',
                options: urlLoaderOptions,
              },
              {
                loader: 'img-loader',
                options: imgLoaderOptions,
              },
            ],
          },
        ],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = withOptimizedImages;
