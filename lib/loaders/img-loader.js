import { getResourceQueries } from '../resource-queries';
import { getWebpResourceQuery } from './webp-loader';
import { getUrlLoaderOptions } from './url-loader';
import { getSvgSpriteLoaderResourceQuery } from './svg-sprite-loader';

export const getImgLoaderOptions = (nextConfig, detectedLoaders, optimize) => ({

});

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
      ...getResourceQueries(nextConfig, isServer, !optimize ? null : 'img-loader', imgLoaderOptions),

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
