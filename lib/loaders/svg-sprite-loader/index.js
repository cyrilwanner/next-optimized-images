const path = require('path');

/**
 * Returns the resource query definition for an svg sprite image
 *
 * @param {object} nextConfig - next.js configuration
 * @param {object} detectedLoaders - detected loaders
 * @param {object} imgLoaderOptions - img loader options
 * @param {boolean} optimize - if the svg image should get optimized
 * @returns {object}
 */
const getSvgSpriteLoaderResourceQuery = (
  nextConfig,
  detectedLoaders,
  imgLoaderOptions,
  optimize,
) => ({
  resourceQuery: /sprite/,
  use: [
    {
      loader: 'svg-sprite-loader',
      options: {
        runtimeGenerator: require.resolve(path.resolve(__dirname, 'svg-runtime-generator.js')),
        ...(nextConfig.svgSpriteLoader || {}),
      },
    },
  ].concat(detectedLoaders.svg && optimize ? [
    {
      loader: 'img-loader',
      options: imgLoaderOptions,
    },
  ] : []),
});

module.exports = {
  getSvgSpriteLoaderResourceQuery,
};
