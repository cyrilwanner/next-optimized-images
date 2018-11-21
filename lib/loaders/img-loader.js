const { getResourceQueries } = require('../resource-queries');
const { getWebpResourceQuery } = require('./webp-loader');
const { getUrlLoaderOptions } = require('./url-loader');
const { getSvgSpriteLoaderResourceQuery } = require('./svg-sprite-loader');

const requireLoader = (loader, nextConfig) => {
  let moduleName = loader;

  if (nextConfig.overwriteImageLoaderPaths) {
    moduleName = require.resolve(loader, { paths: [nextConfig.overwriteImageLoaderPaths] });
  }

  return require(moduleName)(nextConfig[loader.replace('imagemin-', '')] || {});
};

const getImgLoaderOptions = (nextConfig, detectedLoaders, optimize) => {
  if (!optimize) {
    return {
      plugins: [],
    };
  }

  /* eslint global-require: "off", import/no-dynamic-require: "off" */
  return {
    plugins: [
      detectedLoaders.jpeg
        ? requireLoader(detectedLoaders.jpeg, nextConfig)
        : undefined,

      detectedLoaders.png
        ? requireLoader(detectedLoaders.png, nextConfig)
        : undefined,

      detectedLoaders.svg
        ? requireLoader(detectedLoaders.svg, nextConfig)
        : undefined,

      detectedLoaders.gif
        ? requireLoader(detectedLoaders.gif, nextConfig)
        : undefined,
    ].filter(Boolean),
  };
};

const getHandledFilesRegex = (handledImageTypes) => {
  const handledFiles = [
    handledImageTypes.jpeg ? 'jpe?g' : null,
    handledImageTypes.png ? 'png' : null,
    handledImageTypes.svg ? 'svg' : null,
    handledImageTypes.gif ? 'gif' : null,
  ];

  return new RegExp(`\\.(${handledFiles.filter(Boolean).join('|')})$`, 'i');
};

const applyImgLoader = (
  webpackConfig,
  nextConfig,
  optimize,
  isServer,
  detectedLoaders,
  handledImageTypes,
) => {
  const imgLoaderOptions = getImgLoaderOptions(nextConfig, detectedLoaders, optimize);

  webpackConfig.module.rules.push({
    test: getHandledFilesRegex(handledImageTypes),
    oneOf: [
      // add all resource queries
      ...getResourceQueries(nextConfig, isServer, optimize ? 'img-loader' : null, imgLoaderOptions),

      // ?webp: convert an image to webp
      handledImageTypes.webp
        ? getWebpResourceQuery(nextConfig, detectedLoaders, isServer)
        : undefined,

      // ?sprite: add icon to sprite
      detectedLoaders.svgSprite
        ? getSvgSpriteLoaderResourceQuery(nextConfig, detectedLoaders, imgLoaderOptions)
        : undefined,

      // default behavior: inline if below the definied limit, external file if above
      {
        use: [
          {
            loader: 'url-loader',
            options: getUrlLoaderOptions(nextConfig, isServer),
          },
          {
            loader: 'img-loader',
            options: imgLoaderOptions,
          },
        ],
      },
    ].filter(Boolean),
  });

  return webpackConfig;
};

module.exports = {
  getImgLoaderOptions,
  getHandledFilesRegex,
  applyImgLoader,
};
