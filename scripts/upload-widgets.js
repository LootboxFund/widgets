const { Storage } = require('@google-cloud/storage')
const express = require('express')

const app = new express()

const storage = new Storage()

const semver = '0.1.0-demo'
const bucketName = 'guildfx-exchange.appspot.com'

const filename = process.env.NODE_ENV === 'production' ? 'bundle.production.js' : 'bundle.js'
const filepath = `widgets/${semver}/build/${filename}`
let localFilePath = `/Users/kangzeroo/Projects/GuildFX/widgets/iife/${filename}`

// Testing out upload of file
const uploadFile = async () => {
  // Uploads a local file to the bucket
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

uploadFile()

app.listen(process.env.PORT || 8088, () => {
  console.log('node server running')
})
