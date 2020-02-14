var path = require("path");
var webpack = require("webpack");
var packageJSON = require("./package.json");
var TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  target: "web",
  entry: {
    sweatmap: path.resolve(__dirname, "node", "sweatmap.js")
  },
  output: {
    path: path.resolve(__dirname, "browser"),
    filename: "[name]-" + packageJSON.version + ".min.js"
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, "node", "sweatmap.js"),
        loader: "babel-loader"
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          output: {
            comments: false
          },
          mangle: true,
          ie8: false
        }
      })
    ]
  },
  node: { fs: "empty" }
};
