// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore specific warnings
      webpackConfig.ignoreWarnings = [
        {
          module: /node_modules\/plotly\.js\//,
          message: /Failed to parse source map/,
        },
      ];

      return webpackConfig;
    },
  },
};