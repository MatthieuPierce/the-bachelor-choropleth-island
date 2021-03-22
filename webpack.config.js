const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
 

let mode = "development";
let target = "web";
//change mode & target conditionally by NODE_ENV
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  target = 'browserslist';
}

module.exports = {
  mode: mode,
  target: target,
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //path for asset resources, e.g. images
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  module: {
    rules: [
      {
      // loader module for JS
      test: /\.js$/i,
      exclude: [
        /node_modules/,
        /fcc-bundle\.js/
      ],
      use: {
        loader: 'babel-loader',
        // babel-loader config options here, OR at .babelrc or babel.config.js
      }
    },
    {
    // loader modules for css/sass/scss, handles postcss too, currently unused 
      test: /\.(s[ac]|c)ss$/i,
      exclude: /node_modules/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { publicPath: ''},
        },
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      type: "asset",
      // "asset" parses resournces under 8kb into js, rest as sep output files
      // "asset/resource" = all sep files in output
      // "asset/inline" = all rolled in js bundle, costly upfront 
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin( {
      template: './src/index.html'
    }),
    new FaviconsWebpackPlugin( {
      // Your source logo (required)
      logo: './src/favicon/gradient-circle-01.png', 
      // Enable caching and optionally specify the path to store cached data
      cache: true,
      // The directory to output the assets relative to the webpack output dir.
      // Relative string paths are allowed here ie '../public/static'. If this
      // option is not set, `prefix` is used.
      // outputPath: '/public/static',
      // Prefix path for generated assets
      prefix: 'assets/',
      // Inject html links/metadata (requires html-webpack-plugin).
      inject: true,
  
      // Favicons configuration options
      // The options specified under favicons: are handed over as is to npm
      // favicons, see https://github.com/itgalaxy/favicons#usage
      // favicons: {
          // appName: null,
      // } 
    } )
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  }
}