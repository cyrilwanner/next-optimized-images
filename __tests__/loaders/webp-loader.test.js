const { getConfig } = require('../../lib/config');
const {
  getWebpLoaderOptions,
  applyWebpLoader,
  getWebpResourceQuery,
} = require('../../lib/loaders/webp-loader');

describe('next-optimized-images/loaders/webp-loader', () => {
  it('uses the default config', () => {
    const options = getWebpLoaderOptions(getConfig({}), false);

    expect(options).toEqual({});
  });

  it('allows overwriting the default options', () => {
    const options = getWebpLoaderOptions(getConfig({ webp: { a: 1 } }), false);

    expect(options).toEqual({ a: 1 });
  });

  it('adds rules to the webpack config', () => {
    const webpackConfig = { module: { rules: [] } };
    applyWebpLoader(webpackConfig, getConfig({}), true, false, {});

    const rule = webpackConfig.module.rules[0];

    expect(rule.test).toBeInstanceOf(RegExp);
    expect(rule.test.test('.webp')).toEqual(true);
    expect(rule.oneOf).toHaveLength(13);
  });

  it('generates a resource query for webp conversion', () => {
    const config = getWebpResourceQuery(getConfig({}), false);

    expect(config.resourceQuery.test('img.jpg?webp')).toEqual(true);
    expect(config.use).toHaveLength(2);
    expect(config.use[0].loader).toEqual('url-loader');
    expect(config.use[1].loader).toEqual('webp-loader');
  });
});
