const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    content: "./app/index.js",          // tu content script
    popup: "./app/popup/index.js",      // tu popup
    options: "./app/options/index.js",  // options page
    page: "./app/page/index.js"         // ⬅️ nuevo: corre DENTRO de la página
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  resolve: {
    extensions: [".js"]
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
