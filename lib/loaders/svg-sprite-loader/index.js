const path = require('path');

const getSvgSpriteLoaderResourceQuery = (
  nextConfig,
  detectedLoaders,
  imgLoaderOptions,
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
  ].concat(detectedLoaders.svg ? [
    {
      loader: 'img-loader',
      options: imgLoaderOptions,
    },
  ] : []),
});

module.exports = {
  getSvgSpriteLoaderResourceQuery,
};
