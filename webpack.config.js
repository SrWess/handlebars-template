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
          partialDirs: [
            path.join(__dirname, "./src/html/partials"),
            path.join(__dirname, "./src/html/pages")
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
        test: /\.(jpg|png|gif)?$/,
        use: [
          {
            loader: "filename-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "static/",
              useRelativePath: true,
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
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
