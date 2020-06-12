import "dotenv/config";
import path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import GenerateJsonPlugin from "generate-json-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import banner from "./banner";
import pkg from "../../package.json";

const build = {
  mode: "production",
  target: "node",
  externals: Object.keys(pkg.dependencies),
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
    libraryTarget: "umd",
    libraryExport: "default",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: /@license/i,
          },
        },
        extractComments: false,
        sourceMap: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: ["README.md", "LICENSE"].map(file => ({ from: file })),
    }),
    new GenerateJsonPlugin(
      "package.json",
      Object.assign({}, pkg, {
        main: "index.js",
        scripts: {},
        devDependencies: {},
      })
    ),
    new webpack.BannerPlugin({
      banner: banner(),
      raw: true,
    }),
  ],
};

export default build;
