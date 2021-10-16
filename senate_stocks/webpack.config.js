const path = require('path');

module.exports = {
  entry: {
    asset_detail: './assets/asset_detail/index.js',
    senator_detail: './assets/senator_detail/index.js',
    asset_search: './assets/asset_search/index.js',
  },
  output: {
    filename: '[name]_bundle.js', // output bundle file name
    path: path.resolve(__dirname, './static/js'), // path to our Django static directory
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [['@babel/plugin-transform-runtime']],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
