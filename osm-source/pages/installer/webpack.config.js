const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    path: '/opt/iiab/maps/osm-source/pages/installer/build',
    filename: 'main.js'
  },
 mode: 'development',
 optimization: {
   usedExports: true
 },
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    clientLogLevel: 'none',
    stats: 'verbose'
    //stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    //new CopyPlugin([{from: '../src/assets', to: 'assets'}]),
    new HtmlPlugin({
      template: './index.html'
    })
  ]
};
