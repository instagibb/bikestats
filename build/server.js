/*eslint-disable */

'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./dev-webpack.config');

var express = require('express');  
var request = require('request');
var strava_config = require('../data/strava_config');
var stravaproxy = express();
var authproxy = express();
var bodyParser = require('body-parser');

stravaproxy.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length, Accept");
  req.pipe(request(`https://www.strava.com/api/v3${req.url}`)).auth(null, null, true, req.query.access_token).pipe(res);
});

authproxy.use(bodyParser.json());
authproxy.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  }
  else {
    request.post( { url: `https://www.strava.com/${req.url}`, form: {
        client_id: strava_config.client_id,
        client_secret: strava_config.client_secret,
        code: req.body.code
      } 
    }).pipe(res);
  }
});



console.log(`Strava Proxy Listening at 0.0.0.0:8001`);
stravaproxy.listen(8001);
authproxy.listen(8002);

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
