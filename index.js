module.exports = ({ inlineImageLimit, imagesFolder, ...nextConfig } = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      config.module.rules.push({
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: inlineImageLimit || 8192,
              fallback: 'file-loader',
              publicPath: `/_next/static/${imagesFolder || 'images'}/`,
              outputPath: `static/${imagesFolder || 'images'}/`,
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  })
}
