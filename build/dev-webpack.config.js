'use strict'

module.exports = require('./make-webpack.config')({
  target: 'dev',
  devtool: 'source-map',
  path: '/'
})
