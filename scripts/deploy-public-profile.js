const express = require('express')
const app = new express()
const { Manifest_v0_7_5_demo: Manifest } = require('@wormgraph/manifest')
const manifest = Manifest.default
const { uploadFile } = require('./upload-file')

/**
 * CONSTANTS
 *
 */
const bucketName = manifest.storage.buckets.widgets.id || 'guildfx-exchange.appspot.com'
const semver = manifest.semver.id || '0.2.0-sandbox'
const absPath = '/Users/kangzeroo/Projects/Lootbox/widgets/iife/'

console.log(`

  Uploading ${semver} to ${bucketName}

  env: ${process.env.NODE_ENV}
`)

const PublicProfile = process.env.NODE_ENV === 'production' ? 'PublicProfile.production.js' : 'PublicProfile.js'

const fileNames = [PublicProfile]

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
