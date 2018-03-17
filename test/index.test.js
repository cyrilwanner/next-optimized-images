const nextOptimizedImages = require('../index.js');

const getNextConfig = (options, webpackOptions = {}) => {
  const webpackConfig = {
    module: {
      rules: [],
    },
  };

  return nextOptimizedImages(options).webpack(Object.assign({}, webpackConfig), Object.assign({
    defaultLoaders: [],
    dev: false,
  }, webpackOptions));
};

describe('next-optimized-images', () => {
  /**
   * handling image types
   */
  describe('handling image types', () => {
    test('handles all images by default', () => {
      const config = getNextConfig();

      expect(config.module.rules).toHaveLength(2);

      const rule = config.module.rules[0];
      const webpRule = config.module.rules[1];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;
      const webpLoaderOptions = webpRule.oneOf[webpRule.oneOf.length - 1].use[1].options;

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
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
      expect(webpLoaderOptions).not.toBeFalsy();
    });

    test('jpg can get disabled', () => {
      const config = getNextConfig({ mozjpeg: false });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.jpg')).toEqual(false);
      expect(rule.test.test('.jpeg')).toEqual(false);
      expect(rule.test.test('.png')).toEqual(true);
      expect(rule.test.test('.gif')).toEqual(true);
      expect(rule.test.test('.svg')).toEqual(true);
      expect(rule.test.test('.JPG')).toEqual(false);
      expect(rule.test.test('.JPEG')).toEqual(false);
      expect(rule.test.test('.PNG')).toEqual(true);
      expect(rule.test.test('.GIF')).toEqual(true);
      expect(rule.test.test('.SVG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).toEqual(false);
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('jpg optimization can get disabled', () => {
      const config = getNextConfig({ mozjpeg: null });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.jpg')).toEqual(true);
      expect(rule.test.test('.jpeg')).toEqual(true);
      expect(rule.test.test('.JPEG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).toEqual(false);
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('png can get disabled', () => {
      const config = getNextConfig({ optipng: false, pngquant: false });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.jpg')).toEqual(true);
      expect(rule.test.test('.jpeg')).toEqual(true);
      expect(rule.test.test('.png')).toEqual(false);
      expect(rule.test.test('.gif')).toEqual(true);
      expect(rule.test.test('.svg')).toEqual(true);
      expect(rule.test.test('.JPG')).toEqual(true);
      expect(rule.test.test('.JPEG')).toEqual(true);
      expect(rule.test.test('.PNG')).toEqual(false);
      expect(rule.test.test('.GIF')).toEqual(true);
      expect(rule.test.test('.SVG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).toEqual(false);
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('png optimization can get disabled', () => {
      const config = getNextConfig({ optipng: null, pngquant: false });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.png')).toEqual(true);
      expect(rule.test.test('.PNG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).toEqual(false);
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('gif can get disabled', () => {
      const config = getNextConfig({ gifsicle: false });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.jpg')).toEqual(true);
      expect(rule.test.test('.jpeg')).toEqual(true);
      expect(rule.test.test('.png')).toEqual(true);
      expect(rule.test.test('.gif')).toEqual(false);
      expect(rule.test.test('.svg')).toEqual(true);
      expect(rule.test.test('.JPG')).toEqual(true);
      expect(rule.test.test('.JPEG')).toEqual(true);
      expect(rule.test.test('.PNG')).toEqual(true);
      expect(rule.test.test('.GIF')).toEqual(false);
      expect(rule.test.test('.SVG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).toEqual(false);
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('gif optimization can get disabled', () => {
      const config = getNextConfig({ gifsicle: null });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.gif')).toEqual(true);
      expect(rule.test.test('.GIF')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).toEqual(false);
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('svg can get disabled', () => {
      const config = getNextConfig({ svgo: false });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.jpg')).toEqual(true);
      expect(rule.test.test('.jpeg')).toEqual(true);
      expect(rule.test.test('.png')).toEqual(true);
      expect(rule.test.test('.gif')).toEqual(true);
      expect(rule.test.test('.svg')).toEqual(false);
      expect(rule.test.test('.JPG')).toEqual(true);
      expect(rule.test.test('.JPEG')).toEqual(true);
      expect(rule.test.test('.PNG')).toEqual(true);
      expect(rule.test.test('.GIF')).toEqual(true);
      expect(rule.test.test('.SVG')).toEqual(false);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).toEqual(false);
    });

    test('svg optimization can get disabled', () => {
      const config = getNextConfig({ svgo: null });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.svg')).toEqual(true);
      expect(rule.test.test('.SVG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).not.toBeFalsy();
      expect(imgLoaderOptions.pngquant).toEqual(false);
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).toEqual(false);
    });

    test('pngquant can get used as a png driver', () => {
      const config = getNextConfig({ optipng: false, pngquant: {} });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(rule.test.test('.png')).toEqual(true);
      expect(rule.test.test('.PNG')).toEqual(true);
      expect(imgLoaderOptions.mozjpeg).not.toBeFalsy();
      expect(imgLoaderOptions.optipng).toEqual(false);
      expect(imgLoaderOptions.pngquant).not.toBeFalsy();
      expect(imgLoaderOptions.gifsicle).not.toBeFalsy();
      expect(imgLoaderOptions.svgo).not.toBeFalsy();
    });

    test('webp can get disabled', () => {
      const config = getNextConfig({ webp: false });
      const rule = config.module.rules[0];

      expect(config.module.rules).toHaveLength(1);
      expect(rule.test.test('.webp')).toEqual(false);
      expect(rule.test.test('.WEBP')).toEqual(false);
    });

    test('webp optimization can get disabled', () => {
      const config = getNextConfig({ webp: null });
      const rule = config.module.rules[1];

      expect(rule.oneOf[rule.oneOf.length - 1].use).toHaveLength(1);
      expect(rule.test.test('.webp')).toEqual(true);
      expect(rule.test.test('.WEBP')).toEqual(true);
    });
  });

  /**
   * handling configuration options
   */
  describe('handling configuration options', () => {
    test('inlineImageLimit can get set', () => {
      const defaultLimit = getNextConfig();
      const defaultLimitRule = defaultLimit.module.rules[0];
      const defaultLimitUrlLoader = defaultLimitRule.oneOf[defaultLimitRule.oneOf.length - 1].use[0];

      expect(defaultLimitUrlLoader.options.limit).toEqual(8192);

      const setLimit = getNextConfig({ inlineImageLimit: 1234 });
      const setLimitRule = setLimit.module.rules[0];
      const setLimitUrlLoader = setLimitRule.oneOf[setLimitRule.oneOf.length - 1].use[0];

      expect(setLimitUrlLoader.options.limit).toEqual(1234);
    });

    test('imagesFolder can get set', () => {
      const defaultFolder = getNextConfig();
      const defaultFolderRule = defaultFolder.module.rules[0];
      const defaultFolderUrlLoader = defaultFolderRule.oneOf[defaultFolderRule.oneOf.length - 1].use[0];

      expect(defaultFolderUrlLoader.options.publicPath).toEqual('/_next/static/images/');
      expect(defaultFolderUrlLoader.options.outputPath).toEqual('static/images/');

      const setFolder = getNextConfig({ imagesFolder: 'foo/bar' });
      const setFolderRule = setFolder.module.rules[0];
      const setFolderUrlLoader = setFolderRule.oneOf[setFolderRule.oneOf.length - 1].use[0];

      expect(setFolderUrlLoader.options.publicPath).toEqual('/_next/static/foo/bar/');
      expect(setFolderUrlLoader.options.outputPath).toEqual('static/foo/bar/');
    });

    test('imagesName can get set', () => {
      const defaultName = getNextConfig();
      const defaultNameRule = defaultName.module.rules[0];
      const defaultNameUrlLoader = defaultNameRule.oneOf[defaultNameRule.oneOf.length - 1].use[0];

      expect(defaultNameUrlLoader.options.name).toEqual('[name]-[hash].[ext]');

      const setName = getNextConfig({ imagesName: 'my-new-image-[hash].[ext]' });
      const setNameRule = setName.module.rules[0];
      const setNameUrlLoader = setNameRule.oneOf[setNameRule.oneOf.length - 1].use[0];

      expect(setNameUrlLoader.options.name).toEqual('my-new-image-[hash].[ext]');
    });

    test('optimizeImagesInDev can get set', () => {
      const defaultInDev = getNextConfig();
      const defaultInDevRule = defaultInDev.module.rules[0];
      const defaultInDevImgLoader = defaultInDevRule.oneOf[defaultInDevRule.oneOf.length - 1].use[1];

      expect(defaultInDevImgLoader.options.enabled).toEqual(true);

      const defaultInDev2 = getNextConfig({}, { dev: true });
      const defaultInDev2Rule = defaultInDev2.module.rules[0];
      const defaultInDev2ImgLoader = defaultInDev2Rule.oneOf[defaultInDev2Rule.oneOf.length - 1].use[1];

      expect(defaultInDev2ImgLoader.options.enabled).toEqual(false);

      const setInDev = getNextConfig({ optimizeImagesInDev: true });
      const setInDevRule = setInDev.module.rules[0];
      const setInDevImgLoader = setInDevRule.oneOf[setInDevRule.oneOf.length - 1].use[1];

      expect(setInDevImgLoader.options.enabled).toEqual(true);

      const setInDev2 = getNextConfig({ optimizeImagesInDev: true }, { dev: true });
      const setInDev2Rule = setInDev2.module.rules[0];
      const setInDev2ImgLoader = setInDev2Rule.oneOf[setInDev2Rule.oneOf.length - 1].use[1];

      expect(setInDev2ImgLoader.options.enabled).toEqual(true);
    });

    test('propagate and merge configuration', () => {
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

    test('propagate optimization configs', () => {
      const config = getNextConfig({
        mozjpeg: {
          jpegQuality: 81,
        },
        optipng: {
          pngQuality: 82,
        },
        pngquant: {
          pngQuality: 83,
        },
        gifsicle: {
          gifQuality: 84,
        },
        webp: {
          webpQuality: 85,
        },
        svgo: {
          svgQuality: 86,
        },
      });
      const rule = config.module.rules[0];
      const imgLoaderOptions = rule.oneOf[rule.oneOf.length - 1].use[1].options;

      expect(imgLoaderOptions.mozjpeg.jpegQuality).toEqual(81);
      expect(imgLoaderOptions.optipng.pngQuality).toEqual(82);
      expect(imgLoaderOptions.pngquant.pngQuality).toEqual(83);
      expect(imgLoaderOptions.gifsicle.gifQuality).toEqual(84);
      expect(imgLoaderOptions.gifsicle.interlaced).toEqual(true);
      expect(imgLoaderOptions.webp).toBeUndefined();
      expect(imgLoaderOptions.svgo.svgQuality).toEqual(86);
    });
  });

  test('only support next.js >= 5', () => {
    expect(() => {
      getNextConfig({}, { defaultLoaders: false });
    }).toThrow();
  });

  /**
   * support query params
   */
  describe('support query params', () => {
    test('support include param', () => {
      const config = getNextConfig();
      const rule = config.module.rules[0];

      let matches = 0;

      rule.oneOf.forEach((resourceUrl) => {
        if (resourceUrl.resourceQuery && resourceUrl.resourceQuery.test('include')) {
          matches += 1;

          expect(resourceUrl.use[0].loader).toEqual('raw-loader');
          expect(resourceUrl.use[1].loader).toEqual('img-loader');
        }
      });

      expect(matches).toEqual(1);
    });

    test('support inline param', () => {
      const config = getNextConfig();
      const rule = config.module.rules[0];

      let matches = 0;

      rule.oneOf.forEach((resourceUrl) => {
        if (resourceUrl.resourceQuery && resourceUrl.resourceQuery.test('inline')) {
          matches += 1;

          expect(resourceUrl.use[0].loader).toEqual('url-loader');
          expect(resourceUrl.use[0].options.limit).toBeUndefined();
          expect(resourceUrl.use[1].loader).toEqual('img-loader');
        }
      });

      expect(matches).toEqual(1);
    });

    test('support webp param', () => {
      const config = getNextConfig({ imagesName: '[name].[ext]' });
      const rule = config.module.rules[0];

      let matches = 0;

      rule.oneOf.forEach((resourceUrl) => {
        if (resourceUrl.resourceQuery && resourceUrl.resourceQuery.test('webp')) {
          matches += 1;

          expect(resourceUrl.use[0].loader).toEqual('url-loader');
          expect(resourceUrl.use[0].options.mimetype).toEqual('image/webp');
          expect(resourceUrl.use[0].options.name).toEqual('[name].[ext].webp');
          expect(resourceUrl.use[1].loader).toEqual('webp-loader');
        }
      });

      expect(matches).toEqual(1);
    });
  });
});
