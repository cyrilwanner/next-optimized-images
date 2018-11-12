import { getUrlLoaderOptions } from './url-loader';

export const applyWebpLoader = (webpackConfig, nextConfig, detectedLoaders, optimize, isServer) => {
  const webpLoaders = [
    {
      loader: 'url-loader',
      options: getUrlLoaderOptions(nextConfig, isServer),
    },
  ];

  if (optimize) {
    webpLoaders.push({
      loader: 'webp-loader',
      options: nextConfig.webp || {},
    });
  }

  webpackConfig.module.rules.push({
    test: /\.webp$/i,
    oneOf: [
      // todo: support query params

      // default behavior: inline if below the definied limit, external file if above
      {
        use: webpLoaders,
      },
    ],
  });

  return webpackConfig;
};
