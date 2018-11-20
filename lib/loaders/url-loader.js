const { getFileLoaderOptions } = require('./file-loader');

const getUrlLoaderOptions = ({
  inlineImageLimit,
  ...config
}, isServer) => ({
  ...getFileLoaderOptions(config, isServer),
  limit: inlineImageLimit,
  fallback: 'file-loader',
});

module.exports = {
  getUrlLoaderOptions,
};
