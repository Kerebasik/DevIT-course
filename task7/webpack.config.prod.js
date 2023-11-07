const path = require('path');

module.exports = {
  mode: 'production',
  entry: './scripts/index.js',
  watch: false,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Add Babel loader if needed
      },
    ],
  },
};
