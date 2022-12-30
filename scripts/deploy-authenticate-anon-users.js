const express = require('express')
const app = new express()
const { Manifest_v0_7_5_prod: Manifest } = require('@wormgraph/manifest')
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

const AuthenticateAnonUsers =
  process.env.NODE_ENV === 'production' ? 'AuthenticateAnonUsers.production.js' : 'AuthenticateAnonUsers.js'

const fileNames = [AuthenticateAnonUsers]

const run = async () => {
  await Promise.all(
    fileNames.map((filename, idx) => {
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
