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

const PartyBasketManage =
  process.env.NODE_ENV === 'production' ? 'PartyBasketManage.production.js' : 'PartyBasketManage.js'

const fileNames = [PartyBasketManage]

fileNames.map((filename, idx) => {
  return uploadFile({
    filename,
    semver,
    absPath,
    bucketName,
  })
  if (idx === fileNames.length - 1) {
    process.exit()
  }
  return
})

app.listen(process.env.PORT || 8088, () => {
  console.log('node server running')
})
