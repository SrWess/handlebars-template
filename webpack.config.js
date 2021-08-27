const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: {
    bundle: "./src/app.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "./js/main.js",
  },
  devtool: isDevelopment && "source-map",
  devServer: {
    port: 3000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(handlebars|hbs)$/,
        loader: "handlebars-loader",
        options: {
          inlineRequires: /\/assets\//,
          partialDirs: [
            path.join(__dirname, "./src/html/partials"),
            path.join(__dirname, "./src/html/pages"),
          ],
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDevelopment,
              url: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              context: path.resolve(__dirname, 'src'),
              name: "[path][name].[ext]",
              esModule: false,
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              jpg: {
                quality: "80",
              },
              png: {
                quality: [0.7, 0.85],
              },
              gif: {
                optimizationLevel: 2,
              },
              svg: {
                optimizationLevel: 6,
              },
              webp: {
                quality: 80,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {},
      },
    }),
    new ESLintWebpackPlugin({
      overrideConfigFile: path.resolve(__dirname, ".eslintrc"),
      context: path.resolve(__dirname, "./src"),
      emitError: true,
      emitWarning: true,
      failOnError: true,
      extensions: ["js"],
    }),
    new PrettierPlugin({
      printWidth: 120,
      tabWidth: 2,
      useTabs: true,
      semi: true,
      encoding: "utf-8",
      extensions: [".js", ".ts"],
    }),
    new MiniCssExtractPlugin({
      filename: "./css/main-styles.css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      title: "Home",
      template: "./src/html/layouts/index.hbs",
      templateParameters: require("./src/html/data/index.json"),
      minify: !isDevelopment && {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyElements: true,
      },
    }),
  ],
};
