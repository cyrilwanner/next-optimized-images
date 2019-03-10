const {
  getImgLoaderOptions,
  getHandledFilesRegex,
  applyImgLoader,
  requireImageminPlugin,
} = require('../../lib/loaders/img-loader');
const { getConfig } = require('../../lib/config');

module.exports = () => () => ({ plugin: true });

describe('next-optimized-images/loaders/img-loader', () => {
  it('adds the correct plugins', () => {
    const plugins1 = getImgLoaderOptions({}, { png: __filename }, true);
    const plugins2 = getImgLoaderOptions({}, { png: __filename }, false);

    expect(plugins1.plugins).toHaveLength(1);
    expect(plugins2.plugins).toHaveLength(0);
  });

  it('allows overwriting the resolve path', () => {
    const plugin = requireImageminPlugin('img-loader.test.js', { overwriteImageLoaderPaths: __dirname });

    expect(plugin()).toEqual({ plugin: true });
  });

  it('generates the correct file regex', () => {
    const regex1 = getHandledFilesRegex({
      jpeg: true,
      png: false,
      svg: false,
      gif: false,
    });
    const regex2 = getHandledFilesRegex({
      jpeg: false,
      png: false,
      svg: true,
      gif: true,
    });
    const regex3 = getHandledFilesRegex({
      jpeg: true,
      png: true,
      svg: true,
      gif: true,
    });

    expect(regex1.test('.jpg')).toEqual(true);
    expect(regex1.test('.jpeg')).toEqual(true);
    expect(regex1.test('.JpEg')).toEqual(true);
    expect(regex1.test('.png')).toEqual(false);
    expect(regex1.test('.svg')).toEqual(false);
    expect(regex1.test('.gif')).toEqual(false);

    expect(regex2.test('.jpg')).toEqual(false);
    expect(regex2.test('.png')).toEqual(false);
    expect(regex2.test('.svg')).toEqual(true);
    expect(regex2.test('.gif')).toEqual(true);

    expect(regex3.test('.jpg')).toEqual(true);
    expect(regex3.test('.png')).toEqual(true);
    expect(regex3.test('.svg')).toEqual(true);
    expect(regex3.test('.gif')).toEqual(true);
  });

  it('adds rules to the webpack config', () => {
    const webpackConfig = { module: { rules: [] } };
    applyImgLoader(webpackConfig, getConfig({}), true, false, {
      jpeg: '../../__tests__/loaders/img-loader.test.js',
      png: false,
      svg: '../../__tests__/loaders/img-loader.test.js',
      gif: false,
    }, {
      jpeg: true,
      png: true,
      svg: true,
      gif: false,
    });

    const rule = webpackConfig.module.rules[0];

    expect(rule.test).toBeInstanceOf(RegExp);
    expect(rule.oneOf).toHaveLength(13);
  });
});
