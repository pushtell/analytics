var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    index: path.resolve(__dirname, './app.js')
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
    ],
    postLoaders: [
    ]
  },
  devtool: 'inline-source-map'
};