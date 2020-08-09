interface WebpackConfig {
  module: {
    rules: {
      test: RegExp;
      use?: Record<string, unknown>[];
      oneOf?: {
        test: RegExp;
        use?: {
          options: {
            name: string;
          };
        };
        include?: RegExp[];
        exclude?: RegExp[];
        issuer?: {
          test: RegExp;
        };
      }[];
    }[];
  };
}

const getHandledImageTypes = (handleImages: string[]): Record<string, boolean> => {
  return {
    jpeg: handleImages.indexOf('jpeg') >= 0 || handleImages.indexOf('jpg') >= 0,
    png: handleImages.indexOf('png') >= 0,
    svg: handleImages.indexOf('svg') >= 0,
    webp: handleImages.indexOf('webp') >= 0,
    gif: handleImages.indexOf('gif') >= 0,
    ico: handleImages.indexOf('ico') >= 0,
  };
};

const getHandledFilesRegex = (handledImageTypes: Record<string, boolean>): RegExp => {
  const handledFiles = [
    handledImageTypes.jpeg ? 'jpe?g' : null,
    handledImageTypes.png ? 'png' : null,
    handledImageTypes.svg ? 'svg' : null,
    handledImageTypes.gif ? 'gif' : null,
    handledImageTypes.webp ? 'webp' : null,
  ];

  return new RegExp(`\\.(${handledFiles.filter(Boolean).join('|')})$`, 'i');
};

/**
 * Configure webpack and next.js to handle and optimize images with this plugin.
 *
 * @param {object} nextConfig - configuration, see the readme for possible values
 * @param {object} nextComposePlugins - additional information when loaded with next-compose-plugins
 * @returns {object}
 */
const withOptimizedImages = (
  nextConfig: { images?: { handleImages?: string[] }; assetPrefix?: string; webpack?: unknown } = {},
) => {
  return {
    ...nextConfig,
    webpack(config: WebpackConfig, options: Record<string, unknown>) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const enrichedConfig = config;
      const handleImages = getHandledImageTypes(
        (nextConfig.images && nextConfig.images.handleImages) || ['jpeg', 'png', 'svg', 'webp', 'gif', 'ico'],
      );

      // add optimized-images-loader
      enrichedConfig.module.rules.push({
        test: getHandledFilesRegex(handleImages),
        use: [
          {
            loader: 'optimized-images-loader',
            options: {
              outputPath: 'static/chunks/images/',
              publicPath: nextConfig.assetPrefix
                ? `${nextConfig.assetPrefix}${
                    nextConfig.assetPrefix.endsWith('/') ? '' : '/'
                  }_next/static/chunks/images/`
                : '/_next/static/chunks/images/',
              includeStrategy: 'react',
              ...(nextConfig.images || {}),
            },
          },
        ],
      });

      // add file-loader to handle ico files
      if (handleImages.ico) {
        enrichedConfig.module.rules.push({
          test: /\.ico$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/chunks/images/',
                publicPath: '/_next/static/chunks/images/',
                ...(nextConfig.images || {}),
              },
            },
          ],
        });
      }

      // remove (unoptimized) builtin image processing introduced in next.js 9.2
      if (config.module.rules) {
        config.module.rules.forEach((rule) => {
          if (rule.oneOf) {
            rule.oneOf.forEach((subRule) => {
              if (
                subRule.issuer &&
                !subRule.test &&
                !subRule.include &&
                subRule.exclude &&
                subRule.use &&
                subRule.use.options &&
                subRule.use.options.name
              ) {
                if (
                  (String(subRule.issuer.test) === '/\\.(css|scss|sass)$/' ||
                    String(subRule.issuer) === '/\\.(css|scss|sass)$/') &&
                  subRule.use.options.name.startsWith('static/media/')
                ) {
                  subRule.exclude.push(/\.(jpg|jpeg|png|svg|webp|gif|ico)$/);
                }
              }
            });
          }
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(enrichedConfig, options);
      }

      return enrichedConfig;
    },
  };
};

module.exports = withOptimizedImages;
