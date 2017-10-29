var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const DIST_DIR = 'dist';

module.exports = {
  entry: {
    'polyfills': './client/polyfills.ts',
    'vendor': './client/vendor.ts',
    'app': './client/main.ts'
  },
  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[id]-[hash].chunk.js',
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
        new UglifyJSPlugin({

        }),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            filename: 'index-[hash].html'
        }),
        new ExtractTextPlugin({
          filename: "styles-[hash].css"
        }),
        new workboxPlugin({
          globDirectory: DIST_DIR,
          globPatterns: ['**/*.{html,js,css}'],
          swDest: path.join(DIST_DIR, 'sw.js'),
        })
  ]
};