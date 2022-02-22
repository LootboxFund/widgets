const { Storage } = require('@google-cloud/storage')
const express = require('express')
const app = new express()
const storage = new Storage()
const { Manifest_v0_2_0_sandbox: Manifest } = require("@lootboxfund/manifest")
export const manifest = Manifest.default

/**
 * CONSTANTS
 * 
 */
const bucketName = manifest.googleCloud.bucket.id || 'guildfx-exchange.appspot.com'
const semver = manifest.semver.id || '0.2.0-sandbox'
const absPath = '/Users/kangzeroo/Projects/GuildFX/widgets/iife/'



// Testing out upload of file
const uploadFile = async ({ filename, semver, absPath }) => {
  // Uploads a local file to the bucket
  const filepath = `widgets/${semver}/build/${filename}`
  const localFilePath = `${absPath}${filename}`
  await storage.bucket(bucketName).upload(localFilePath, {
    destination: filepath,
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  })
  console.log(`${filename} uploaded to ${bucketName}.`)
  await storage.bucket(bucketName).file(filepath).makePublic()
  console.log(`${filename} made public`)
  process.exit()
}

const CreateLootbox = process.env.NODE_ENV === 'production' ? 'CreateLootbox.production.js' : 'CreateLootbox.js'
const WalletStatus = process.env.NODE_ENV === 'production' ? 'WalletStatus.production.js' : 'WalletStatus.js'
// const TicketMinter = process.env.NODE_ENV === 'production' ? 'TicketMinter.production.js' : 'TicketMinter.js'
// const UserTickets = process.env.NODE_ENV === 'production' ? 'UserTickets.production.js' : 'UserTickets.js'
const fileNames = [CreateLootbox, WalletStatus]

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
