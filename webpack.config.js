const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    content: "./app/index.js",
    popup: "./app/popup/index.js",
    options: "./app/options/index.js", 
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: false
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
