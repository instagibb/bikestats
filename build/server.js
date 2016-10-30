/*eslint-disable */

'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./dev-webpack.config');

var express = require('express');  
var request = require('request');
var strava_config = require('../data/strava_config');
var stravaproxy = express();

stravaproxy.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.pipe(request(`https://www.strava.com/api/v3${req.url}`)).auth(null, null, true, strava_config.access_token).pipe(res);
});

console.log(`Strava Proxy Listening at 0.0.0.0:8001 using token: ${strava_config.access_token}`);
stravaproxy.listen(8001);

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	contentBase: config.output.path,
	historyApiFallback: true,
	https: false
}).listen(8000, '0.0.0.0', function (err) {
	if (err) {
		console.log(err);
	}
  console.log('Listening at 0.0.0.0:8000');
});
