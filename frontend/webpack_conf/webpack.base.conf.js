const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const dotenv = require('dotenv');

const env = dotenv.config({ path: path.resolve(process.cwd(), '../.env') }).parsed;
const envKeys = {
  "process.env.APP_HOST": JSON.stringify(env.APP_HOST),
  "process.env.SOCKET_HOST": JSON.stringify(env.SOCKET_HOST),
}

const isDev = process.env.NODE_ENV === "development";
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const pathList = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets",
};

const cssLoaderList = (extraLoader, extraLoaderOptionObject) => {
  const loaderList = [
    "style-loader",
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: { sourceMap: isDev },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: isDev,
        // config: { path: `${pathList.src}/js/postcss.config.js` },
      },
    },
  ];

  if (extraLoader) {
    loaderList.push({
      loader: extraLoader,
      options: extraLoaderOptionObject,
    });
  }

  return loaderList;
};

module.exports = {
  externals: {
    pathList: pathList,
  }, // for access in dev and prod configs

  context: pathList.src,
  entry: {
    main: ["./index.js"],
  },
  output: {
    // filename: `${pathList.assets}/js/${filename("js")}`,
    filename: filename("js"),
    path: pathList.dist,
    publicPath: "/", // for dev-server
  },

  resolve: {
    alias: {
      "~": "src", // for import or requier in js
    },
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]", // can use hash
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/,
        use: cssLoaderList(),
      },
      {
        test: /\.scss$/,
        use: cssLoaderList("sass-loader", { sourceMap: isDev }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // filename: `${pathList.assets}/css/${filename(css)}`,
      filename: filename("css"),
      // chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      // it can serve multiple html files and navigate it in url
      hash: false,
      template: "index.html",
      filename: "./index.html",
      minify: {
        collapseWhitespace: !isDev,
      },
      // inject: false, // turn off auto inject <script> and <link>, instead need template engine logic (ejs)
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: `${pathList.src}/${pathList.assets}/img`,
    //       // to: `${pathList.assets}/img`,
    //       to: "",
    //     },
    //     {
    //       from: `${pathList.src}/${pathList.assets}/fonts`,
    //       // to: `${pathList.assets}/fonts`,
    //       to: "",
    //     },
    //     { from: `${pathList.src}/static`, to: "" },
    //   ],
    // }),
  ],
};
