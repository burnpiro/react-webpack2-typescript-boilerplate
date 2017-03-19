'use strict'

process.env.NODE_ENV = 'production'

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv

const fs = require('fs-extra')
const chalk = require('chalk')
const paths = require('../config/paths')
const config = require('../config/webpack.config.prod')
const Webpack = require('webpack')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
const useYarn = fs.existsSync(paths.yarnLockFile)

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexTs])) {
  process.exit(1)
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild).then(previousFileSizes => {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  fs.emptyDirSync(paths.appBuild)

  // Start the webpack build
  build(previousFileSizes)

  // Merge with the public folder
  copyPublicFolder()
})

// Print out errors
function printErrors (summary, errors) {
  console.log(chalk.red(summary))
  console.log()
  errors.forEach(err => {
    console.log(err.message || err)
    console.log()
  })
}

// Create the production build and print the deployment instructions.
function build (previousFileSizes) {
  console.log('Creating an optimized production build...')

  const compiler = new Webpack(config)
  compiler.run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err])
      process.exit(1)
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors)
      process.exit(1)
    }

    if (process.env.CI && stats.compilation.warnings.length) {
      printErrors(
        'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
        stats.compilation.warnings
      )
      process.exit(1)
    }

    console.log(chalk.green('Compiled successfully.'))
    console.log()

    console.log('File sizes after gzip:')
    console.log()
    printFileSizesAfterBuild(stats, previousFileSizes)
    console.log()

    const publicUrl = paths.publicUrl
    const publicPath = config.output.publicPath
    if (publicPath !== '/') {
      // "homepage": "http://mywebsite.com/project"
      console.log(
        `The project was built assuming it is hosted at ${chalk.green(publicPath)}.`
      )
      console.log(
        `You can control this with the ${chalk.green('homepage')} field in your ${chalk.cyan('package.json')}.`
      )
      console.log()
      console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`)
      console.log()
    } else {
      if (publicUrl) {
        // "homepage": "http://mywebsite.com"
        console.log(
          `The project was built assuming it is hosted at ${chalk.green(publicUrl)}.`
        )
        console.log(
          `You can control this with the ${chalk.green('homepage')} field in your ${chalk.cyan('package.json')}.`
        )
        console.log()
      } else {
        // no homepage
        console.log(
          'The project was built assuming it is hosted at the server root.'
        )
        console.log(
          `To override this, specify the ${chalk.green('homepage')} in your ${chalk.cyan('package.json')}.`
        )
        console.log('For example, add this to build it for GitHub Pages:')
        console.log()
        console.log(
          `  ${chalk.green('"homepage"')} ${chalk.cyan(':')} ${chalk.green('"http://myname.github.io/myapp"')}${chalk.cyan(',')}`
        )
        console.log()
      }
      const build = paths.appBuild
      console.log(`The ${chalk.cyan(build)} folder is ready to be deployed.`)
      console.log('You may serve it with a static server:')
      console.log()
      if (useYarn) {
        console.log(`  ${chalk.cyan('yarn')} global add serve`)
      } else {
        console.log(`  ${chalk.cyan('npm')} install -g serve`)
      }
      console.log(`  ${chalk.cyan('serve')} -s build`)
      console.log()
    }
  })
}

function copyPublicFolder () {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  })
}
