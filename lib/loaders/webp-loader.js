const { getUrlLoaderOptions } = require('./url-loader');
const { getResourceQueries } = require('../resource-queries');

const getWebpLoaderOptions = ({ webp }) => webp || {};

const applyWebpLoader = (webpackConfig, nextConfig, optimize, isServer) => {
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
      ...getResourceQueries(nextConfig, isServer, !optimize ? null : 'webp-loader', getWebpLoaderOptions(nextConfig)),

      // default behavior: inline if below the definied limit, external file if above
      {
        use: webpLoaders,
      },
    ],
  });

  return webpackConfig;
};

const getWebpResourceQuery = (nextConfig, isServer) => {
  const urlLoaderOptions = getUrlLoaderOptions(nextConfig, isServer);

  return {
    resourceQuery: /webp/,
    use: [
      {
        loader: 'url-loader',
        options: Object.assign(
          {},
          urlLoaderOptions,
          {
            name: `${urlLoaderOptions.name}.webp`,
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
