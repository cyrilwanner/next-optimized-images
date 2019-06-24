const { applyImgLoader } = require('./img-loader');
const { applyWebpLoader } = require('./webp-loader');
const { applyResponsiveLoader } = require('./responsive-loader');
const { applyFileLoader } = require('./file-loader');

/**
 * Checks if a node module is installed in the current context
 *
 * @param {string} name - module name
 * @param {string} resolvePath - optional resolve path
 * @returns {boolean}
 */
const isModuleInstalled = (name, resolvePath) => {
  try {
    require.resolve(name, resolvePath ? { paths: [resolvePath] } : undefined);

    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Detects all currently installed image optimization loaders
 *
 * @param {string} resolvePath - optional resolve path
 * @returns {object}
 */
const detectLoaders = (resolvePath) => {
  const jpeg = isModuleInstalled('imagemin-mozjpeg', resolvePath) ? 'imagemin-mozjpeg' : false;
  const gif = isModuleInstalled('imagemin-gifsicle', resolvePath) ? 'imagemin-gifsicle' : false;
  const svg = isModuleInstalled('imagemin-svgo', resolvePath) ? 'imagemin-svgo' : false;
  const svgSprite = isModuleInstalled('svg-sprite-loader', resolvePath) ? 'svg-sprite-loader' : false;
  const webp = isModuleInstalled('webp-loader', resolvePath) ? 'webp-loader' : false;
  const lqip = isModuleInstalled('lqip-loader', resolvePath) ? 'lqip-loader' : false;

  let png = false;
  let responsive = false;
  let responsiveAdapter = false;

  if (isModuleInstalled('imagemin-optipng', resolvePath)) {
    png = 'imagemin-optipng';
  } else if (isModuleInstalled('imagemin-pngquant', resolvePath)) {
    png = 'imagemin-pngquant';
  }

  if (isModuleInstalled('responsive-loader', resolvePath)) {
    responsive = require.resolve('responsive-loader', resolvePath ? { paths: [resolvePath] } : undefined).replace(/(\/|\\)lib(\/|\\)index.js$/g, '');

    if (isModuleInstalled('sharp', resolvePath)) {
      responsiveAdapter = 'sharp';
    } else if (isModuleInstalled('jimp', resolvePath)) {
      responsiveAdapter = 'jimp';
    }
  }

  return {
    jpeg,
    gif,
    svg,
    svgSprite,
    webp,
    png,
    lqip,
    responsive,
    responsiveAdapter,
  };
};

/**
 * Checks which image types should by handled by this plugin
 *
 * @param {object} nextConfig - next.js configuration object
 * @returns {object}
 */
const getHandledImageTypes = (nextConfig) => {
  const { handleImages } = nextConfig;

  return {
    jpeg: handleImages.indexOf('jpeg') >= 0 || handleImages.indexOf('jpg') >= 0,
    png: handleImages.indexOf('png') >= 0,
    svg: handleImages.indexOf('svg') >= 0,
    webp: handleImages.indexOf('webp') >= 0,
    gif: handleImages.indexOf('gif') >= 0,
    ico: handleImages.indexOf('ico') >= 0,
  };
};

/**
 * Returns the number of image optimization loaders installed
 *
 * @param {object} loaders - detected loaders
 * @returns {number}
 */
const getNumOptimizationLoadersInstalled = loaders => Object.values(loaders)
  .filter(loader => loader && (
    loader.startsWith('imagemin-')
    || loader.startsWith('webp-')
    || loader.startsWith('lqip-')
  )).length;

/**
 * Appends all loaders to the webpack configuration
 *
 * @param {object} webpackConfig - webpack configuration
 * @param {object} nextConfig - next.js configuration
 * @param {object} detectedLoaders - detected loaders
 * @param {boolean} isServer - if the build is for the server
 * @param {boolean} optimize - if images should get optimized or just copied
 * @returns {object}
 */
const appendLoaders = (
  webpackConfig,
  nextConfig,
  detectedLoaders,
  isServer,
  optimize,
) => {
  let config = webpackConfig;
  const handledImageTypes = getHandledImageTypes(nextConfig);
  let imgLoaderHandledTypes = handledImageTypes;

  // check if responsive-loader should be the default loader and apply it if so
  if (nextConfig.defaultImageLoader && nextConfig.defaultImageLoader === 'responsive-loader') {
    // img-loader no longer has to handle jpeg and png images
    imgLoaderHandledTypes = { ...imgLoaderHandledTypes, jpeg: false, png: false };

    config = applyResponsiveLoader(webpackConfig, nextConfig, isServer, detectLoaders);
  }

  // apply img loader
  const shouldApplyImgLoader = imgLoaderHandledTypes.jpeg || imgLoaderHandledTypes.png
    || imgLoaderHandledTypes.gif || imgLoaderHandledTypes.svg;

  if ((detectedLoaders.jpeg || detectedLoaders.png || detectedLoaders.gif || detectedLoaders.svg)
    && shouldApplyImgLoader) {
    config = applyImgLoader(webpackConfig, nextConfig, optimize, isServer,
      detectedLoaders, imgLoaderHandledTypes);
  } else if (shouldApplyImgLoader) {
    config = applyImgLoader(webpackConfig, nextConfig, false, isServer,
      detectedLoaders, imgLoaderHandledTypes);
  }

  // apply webp loader
  if (detectedLoaders.webp && handledImageTypes.webp) {
    config = applyWebpLoader(webpackConfig, nextConfig, optimize, isServer, detectLoaders);
  } else if (handledImageTypes.webp) {
    config = applyWebpLoader(webpackConfig, nextConfig, false, isServer, detectLoaders);
  }

  // apply file loader for non optimizable image types
  if (handledImageTypes.ico) {
    config = applyFileLoader(webpackConfig, nextConfig, isServer, /\.(ico)$/i);
  }

  return config;
};

module.exports = {
  isModuleInstalled,
  detectLoaders,
  getHandledImageTypes,
  getNumOptimizationLoadersInstalled,
  appendLoaders,
};
