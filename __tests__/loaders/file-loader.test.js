const { getConfig } = require('../../lib/config');
const { getFileLoaderOptions } = require('../../lib/loaders/file-loader');

describe('next-optimized-images/loaders/file-loader', () => {
  it('uses the default config', () => {
    const options = getFileLoaderOptions(getConfig({}), false);

    expect(options.publicPath).toEqual('/_next/static/images/');
    expect(options.outputPath).toEqual('static/images/');
    expect(options.name).toEqual('[name]-[hash].[ext]');
  });

  it('uses the correct directory on the server', () => {
    const options = getFileLoaderOptions(getConfig({}), true);

    expect(options.outputPath).toEqual('../static/images/');
  });

  it('uses the assetPrefix config', () => {
    const options1 = getFileLoaderOptions(getConfig({ assetPrefix: 'https://cdn.com/' }), false);
    const options2 = getFileLoaderOptions(getConfig({ assetPrefix: 'https://cdn.com' }), false);
    const options3 = getFileLoaderOptions(getConfig({ assetPrefix: 'https://cdn.com/', imagesFolder: 'img-test' }), false);

    expect(options1.publicPath).toEqual('https://cdn.com/_next/static/images/');
    expect(options2.publicPath).toEqual('https://cdn.com/_next/static/images/');
    expect(options3.publicPath).toEqual('https://cdn.com/_next/static/img-test/');
  });

  it('overwrites assetPrefix config with imagesPublicPath', () => {
    const options = getFileLoaderOptions(getConfig({ assetPrefix: 'https://cdn.com/', imagesPublicPath: 'https://another-cdn.com/' }), false);

    expect(options.publicPath).toEqual('https://another-cdn.com/');
  });

  it('allows overwriting the output path', () => {
    const options = getFileLoaderOptions(getConfig({ imagesOutputPath: 'another-path/' }), true);

    expect(options.outputPath).toEqual('another-path/');
  });
});
