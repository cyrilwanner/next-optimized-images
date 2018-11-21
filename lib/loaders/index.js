const { applyImgLoader } = require('./img-loader');
const { applyWebpLoader } = require('./webp-loader');

const isModuleInstalled = (name, resolvePath) => {
  try {
    require.resolve(name, resolvePath ? { paths: [resolvePath] } : {});

    return true;
  } catch (e) {
    return false;
  }
};

const detectLoaders = (resolvePath) => {
  const jpeg = isModuleInstalled('imagemin-mozjpeg', resolvePath) ? 'imagemin-mozjpeg' : false;
  const gif = isModuleInstalled('imagemin-gifsicle', resolvePath) ? 'imagemin-gifsicle' : false;
  const svg = isModuleInstalled('imagemin-svgo', resolvePath) ? 'imagemin-svgo' : false;
  const svgSprite = isModuleInstalled('svg-sprite-loader', resolvePath) ? 'svg-sprite-loader' : false;
  const webp = isModuleInstalled('webp-loader', resolvePath) ? 'webp-loader' : false;

  let png = false;

  if (isModuleInstalled('imagemin-optipng', resolvePath)) {
    png = 'imagemin-optipng';
  } else if (isModuleInstalled('imagemin-pngquant', resolvePath)) {
    png = 'imagemin-pngquant';
  }

  return {
    jpeg,
    gif,
    svg,
    svgSprite,
    webp,
    png,
  };
};

const getHandledImageTypes = (detectedLoaders, nextConfig) => {
  const { handleImages } = nextConfig;

  return {
    jpeg: detectedLoaders.jpeg || handleImages.indexOf('jpeg') >= 0 || handleImages.indexOf('jpg') >= 0,
    png: detectedLoaders.png || handleImages.indexOf('png') >= 0,
    svg: detectedLoaders.svg || handleImages.indexOf('svg') >= 0,
    webp: detectedLoaders.webp || handleImages.indexOf('webp') >= 0,
    gif: detectedLoaders.gif || handleImages.indexOf('gif') >= 0,
  };
};

const getNumOptimizationLoadersInstalled = loaders => Object.values(loaders)
  .filter(loader => loader && loader !== 'svg-sprite-loader').length;

const appendLoaders = (
  webpackConfig,
  nextConfig,
  detectedLoaders,
  isServer,
  optimize,
) => {
  let config = webpackConfig;
  const handledImageTypes = getHandledImageTypes(detectedLoaders, nextConfig);

  if (detectedLoaders.jpeg || detectedLoaders.png || detectedLoaders.gif || detectedLoaders.svg) {
    config = applyImgLoader(webpackConfig, nextConfig, optimize, isServer,
      detectedLoaders, handledImageTypes);
  } else if (handledImageTypes.jpeg) {
    config = applyImgLoader(webpackConfig, nextConfig, false, isServer,
      detectedLoaders, handledImageTypes);
  }

  if (detectedLoaders.webp) {
    config = applyWebpLoader(webpackConfig, nextConfig, optimize, isServer);
  } else if (handledImageTypes.webp) {
    config = applyWebpLoader(webpackConfig, nextConfig, false, isServer);
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
