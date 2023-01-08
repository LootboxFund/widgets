const packageJSON = require('../package.json')
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
const semver = packageJSON.version
const absPath = '/users/starship420/repo/lootbox/widgets/iife/'

console.log(`

  Uploading ${semver} to ${bucketName}

  env: ${process.env.NODE_ENV}
`)

const BattleFeed = process.env.NODE_ENV === 'production' ? 'BattleFeed.production.js' : 'BattleFeed.js'

const fileNames = [BattleFeed]

const run = async () => {
  await Promise.all(
    fileNames.map((filename) => {
      return uploadFile({
        filename,
        semver,
        absPath,
        bucketName,
      })
    })
  )
  process.exit()
  return
}
app.listen(process.env.PORT || 8088, () => {
  console.log('node server running')
  run()
})
