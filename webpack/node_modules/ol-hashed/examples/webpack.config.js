const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const examples = require('./index');

const build = path.resolve(__dirname, 'build');

// create a bundle and html file per example
const entry = {};
const plugins = [];
examples.forEach(example => {
  entry[example] = `./${example}.js`;
  plugins.push(
    new HtmlPlugin({
      chunks: [example],
      template: './example.html',
      filename: `${example}.html`
    })
  );
});

// create an index bundle and html file
entry.index = './index.js';
plugins.push(
  new HtmlPlugin({
    chunks: ['index'],
    template: './index.ejs',
    filename: 'index.html',
    examples: examples
  })
);

module.exports = {
  context: __dirname,
  target: 'web',
  entry: entry,
  devtool: 'source-map',
  devServer: {
    contentBase: build
  },
  plugins: plugins,
  output: {
    filename: '[name].js',
    path: build
  }
};
