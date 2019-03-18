const path = require('path');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    // optimizeImages: false, // hide warning
    // imagesFolder: 'images-test', // the images should now be in /static/images-test/
    // inlineImageLimit: 500000, // the first images should now be inlined
    // imagesPublicPath: 'https://cdn.image-test.notexisting/', // loading of non-inlined images should now fail because of the non-existing domain, but they should still get generated. assetPrefix should be overwritten for images
    // imagesOutputPath: 'other-images', // images should now be in build/other-test/ and loading of non-inlined images should fail
    // imagesName: 'prefixed-[name]-[hash].[ext]', // images should now have a prefix
    // optimizeImagesInDev: true, // images should now also be optimized in dev
    // mozjpeg: { quality: 30 }, // optimized jpeg images should now be way smaller
    // optipng: { optimizationLevel: 6 }, // one image should now be a bit smaller, another a bit bigger
    // pngquant: { quality: 30 }, optipng: false, // optimized png images should now be way smaller, imagemin-pngquant needs to be installed
    // gifsicle: { colors: 10 }, // optimized gif images should now be way smaller
    // svgo: { plugins: [{ removeComments: false }, { removeDesc: false }, { removeMetadata: false }, { removeEmptyAttrs: false }, { removeEmptyContainers: false }] }, // at least one svg image should now be bigger
    // svgSpriteLoader: { symbolId: filePath => { const path = require('path'); return `prefixed-${path.basename(filePath)}`; } }, // id of the svg element should now have a prefix
    // webp: { quality: 30 }, // optimized webp images should now be way smaller
    // imageTrace: { color: '#339933' }, // image traces should now be green
    // responsive: { quality: 10 }, // responsive images should now be way smaller
    // responsive: { background: 0xFFFFFFFF }, // should fail with an error coming from jimp (when responsive page is opened), if sharp is installed, the error should go away
    // responsive: { sizes: [400, 500, 600] }, // on the responsive page, the last image should now be there in 400, 500, and 600 (instead only 600)
    // defaultImageLoader: 'responsive-loader', // responsive-loader should now resize all jpg & png images even without the ?resize query param
    // handleImages: ['png', 'svg', 'webp', 'gif'], // error during build for jpeg images
    // handleImages: ['jpeg', 'svg', 'webp', 'gif'], // error during build for png images
    // handleImages: ['jpeg', 'png', 'webp', 'gif'], // error during build for svg images
    // handleImages: ['jpeg', 'png', 'svg', 'gif'], // error during build for webp images
    // handleImages: ['jpeg', 'png', 'svg', 'webp'], // error during build for gif images
    // uninstall specific optimization packages to test handling if they weren't installed
  }],
], {
  distDir: 'build',
  // assetPrefix: 'https://asset-prefix.image-test.notexisting/', // loading of non-inlined images should now fail because of the non-existing domain, but they should still get generated. imagesPublicPath should overwrite this for the images if set
});
