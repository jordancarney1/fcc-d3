var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: __dirname + '/src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: '[name]-[hash].js'
  },

  resolve: {
    moduleDirectories: ['node_modules'],
    extensions: ['', '.js', '.elm']
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: [/node_modules/, /elm-stuff/], loader: 'babel' },
      { test: /\.elm$/, exclude: [/elm-stuff/, /node_modules/], loader: 'elm-webpack'},
      { test: /\.css$/, loader: 'style!css!postcss' }
    ],
    noParse: /\.elm$/
  },

  postcss: [
    require('autoprefixer')
  ],

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/dist/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    contentBase: './dist',
    colors: true,
    historyApiFallback: true,
    inline: true
  }
}
