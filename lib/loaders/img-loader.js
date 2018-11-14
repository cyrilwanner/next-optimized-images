import { getResourceQueries } from '../resource-queries';
import { getWebpResourceQuery } from './webp-loader';
import { getUrlLoaderOptions } from './url-loader';
import { getSvgSpriteLoaderResourceQuery } from './svg-sprite-loader';

export const getImageminPluginConfig = (nextConfig, moduleName, defaultConfig = {}) => {
  if (typeof moduleName !== 'string') {
    return defaultConfig;
  }

  return {
    ...defaultConfig,
    ...(nextConfig[moduleName.replace('imagemin-', '')] || {}),
  };
};

export const getImgLoaderOptions = (nextConfig, detectedLoaders, optimize) => {
  if (!optimize) {
    return {
      plugins: [],
    };
  }

  /* eslint global-require: "off", import/no-dynamic-require: "off" */
  return {
    plugins: [
      detectedLoaders.jpeg
        ? require(detectedLoaders.jpeg)(getImageminPluginConfig(nextConfig, detectedLoaders.jpeg))
        : undefined,

      detectedLoaders.png
        ? require(detectedLoaders.png)(getImageminPluginConfig(nextConfig, detectedLoaders.png))
        : undefined,

      detectedLoaders.svg
        ? require(detectedLoaders.svg)(getImageminPluginConfig(nextConfig, detectedLoaders.svg))
        : undefined,

      detectedLoaders.gif
        ? require(detectedLoaders.gif)(getImageminPluginConfig(nextConfig, detectedLoaders.gif, {
          interlaced: true,
          optimizationLevel: 3,
        }))
        : undefined,
    ].filter(Boolean),
  };
};

export const getHandledFilesRegex = (handledImageTypes) => {
  const handledFiles = [
    handledImageTypes.jpeg ? 'jpe?g' : null,
    handledImageTypes.png ? 'png' : null,
    handledImageTypes.svg ? 'svg' : null,
    handledImageTypes.gif ? 'gif' : null,
  ];

  return new RegExp(`\\.(${handledFiles.filter(Boolean).join('|')})$`, 'i');
};

export const applyImgLoader = (
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
