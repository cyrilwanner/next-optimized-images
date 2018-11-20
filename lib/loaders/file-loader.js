const getFileLoaderOptions = ({
  assetPrefix,
  imagesPublicPath,
  imagesOutputPath,
  imagesFolder,
  imagesName,
}, isServer) => ({
  publicPath: assetPrefix ? `${assetPrefix}/${imagesFolder}` : (imagesPublicPath || `/_next/static/${imagesFolder}/`),
  outputPath: imagesOutputPath || `${isServer ? '../' : ''}static/${imagesFolder}/`,
  name: imagesName,
});

module.exports = {
  getFileLoaderOptions,
};
