const headers = require("./tampermonkey-header");
const WebpackUserscriptModule = require("webpack-userscript");
const WebpackUserscript =
  WebpackUserscriptModule && WebpackUserscriptModule.default
    ? WebpackUserscriptModule.default
    : WebpackUserscriptModule;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./app/index.js",
  output: {
    filename: "./fut-auto-buyer.user.js",
  },
  devServer: {
    contentBase: "./dist/",
  },
  plugins: [
    new WebpackUserscript({
      ...headers,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
