const paths = require('./paths')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')

const cssFilename = 'styles.css'
process.env.NODE_ENV = 'development'
process.env.PUBLIC_URL = ''

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
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'static/js/[name].[hash:8].vendor.bundle.js',
    minChunks: Infinity
  }),
  new webpack.optimize.AggressiveMergingPlugin(),
  new ExtractTextPlugin({
    filename: cssFilename,
    disable: false
  }),
  new HtmlWebpackPlugin({
    template: paths.appHtml
  })
]

module.exports = {
  context: paths.appSrc,
  entry: {
    main: paths.appIndexTs,
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: 'static/js/[name].[hash:8].bundle.js',
    path: paths.appBuild,
    publicPath: '/'
  },
  devtool: 'source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // typescript code goes through chain of loaders `awesome-typescript-loader` first
        // we're compiling it to es6 so babel can process it
        use: [
          {
            loader: 'react-hot-loader'
          },
          {
            loader: 'babel-loader'
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
