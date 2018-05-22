const path = require('path');

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

  return Object.assign({}, defaultOptions, config || {});
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
 * Build loaders for resource queries.
 *
 * @param {string} imgLoaderName - name of the loader to use for images
 * @param {object} imgLoaderOptions - options to pass to the image loader
 * @param {object} fileLoaderOptions - options to pass to the file-loader
 * @param {object} urlLoaderOptions - options to pass to url-loader
 * @returns {array} loaders for resource queries
 */
const getResourceQueryLoaders = (imgLoaderName, imgLoaderOptions, fileLoaderOptions, urlLoaderOptions) => {
  const addImgLoader = (loaders) => {
    if (imgLoaderOptions === false) {
      return loaders;
    }

    return loaders.concat([
      {
        loader: imgLoaderName,
        options: imgLoaderOptions,
      },
    ]);
  };

  return [
    // ?include: include the image directly, no data uri or external file
    {
      resourceQuery: /include/,
      use: addImgLoader([
        {
          loader: 'raw-loader',
        },
      ]),
    },

    // ?inline: force inlining an image regardless of the defined limit
    {
      resourceQuery: /inline/,
      use: addImgLoader([
        {
          loader: 'url-loader',
          options: Object.assign(
            {},
            urlLoaderOptions,
            {
              limit: undefined,
            }
          ),
        },
      ]),
    },

    // ?url&original: combine url & original param
    {
      resourceQuery: /(url.*original|original.*url)/,
      use: [
        {
          loader: 'file-loader',
          options: fileLoaderOptions,
        },
      ],
    },

    // ?url: force a file url/reference, never use inlining
    {
      resourceQuery: /url/,
      use: addImgLoader([
        {
          loader: 'file-loader',
          options: fileLoaderOptions,
        },
      ]),
    },

    // ?original: use the original image and don't optimize it
    {
      resourceQuery: /original/,
      use: [
        {
          loader: 'url-loader',
          options: urlLoaderOptions,
        }
      ],
    },
  ];
};

/**
 * Configure webpack and next.js to handle and optimize images with this plugin.
 *
 * @param {object} param0 - configuration for next-optimized-plugins, see the readme for possible values
 */
const withOptimizedImages = (nextConfig) => {
  // extract config here without object rest spread as long as node 6 has to be supported
  if (!nextConfig) {
    nextConfig = {};
  }

  const {
    inlineImageLimit = 8192,
    imagesPublicPath,
    imagesOutputPath,
    imagesFolder = 'images',
    imagesName = '[name]-[hash].[ext]',
    optimizeImagesInDev = false,
    mozjpeg,
    optipng,
    pngquant = false,
    gifsicle,
    webp,
    svgo,
    svgSpriteLoader,
  } = nextConfig;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      const { dev, isServer } = options;

      // build options for file-loader
      const fileLoaderOptions = {
        publicPath: imagesPublicPath || `/_next/static/${imagesFolder}/`,
        outputPath: imagesOutputPath || `${isServer ? '../' : ''}static/${imagesFolder}/`,
        name: imagesName,
      };

      // build options for url-loader with file-loader as fallback
      const urlLoaderOptions = Object.assign({
        limit: inlineImageLimit,
        fallback: 'file-loader',
      }, fileLoaderOptions);

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

      // build options for webp-loader
      const webpLoaderOptions = getOptimizerConfig(webp);

      // push the loaders for jpg, png, svg and gif to the webpack configuration of next.js
      config.module.rules.push({
        test: getHandledFilesRegex(mozjpeg, optipng, pngquant, gifsicle, svgo),
        oneOf: [
          // ?include: include the image directly, no data uri or external file
          // ?inline: force inlining an image regardless of the defined limit
          // ?url: force a file url/reference, never use inlining
          // ?original: use the original image and don't optimize it
          ...getResourceQueryLoaders('img-loader', imgLoaderOptions, fileLoaderOptions, urlLoaderOptions),

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
                    mimetype: 'image/webp',
                  }
                ),
              },
              {
                loader: 'webp-loader',
                options: webpLoaderOptions || {},
              },
            ],
          },

          // ?sprite: add icon to sprite
          {
            resourceQuery: /sprite/,
            use: [
              {
                loader: 'svg-sprite-loader',
                options: getOptimizerConfig(svgSpriteLoader, {
                  runtimeGenerator: require.resolve(path.resolve(__dirname, 'svg-runtime-generator.js')),
                }),
              },
            ].concat(imgLoaderOptions.svgo !== false ? [
              {
                loader: 'img-loader',
                options: imgLoaderOptions,
              }
            ] : []),
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

      // push the loaders for webp to the webpack configuration of next.js
      if (webp !== false) {
        const webpLoaders = [
          {
            loader: 'url-loader',
            options: urlLoaderOptions,
          },
        ];

        if (webp !== null) {
          webpLoaders.push({
            loader: 'webp-loader',
            options: webpLoaderOptions,
          });
        }

        config.module.rules.push({
          test: /\.webp$/i,
          oneOf: [
            // ?include: include the image directly, no data uri or external file
            // ?inline: force inlining an image regardless of the defined limit
            // ?url: force a file url/reference, never use inlining
            // ?original: use the original image and don't optimize it
            ...getResourceQueryLoaders('webp-loader', webpLoaderOptions, fileLoaderOptions, urlLoaderOptions),

            // default behavior: inline if below the definied limit, external file if above
            {
              use: webpLoaders,
            },
          ],
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = withOptimizedImages;
