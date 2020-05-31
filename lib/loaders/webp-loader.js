const { getUrlLoaderOptions } = require('./url-loader');
const { getResourceQueries } = require('../resource-queries');

/**
 * Build options for the webp loader
 *
 * @param {object} nextConfig - next.js configuration
 * @returns {object}
 */
const getWebpLoaderOptions = ({ webp }) => webp || {};

/**
 * Apply the webp loader to the webpack configuration
 *
 * @param {object} webpackConfig - webpack configuration
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} optimize - if images should get optimized
 * @param {boolean} isServer - if the build is for the server
 * @param {object} detectedLoaders - all detected and installed loaders
 * @returns {object}
 */
const applyWebpLoader = (webpackConfig, nextConfig, optimize, isServer, detectLoaders) => {
  const webpLoaders = [
    {
      loader: 'url-loader',
      options: getUrlLoaderOptions(nextConfig, isServer),
    },
  ];

  if (optimize) {
    webpLoaders.push({
      loader: 'webp-loader',
      options: getWebpLoaderOptions(nextConfig),
    });
  }

  webpackConfig.module.rules.push({
    test: /\.webp$/i,
    oneOf: [
      // add all resource queries
      ...getResourceQueries(nextConfig, isServer, !optimize ? null : 'webp-loader', getWebpLoaderOptions(nextConfig), detectLoaders),

      // default behavior: inline if below the definied limit, external file if above
      {
        use: webpLoaders,
      },
    ],
  });

  return webpackConfig;
};

/**
 * Returns the resource query definition for converting a jpeg/png image to webp
 *
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} isServer - if the build is for the server
 * @returns {object}
 */
const getWebpResourceQuery = (nextConfig, isServer) => {
  const urlLoaderOptions = getUrlLoaderOptions(nextConfig, isServer);
  const imageName = urlLoaderOptions.name.indexOf('[ext]') >= 0
    ? urlLoaderOptions.name.replace('[ext]', nextConfig.removeOriginalExtension ? 'webp' : '[ext].webp')
    : `${urlLoaderOptions.name}.webp`;

  return {
    resourceQuery: /webp/,
    use: [
      {
        loader: 'url-loader',
        options: Object.assign(
          {},
          urlLoaderOptions,
          {
            name: imageName,
            mimetype: 'image/webp',
          },
        ),
      },
      {
        loader: 'webp-loader',
        options: getWebpLoaderOptions(nextConfig),
      },
    ],
  };
};

module.exports = {
  getWebpLoaderOptions,
  applyWebpLoader,
  getWebpResourceQuery,
};
