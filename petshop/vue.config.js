module.exports = {
  productionSourceMap: true,
  publicPath: "/", // Mude para "/"
  configureWebpack: {
    devtool: "source-map",
  },
  devServer: {
    historyApiFallback: true,
  },
};
