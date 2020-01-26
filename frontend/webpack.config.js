
const path = require("path");
let BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  devtool: "source-map",
  entry: {
    file_management: ["./file_management/src/index.js"],
  },
  output: {
      path: path.resolve(
          __dirname,
          "../static/frontend/webpack_bundles/"
      ),
      filename: "main.[hash].js"
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: './webpack-stats.json',
    }),
  ],
};