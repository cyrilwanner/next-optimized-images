const { getUrlLoaderOptions } = require('./loaders/url-loader');
const { getFileLoaderOptions } = require('./loaders/file-loader');
const { getLqipLoaderOptions } = require('./loaders/lqip-loader');

/**
 * Configure the common resource queries
 */
const queries = [
  // ?url&original: combine url & original param
  {
    test: /(url.*original|original.*url)/,
    loaders: ['file-loader'],
    optimize: false,
  },

  // ?inline&original: combine inline & original param
  {
    test: /(inline.*original|original.*inline)/,
    loaders: ['url-loader'],
    options: [{
      limit: undefined,
    }],
    optimize: false,
  },

  // ?include&original: combine include & original param
  {
    test: /(include.*original|original.*include)/,
    loaders: ['raw-loader'],
    optimize: false,
  },

  // ?url: force a file url/reference, never use inlining
  {
    test: /url/,
    loaders: ['file-loader'],
    optimize: true,
  },

  // ?inline: force inlining an image regardless of the defined limit
  {
    test: /inline/,
    loaders: ['url-loader'],
    options: [{
      limit: undefined,
    }],
    optimize: true,
  },

  // ?include: include the image directly, no data uri or external file
  {
    test: /include/,
    loaders: ['raw-loader'],
    optimize: true,
  },

  // ?original: use the original image and don't optimize it
  {
    test: /original/,
    loaders: ['url-loader'],
    optimize: false,
  },

  // ?lqip: low quality image placeholder
  {
    test: /lqip(&|$)/,
    loaders: [
      require.resolve('./loaders/lqip-loader/picture-export-loader.js'),
      'lqip-loader',
      'url-loader',
    ],
    optimize: false,
  },

  // ?lqip: low quality image placeholder
  {
    test: /lqip-colors/,
    loaders: [
      require.resolve('./loaders/lqip-loader/colors-export-loader.js'),
      'lqip-loader',
      'url-loader',
    ],
    options: [{}, {
      base64: false,
      palette: true,
    }],
    optimize: false,
  },
];

/**
 * Returns all common resource queries for the given optimization loader
 *
 * @param {object} nextConfig - next.js configuration object
 * @param {boolean} isServer - if the current build is for a server
 * @param {string} optimizerLoaderName - name of the loader used to optimize the images
 * @param {object} optimizerLoaderOptions - config for the optimization loader
 * @returns {array}
 */
const getResourceQueries = (
  nextConfig,
  isServer,
  optimizerLoaderName,
  optimizerLoaderOptions,
) => {
  const loaderOptions = {
    'url-loader': getUrlLoaderOptions(nextConfig, isServer),
    'file-loader': getFileLoaderOptions(nextConfig, isServer),
    'lqip-loader': getLqipLoaderOptions(nextConfig, isServer),
  };

  return queries.map((queryConfig) => {
    const loaders = [];

    queryConfig.loaders.forEach((loader, index) => {
      const loaderConfig = {
        loader,
      };

      if (loaderOptions[loader]) {
        loaderConfig.options = loaderOptions[loader];
      }

      if (queryConfig.options) {
        loaderConfig.options = {
          ...(loaderConfig.options || {}),
          ...(queryConfig.options[index] || {}),
        };
      }

      loaders.push(loaderConfig);
    });

    return {
      resourceQuery: queryConfig.test,
      use: loaders.concat(queryConfig.optimize && optimizerLoaderName !== null ? [
        {
          loader: optimizerLoaderName,
          options: optimizerLoaderOptions,
        },
      ] : []),
    };
  });
};

module.exports = {
  getResourceQueries,
};
