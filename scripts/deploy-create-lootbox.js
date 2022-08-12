const express = require('express')
const app = new express()
const { Manifest_v0_6_3_prod: Manifest } = require('@wormgraph/manifest')
const manifest = Manifest.default
const { uploadFile } = require('./upload-file')

/**
 * CONSTANTS
 *
 */
const bucketName = manifest.storage.buckets.widgets.id || 'guildfx-exchange.appspot.com'
const semver = manifest.semver.id || '0.2.0-sandbox'
const absPath = '/Users/starship420/repo/lootbox/widgets/iife/'

console.log(`

  Uploading ${semver} to ${bucketName}

  env: ${process.env.NODE_ENV}
`)

const CreateLootbox = process.env.NODE_ENV === 'production' ? 'CreateLootbox.production.js' : 'CreateLootbox.js'

const fileNames = [CreateLootbox]

fileNames.map((filename) => {
  uploadFile({
    filename,
    semver,
    absPath,
    bucketName,
  })
})

app.listen(process.env.PORT || 8088, () => {
  console.log('node server running')
})
