const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    magicbuyer: "./app/index.js",
    popup: "./app/popup/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
  },
  plugins: [],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
