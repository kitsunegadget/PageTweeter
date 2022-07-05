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
    // splitchunks をするとactionsが通常ロードされないために動いてくれなくなるので、
    // あえてそのままに。
    // 後読みできるDynamic ImportやImport Scriptであればpopupは動くのだが、
    // SW内部では分割してしまうとimportの依存関係が即時ロードできずに動いてくれない
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
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
        { from: "./src/popup/images", to: "popup/images" },
        { from: "./src/_locales", to: "_locales" },
      ],
    }),
    // new BundleAnalyzerPlugin(),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  return config;
};
