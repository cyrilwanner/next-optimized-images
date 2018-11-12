export const getFileLoaderOptions = ({
  assetPrefix,
  imagesPublicPath,
  imagesOutputPath,
  imagesFolder = 'images',
  imagesName = '[name]-[hash].[ext]',
}, isServer) => ({
  publicPath: assetPrefix ? `${assetPrefix}/${imagesFolder}` : (imagesPublicPath || `/_next/static/${imagesFolder}/`),
  outputPath: imagesOutputPath || `${isServer ? '../' : ''}static/${imagesFolder}/`,
  name: imagesName,
});
