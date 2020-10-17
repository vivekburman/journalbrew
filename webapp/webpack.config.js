const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(_env, args) {
  const isProduction = args.mode === 'production';
  const isDevelopment = !isProduction;
  return {
    devtool: isDevelopment && 'cheap-module-source-map',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      library: '',
      libraryTarget: 'umd',
      filename: 'static/js/[name].[hash:8].js',
      chunkFilename: 'static/js/[name].[hash:8].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? 'production' : 'development',
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        }, {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }, {
          test: /\.(png|jpg|gif|jpeg)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        }, {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        }, {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      isProduction && new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      isDevelopment && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              ascii_only: true,
            },
            warnings: false,
          },
        }),
        new OptimizeCssAssetsPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 2500000,
        maxInitialRequests: 20,
        maxAsyncRequests: 20,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `${cacheGroupKey}.${packageName.replace('@', '')}`;
            },
          },
          common: {
            minChunks: 2,
            priority: -10,
          },
        },
      },
      runtimeChunk: 'single',
    },
    devServer: {
      compress: true,
      hot: true,
      port: 9000,
      historyApiFallback: true,
      open: true,
      overlay: true,
      proxy: {
        '/api/auth': {
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
          target: 'http://localhost:5000'
        },
        '/api/post': {
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
          target: 'http://localhost:5001'
        }
      }
    }
  };
};
