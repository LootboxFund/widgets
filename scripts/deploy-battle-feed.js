const express = require('express')
const app = new express()
const { latest: Manifest } = require('@wormgraph/manifest')
const manifest = Manifest.default
const { uploadFile } = require('./upload-file')

/**
 * CONSTANTS
 *
 */
const bucketName = manifest.storage.buckets.widgets.id || 'guildfx-exchange.appspot.com'
const semver = manifest.semver.id || '0.2.0-sandbox'
const absPath = '/users/starship420/repo/lootbox/widgets/iife/'

console.log(`

  Uploading ${semver} to ${bucketName}

  env: ${process.env.NODE_ENV}
`)

const BattleFeed = process.env.NODE_ENV === 'production' ? 'BattleFeed.production.js' : 'BattleFeed.js'

const fileNames = [BattleFeed]

fileNames.map((filename) => {
  uploadFile({
    filename,
    semver,
    absPath,
  })
})

app.listen(process.env.PORT || 8088, () => {
  console.log('node server running')
})
