const { getUrlLoaderOptions } = require('./loaders/url-loader');
const { getFileLoaderOptions } = require('./loaders/file-loader');

/**
 * Configure the common resource queries
 */
const queries = [
  // ?url&original: combine url & original param
  {
    test: /(url.*original|original.*url)/,
    loader: 'file-loader',
    optimize: false,
  },

  // ?inline&original: combine inline & original param
  {
    test: /(inline.*original|original.*inline)/,
    loader: 'url-loader',
    options: {
      limit: undefined,
    },
    optimize: false,
  },

  // ?include&original: combine include & original param
  {
    test: /(include.*original|original.*include)/,
    loader: 'raw-loader',
    optimize: false,
  },

  // ?url: force a file url/reference, never use inlining
  {
    test: /url/,
    loader: 'file-loader',
    optimize: true,
  },

  // ?inline: force inlining an image regardless of the defined limit
  {
    test: /inline/,
    loader: 'url-loader',
    options: {
      limit: undefined,
    },
    optimize: true,
  },

  // ?include: include the image directly, no data uri or external file
  {
    test: /include/,
    loader: 'raw-loader',
    optimize: true,
  },

  // ?original: use the original image and don't optimize it
  {
    test: /original/,
    loader: 'url-loader',
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
  };

  return queries.map((queryConfig) => {
    const loaderConfig = {
      loader: queryConfig.loader,
    };

    if (loaderOptions[queryConfig.loader]) {
      loaderConfig.options = loaderOptions[queryConfig.loader];
    }

    if (queryConfig.options) {
      loaderConfig.options = {
        ...(loaderConfig.options || {}),
        ...queryConfig.options,
      };
    }

    return {
      resourceQuery: queryConfig.test,
      use: [
        loaderConfig,
      ].concat(queryConfig.optimize && optimizerLoaderName !== null ? [
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
