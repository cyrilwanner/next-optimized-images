import { getUrlLoaderOptions } from './loaders/url-loader';
import { getFileLoaderOptions } from './loaders/file-loader';

const queries = [
  // ?include: include the image directly, no data uri or external file
  {
    test: /include/,
    loader: 'raw-loader',
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

  // ?url&original: combine url & original param
  {
    test: /(url.*original|original.*url)/,
    loader: 'file-loader',
    optimize: false,
  },

  // ?url: force a file url/reference, never use inlining
  {
    test: /url/,
    loader: 'file-loader',
    optimize: true,
  },

  // ?original: use the original image and don't optimize it
  {
    test: /original/,
    loader: 'url-loader',
    optimize: false,
  },
];

export const getResourceQueries = (
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
