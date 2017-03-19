'use strict'

const express = require('express')
const paths = require('../config/paths')
const compression = require('compression')

const app = express()

// Serve static assets
app.use(compression())
app.use(express.static(paths.appBuild))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(paths.appBuildHtml)
})

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
