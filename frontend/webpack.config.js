const webpack = require('webpack');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // For JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/, // For CSS files
        use: ['style-loader', 'css-loader'], // Ensure HMR is enabled with style-loader
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/, // For image files
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // Define process.env
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(), // Add React Refresh plugin
  ].filter(Boolean), // Filter out false values (only include in development mode)
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Ensure public is the right directory
    },
    port: 3000,
    open: true, // Automatically open the browser
    hot: true, // Enable Hot Module Replacement (HMR)
    watchFiles: ['src/**/*', 'public/**/*'], // Watch both src and public files for changes
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Support both .js and .jsx extensions
  },
};
