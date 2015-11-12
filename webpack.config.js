var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    "mixpanel": path.join(__dirname, 'integrations', 'mixpanel')
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ["stage-1", "es2015"]
        }
      }
    ],
    postLoaders: [
      {
        loader: "transform?envify"
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist', 'integrations'),
    filename: "[name].js",
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      "type": "component-type",
      "includes": "@ndhoule/includes",
      "keys": "@ndhoule/keys",
      "clone-component": "clone",
      "each": "each-component",
      "defaults": "stluafed",
      "emitter": "component-emitter",
      "foldl": "@ndhoule/foldl",
      "cookie": "component-cookie",
      "inherit": "inherit-component"
    }
  },
  plugins: [
  ]
};