const path = require('path');
const {
  VueLoaderPlugin
} = require('vue-loader');
const isDev = process.env.NODE_ENV === 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HtmlWebpackPlugin(),
]

const devServer = {
  port: 9000,
  host: 'localhost',
  // 将错误显示去网页上
  overlay: {
    errors: true,
  },
  // 自动打开
  open: true,
  // 热刷新
  hot: true,
};

let config;

if (isDev) {
  config = merge(baseConfig, {
    devtool: '#eval-source-map',
    output: {
      filename: '[name].[hash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            'vue-style-loader',
            'css-loader',
            // 这里的配置是由于 stylus-loader 会自动生成 sourcemap, 所以在 postcss-loader 这里默认使用上面生成的 sourcemap
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            'stylus-loader',
          ]
        },
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ])
  })
} else {
  config = merge(baseConfig, {
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader',
              // 这里的配置是由于 stylus-loader 会自动生成 sourcemap, 所以在 postcss-loader 这里默认使用上面生成的 sourcemap
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                },
              },
              'stylus-loader',
            ]
          }),
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new ExtractTextPlugin('styles.[chunkHash:8].css')
    ])
  })
}

module.exports = config;