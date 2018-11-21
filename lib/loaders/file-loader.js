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

module.exports = {
  getFileLoaderOptions,
};
