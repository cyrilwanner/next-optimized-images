const { getFileLoaderOptions } = require('./file-loader');

const getUrlLoaderOptions = ({
  inlineImageLimit = 8192,
  ...config
}, isServer) => ({
  ...getFileLoaderOptions(config, isServer),
  limit: inlineImageLimit,
  fallback: 'file-loader',
});

module.exports = {
  getUrlLoaderOptions,
};
