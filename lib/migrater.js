export const showWarning = () => console.log( // eslint-disable-line no-console
  '[next-optimized-images] No package found which can optimize images.\n'
  + '[next-optimized-images] Starting from version 2, all optimization is optional and you '
  + 'can choose which ones you want to use.\n'
  + '[next-optimized-images] For help for the setup and installation, please read '
  + 'https://github.com/cyrilwanner/next-optimized-images#usage\n'
  + '[next-optimized-images] If this is on purpose and you don\'t want this plugin to optimize '
  + 'the images, set the option `optimizeImages: false` to hide this warning.\n'
  + '[next-optimized-images] If you recently updated from v1 to v2, please read '
  + 'https://github.com/cyrilwanner/next-optimized-images/blob/master/UPGRADING.md',
);
