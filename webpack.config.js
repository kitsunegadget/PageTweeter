const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
  entry: {
    sw: {
      import: "./src/sw.js",
      filename: "sw.js",
    },
    popup: {
      import: "./src/popup/popup.js",
      filename: "popup/popup.js",
    },
    // actions: {
    //   import: "./src/shared/actions.js",
    //   filename: "shared/actions.js",
    // }
    // actions が sw と popup に重複するが、
    // splitchunks をするとなぜか動いてくれなくなるので、あえてそのままに
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    asyncChunks: true,
    clean: true,
  },
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     name: "actions",
  //     chunks: "all"
  //     // cacheGroups: {
  //     //   actions: {
  //     //     test: /[\\/]src[\\/]shared[\\/]actions.js/,
  //     //     name: 'shared/actions',
  //     //     chunks: 'all',
  //     //     minChunks: 1,
  //     //     enforce: true,
  //     //   },
  //     // },
  //   },
  // },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "" },
        { from: "./src/PTicon.png", to: "" },
        { from: "./src/popup/popup.html", to: "popup" },
      ],
    }),
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  return config;
};
