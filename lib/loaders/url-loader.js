import { getFileLoaderOptions } from './file-loader';

export const getUrlLoaderOptions = ({
  inlineImageLimit = 8192,
  ...config
}, isServer) => ({
  ...getFileLoaderOptions(config, isServer),
  limit: inlineImageLimit,
  fallback: 'file-loader',
});
