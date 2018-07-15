const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const isDev = process.env.NODE_ENV === 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  // 入口文件，__dirname 表示当前文件所在的目录地址，可以利用 join 拼接起来
  entry: path.join(__dirname, 'src/index.js'),
  // 输出文件
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
      },
      
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 设置图片的大小
              limit: 1024,
              name: '[name].bundle.[ext]',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 判断环境，根据不同的环境区分打包
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
  ]
}

if(isDev) {
  config.output.filename = '[name].[hash:8].js'
  config.module.rules.push(
    // loaders 是一层一层往上抛
    {
      test: /\.styl/,
      use: [
        'style-loader',
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
  ),
  config.devtool = '#eval-source-map',
  config.devServer = {
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
  },
  config.plugins.push(
    // 启动热刷新功能
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  )
} else {
  config.module.rules.push (
    {
      test: /\.styl/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
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
  )
  config.plugins.push(
    new ExtractTextPlugin('styles.[chunkHash:8].css')
  )
}

module.exports = config;