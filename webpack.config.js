require('dotenv').config();

const path = require('path');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');


const HTMLPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/styles/ant-vars.less'), 'utf8'));

const { ProvidePlugin } = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';
const plugins = [
  new CleanWebpackPlugin(['build']),
  new ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    jquery: 'jquery',
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: devMode ? '[name].css' : '[name].[hash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
  }),

  new HTMLPlugin({
    chunks: ['main'],
    filename: "index.html",
    template: `${__dirname}/src/index.html`,
  }),
    new HTMLPlugin({
      chunks: ['embedmap'],
      filename: "mapEmbed.html",
      template: `${__dirname}/src/mapEmbed.html`,
    }),
  // new ExtractPlugin('bundle.[hash].css'),
  new CopyWebpackPlugin([
    {
      from: 'src/Images/**/*',
        transformPath(targetPath) {
          return targetPath.split('src/')[1];
        }
    },
    {
      flatten: true,
      from: 'src/vendor/scripts/*',
      to: 'vendor/scripts',
    },
  ]),
];

module.exports = {
  resolve: {
      alias: {
        'masonry': 'masonry-layout',
        'isotope': 'isotope-layout'
      },
      extensions: ['.js', '.json', '.jsx'],
    },
  mode: 'development',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins,

  entry: {
    main: `${__dirname}/src/main.js`,
    embedmap: `${__dirname}/src/embedmap-main.js`
  },

  devtool: 'source-map',

  // Stick it into the "path" folder with that file name
  output: {
    filename: '[name].[hash].js',
    path: `${__dirname}/build`,
  },
  module: {
    rules: [
      // If it's a .js file not in node_modules, use the babel-loader
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            ['import', {
              libraryName: 'antd',
              style: true
            }],
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      // If it's a less file
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: themeVariables,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|glyph)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'font/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'babel-loader',
          },
          {
            loader: '@svgr/webpack',
            options: {
              babel: false,
              icon: true,
            },
          },
        ],
      },

     {
         test: /\.(png|jpg|gif)$/,
         use: [
           'file-loader'
         ]
       }

    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

};