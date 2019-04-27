/**
 * Build options for the webpack file loader
 *
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} isServer - if the build is for the server
 * @returns {object}
 */
const getFileLoaderOptions = ({
  assetPrefix,
  imagesPublicPath,
  imagesOutputPath,
  imagesFolder,
  imagesName,
}, isServer) => {
  let publicPath = `/_next/static/${imagesFolder}/`;

  if (imagesPublicPath) {
    publicPath = imagesPublicPath;
  } else if (assetPrefix) {
    publicPath = `${assetPrefix}${assetPrefix.endsWith('/') ? '' : '/'}_next/static/${imagesFolder}/`;
  }

  return {
    publicPath,
    outputPath: imagesOutputPath || `${isServer ? '../' : ''}static/${imagesFolder}/`,
    name: imagesName,
  };
};

/**
 * Apply the file loader to the webpack configuration
 *
 * @param {object} webpackConfig - webpack configuration
 * @param {object} nextConfig - next.js configuration
 * @param {boolean} isServer - if the build is for the server
 * @param {RegExp} fileRegex - regex for files to handle
 * @returns {object}
 */
const applyFileLoader = (webpackConfig, nextConfig, isServer, fileRegex) => {
  webpackConfig.module.rules.push({
    test: fileRegex,
    oneOf: [
      {
        use: {
          loader: 'file-loader',
          options: getFileLoaderOptions(nextConfig, isServer),
        },
      },
    ],
  });

  return webpackConfig;
};

module.exports = {
  getFileLoaderOptions,
  applyFileLoader,
};
