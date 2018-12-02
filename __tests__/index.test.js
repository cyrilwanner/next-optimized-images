const withOptimizedImages = require('../lib');

const getNextConfig = (options, webpackOptions = {}) => {
  const webpackConfig = {
    module: {
      rules: [],
    },
  };

  return withOptimizedImages(options).webpack(Object.assign({}, webpackConfig), Object.assign({
    defaultLoaders: [],
    dev: false,
  }, webpackOptions));
};

describe('next-optimized-images', () => {
  it('returns a next.js config object', () => {
    const config = withOptimizedImages();

    expect(typeof config.webpack).toBe('function');
  });

  it('handles all images by default', () => {
    const config = getNextConfig();

    expect(config.module.rules).toHaveLength(2);

    const rule = config.module.rules[0];
    const webpRule = config.module.rules[1];

    expect(rule.test.test('.jpg')).toEqual(true);
    expect(rule.test.test('.jpeg')).toEqual(true);
    expect(rule.test.test('.png')).toEqual(true);
    expect(rule.test.test('.gif')).toEqual(true);
    expect(rule.test.test('.svg')).toEqual(true);
    expect(rule.test.test('.JPG')).toEqual(true);
    expect(rule.test.test('.JPEG')).toEqual(true);
    expect(rule.test.test('.PNG')).toEqual(true);
    expect(rule.test.test('.GIF')).toEqual(true);
    expect(rule.test.test('.SVG')).toEqual(true);
    expect(rule.test.test('.webp')).toEqual(false);
    expect(rule.test.test('.WEBP')).toEqual(false);
    expect(webpRule.test.test('.webp')).toEqual(true);
    expect(webpRule.test.test('.WEBP')).toEqual(true);
  });

  it('can disable image types', () => {
    const config = getNextConfig({ handleImages: ['jpeg'] });

    expect(config.module.rules).toHaveLength(1);

    const rule = config.module.rules[0];

    expect(rule.test.test('.jpg')).toEqual(true);
    expect(rule.test.test('.jpeg')).toEqual(true);
    expect(rule.test.test('.png')).toEqual(false);
    expect(rule.test.test('.gif')).toEqual(false);
    expect(rule.test.test('.svg')).toEqual(false);
    expect(rule.test.test('.JPG')).toEqual(true);
    expect(rule.test.test('.JPEG')).toEqual(true);
    expect(rule.test.test('.PNG')).toEqual(false);
    expect(rule.test.test('.GIF')).toEqual(false);
    expect(rule.test.test('.SVG')).toEqual(false);
    expect(rule.test.test('.webp')).toEqual(false);
    expect(rule.test.test('.WEBP')).toEqual(false);
  });

  it('propagates and merges configuration', () => {
    const config = getNextConfig({
      webpack: (webpackConfig, webpackOptions) => {
        expect(webpackConfig.module.rules).toHaveLength(2);
        expect(webpackOptions.dev).toEqual(false);
        expect(webpackOptions.foo).toEqual('bar');

        return Object.assign({
          changed: true,
        }, webpackConfig);
      },
    }, { foo: 'bar' });

    expect(config.module.rules).toHaveLength(2);
    expect(config.changed).toEqual(true);
  });

  it('only supports next.js >= 5', () => {
    expect(() => {
      getNextConfig({}, { defaultLoaders: false });
    }).toThrow();
  });
});
