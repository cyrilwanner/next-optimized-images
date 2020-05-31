/**
 * Enriches the next.js configuration object with default config values for
 * next-optimized-iamges and returns it
 *
 * @param {object} nextConfig - next.js configuration object
 * @returns {object} enriched config
 */
const getConfig = nextConfig => ({
  optimizeImages: true,
  optimizeImagesInDev: false,
  handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
  imagesFolder: 'images',
  imagesName: '[name]-[hash].[ext]',
  removeOriginalExtension: false,
  inlineImageLimit: 8192,
  defaultImageLoader: 'img-loader',
  mozjpeg: {},
  optipng: {},
  pngquant: {},
  gifsicle: {
    interlaced: true,
    optimizationLevel: 3,
  },
  svgo: {},
  svgSpriteLoader: {
    symbolId: '[name]-[hash:8]',
  },
  webp: {},
  ...nextConfig,
});

module.exports = {
  getConfig,
};
