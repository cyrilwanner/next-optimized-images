const { getConfig } = require('../../lib/config');
const { getUrlLoaderOptions } = require('../../lib/loaders/url-loader');
const { getFileLoaderPath } = require('../../lib/loaders/file-loader');

describe('next-optimized-images/loaders/url-loader', () => {
  it('uses the default config', () => {
    const options = getUrlLoaderOptions(getConfig({}), false);

    expect(options.limit).toEqual(8192);
    expect(options.fallback).toEqual(getFileLoaderPath());
    expect(options.name).toEqual('[name]-[hash].[ext]');
  });

  it('allows overwriting the inlineImageLimit option', () => {
    const options = getUrlLoaderOptions(getConfig({ inlineImageLimit: 10 }), false);

    expect(options.limit).toEqual(10);
  });
});
