const { Storage } = require('@google-cloud/storage')
const express = require('express')

const app = new express()
const storage = new Storage()
const bucketName = 'guildfx-exchange.appspot.com'

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
      // cacheControl: 'public, max-age=31536000',
      cacheControl: 'no-cache', // ONLY FOR DEV
    },
  })
  console.log(`${filename} uploaded to ${bucketName}.`)
  await storage.bucket(bucketName).file(filepath).makePublic()
  console.log(`${filename} made public`)
  process.exit()
}

const semver = '0.2.0-demo'
const absPath = '/Users/starship420/repo/lootbox/widgets/iife/'

const InteractWithLootbox =
  process.env.NODE_ENV === 'production' ? 'InteractWithLootbox.production.js' : 'InteractWithLootbox.js'
const fileNames = [InteractWithLootbox]

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
