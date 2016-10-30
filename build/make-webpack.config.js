/*eslint-disable */

'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var deps = Object.keys(require('../package.json').dependencies);

var ROOT_PATH = path.join(path.resolve(__dirname), "..");

module.exports = function (options) {

  // FLAGS
  var DEV = options.target === 'dev';
  var PROD = options.target === 'prd';

  // ENTRY
  var appMain = './app/App.js'
  var devEntry = [
    'webpack-dev-server/client?http://0.0.0.0:8000/',
    'webpack/hot/only-dev-server',
    appMain
  ]
  var prodEntry = {
    app: appMain,
    vendor: deps.concat([])
  }

  var reactHotLoader = 'react-hot'
  var babelLoader = 'babel?presets[]=react&presets[]=es2015'
  var loaders = [
    {
      test: /\.js$/,
      exclude: /node_modules/, 
      loaders: DEV ? [reactHotLoader, babelLoader] : [babelLoader]
    },
    { 
      test: /\.css$/, 
      loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
    },
    {
      test: /\.(woff|woff2)$/, 
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    },
    {
      test: /\.(ttf|eot|svg|png|jpeg|jpg|gif|ico)$/, 
      loader: 'file-loader'
    }
  ]

  var output = {
    filename: 'bundle.js',
    publicPath: options.path,
    path: path.join(ROOT_PATH, 'public')
  }

  // DEVELOPMENT
  var devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ];

  // PROD
  var prodPlugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, "drop_console": true, "drop_debugger": true }, "screw-ie8": true, unsafe: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({ 'process.env': { COMPRESS: 1, NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
  ];

  // COMMON
  var commonPlugins = [
    new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery'}),
    new HtmlWebpackPlugin({
      title: 'Bike Stats',
      mobile: true,
      inject: false,
      template: 'node_modules/html-webpack-template/index.ejs',
      appMountId: 'app',
      //favicon: 'app/resources/img/favico.png'
    }),
    new ExtractTextPlugin("styles.css")
  ];

  var baseConfig = {
    devtool: options.devtool,
    entry: DEV ? devEntry : prodEntry,
    output: output,
    module: {
      loaders: loaders
    },
    plugins: commonPlugins.concat(DEV ? devPlugins : prodPlugins)
  };

  return baseConfig;
};
