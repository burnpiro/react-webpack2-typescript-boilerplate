// paths contains all our app paths so we don't need to generate them each time using `path` lib
const paths = require('./paths')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ManifestPlugin = require('webpack-manifest-plugin')

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
        require('postcss-browser-reporter')({ disabled: true })
      ]
    }
  }),
  // Makes some environment variables available to the JS code
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'static/js/[name].[hash:8].bundle.min.js',
    minChunks: Infinity
  }),
  new webpack.optimize.AggressiveMergingPlugin(),
  new ExtractTextPlugin({
    filename: cssFilename
  }),
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  // Minify the code.
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      comments: false,
      screw_ie8: true
    },
    sourceMap: true
  }),
  // Generate a manifest file which contains a mapping of all asset filenames
  new ManifestPlugin({
    fileName: 'asset-manifest.json'
  })
]

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  context: paths.appSrc,
  devtool: 'source-map',
  target: 'web',
  entry: {
    main: paths.appIndexTs,
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: 'static/js/[name].[hash:8].bundle.min.js',
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
        include: paths.appSrc,
        options: {
          emitErrors: true,
          failOnHint: true
        }
      },
      {
        test: /\.tsx?$/,
        // that's how we should chain loaders in webpack2 instead of old `babel!awesome-typescript-loader` way
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [[ 'es2015', { modules: false } ], 'react']
            }
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: 'tsconfig.prod.json'
            }
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
                sourceMap: false,
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
  },

  performance: {
    maxAssetSize: 100,
    maxEntrypointSize: 300,
    hints: 'warning'
  }
}
