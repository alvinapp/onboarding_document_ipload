const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = (env = {}) => {
  // Map custom NODE_ENV values to Webpack's valid modes
  const modeMap = {
    development: 'development',
    production: 'production',
    staging: 'production', // Staging can map to production mode for optimizations
  };

  // Determine mode based on env.NODE_ENV or default to 'development'
  const mode = modeMap[env.NODE_ENV] || 'development';

  // Load environment variables based on the mode
  const envFile = `.env.${env.NODE_ENV || 'development'}`;
  const fileEnv = dotenv.config({ path: envFile }).parsed || {};

  // Prepare environment variables to be injected into the app
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  return {
    entry: './src/index.tsx', // Entry point for your app
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true, // Clean the output directory before emitting new files
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolve these extensions
      alias: {
        assets: path.resolve(__dirname, 'src/assets'), // Path alias for assets
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/, // Handle .ts and .tsx files
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/, // Handle .css files
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/, // Handle image and SVG files
          type: 'asset/resource',
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html', // Reference your HTML template
      }),
      // Inject environment variables into the app
      new webpack.DefinePlugin(envKeys),
    ],
    devServer: {
      static: './public',
      historyApiFallback: true, // Support for React Router
      compress: true,
      port: 3000,
      open: true, // Automatically open the browser
    },
    // Use the mapped mode ('production' for staging, etc.)
    mode: mode,
  };
};
