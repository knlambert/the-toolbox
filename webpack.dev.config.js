var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DIST_DIR = 'dist';
module.exports = {
  entry: {
    'polyfills': './client/polyfills.ts',
    'vendor': './client/vendor.ts',
    'app': './client/main.ts'
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, DIST_DIR)
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    exprContextCritical: false,
    rules: [
        { test: /\.html$/, loader: 'html-loader'},
        {
            test: /\.ts$/,
            loaders: [
                'awesome-typescript-loader',
                'angular2-template-loader',
                'angular2-router-loader'
            ]
        },
        { test: /\.css$/, loader: 'style-loader!css-loader', exclude: [/client/]},
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: ['to-string-loader']
          }),
          include: [/client\/index\.css/]
        },
        { 
          test: /\.css$/, loader: ['to-string-loader', 'css-loader'], 
          exclude: [/node_modules/]
        },
        { test: /\.(ttf|eot|svg)$/, loader: 'file-loader?name=dist/fonts/[name].[ext]' }
    ]
  },
  plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin({
          filename: "styles.css"
        }),
        new CopyWebpackPlugin([
          {
              from: 'client/assets',
              to: 'assets'
          }
        ]),
        new WorkboxPlugin({
          globDirectory: DIST_DIR,
          globPatterns: ['**/*.{html,js,css,json,ttf,png}'],
          swDest: path.join(DIST_DIR, 'sw.js'),
          navigateFallbackWhitelist: [
            /\/index\.html/,
            /\/\d\.chunk\.js/,
            /\/app\.js/,
            /\/polyfills\.js/,
            /\/styles\.css/,
            /\/vendors\.js/
          ]
        })
  ]
};
