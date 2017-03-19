'use strict'

const config = require('./webpack.config.dev')
const paths = require('./paths')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || 'localhost'
const port = process.env.POST || 3000

module.exports = {
  contentBase: paths.appSrc,
  historyApiFallback: true,
  port: port,
  compress: false,
  inline: true,
  hot: true,
  stats: {
    assets: true,
    children: false,
    chunks: true,
    hash: false,
    modules: true,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
      green: '\u001b[32m'
    }
  }
}
