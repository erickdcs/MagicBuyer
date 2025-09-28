const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./app/index.js",
  output: {
    filename: "page-script.js",
    path: path.resolve(__dirname, "dist", "extension"),
  },
  devServer: {
    static: path.resolve(__dirname, "dist", "extension"),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
