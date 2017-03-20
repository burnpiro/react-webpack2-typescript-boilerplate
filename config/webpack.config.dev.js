const paths = require('./paths')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')

process.env.NODE_ENV = 'development'
process.env.PUBLIC_URL = ''

const cssFilename = 'static/css/[name].[contenthash:8].css'
const plugins = [
  // Makes some environment variables available in index.html.
  // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  // In development, this will be an empty string.
  new InterpolateHtmlPlugin(process.env),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: paths.appSrc,
      postcss: [
        require('postcss-import')({ addDependencyTo: webpack }),
        require('postcss-url')(),
        require('postcss-cssnext')(),
        require('postcss-reporter')(),
        require('postcss-browser-reporter')({ disabled: false })
      ]
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new HtmlWebpackPlugin({
    template: paths.appHtml
  }),
  // disable because hot replace won't work :(
  new ExtractTextPlugin({
    filename: cssFilename,
    disable: true
  }),
  // enable HMR globally
  new webpack.HotModuleReplacementPlugin(),
  // prints more readable module names in the browser console on HMR updates
  new webpack.NamedModulesPlugin()
]

module.exports = {
  devtool: 'source-map',
  target: 'web',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    paths.appIndexTs
  ],
  output: {
    filename: 'static/js/[name].[hash:8].bundle.js',
    path: paths.appBuild,
    publicPath: '/'
  },
  module: {
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        include: paths.appSrc
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'source-map-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.tsx?$/,
        // typescript code goes through chain of loaders `awesome-typescript-loader` first
        use: [
          {
            loader: 'react-hot-loader/webpack'
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(ts|tsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // css
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: true,
                import: true,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.ts', '.js'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ['main']
  },
  plugins,
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
}
