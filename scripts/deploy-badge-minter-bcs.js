const { Storage } = require('@google-cloud/storage')
const express = require('express')
const app = new express()
const storage = new Storage()

/**
 * CONSTANTS
 *
 */
const bucketName = 'lootbox-widgets-staging'
const semver = '0.4.1h-blockchainspace-integration'
const absPath = '/users/kangzeroo/Projects/Lootbox/widgets/iife/'

console.log(`

  Uploading ${semver} to ${bucketName}

  env: ${process.env.NODE_ENV}
`)

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
      cacheControl: 'public, max-age=no-cache',
    },
  })
  console.log(`${filename} uploaded to ${bucketName}.`)
  await storage.bucket(bucketName).file(filepath).makePublic()
  console.log(`${filename} made public`)
  process.exit()
}

const BadgeMinterBCS = process.env.NODE_ENV === 'production' ? 'BadgeMinterBCS.production.js' : 'BadgeMinterBCS.js'
// const CreateLootbox = true ? 'CreateLootbox.production.js' : 'CreateLootbox.js' // Hack for production

const fileNames = [BadgeMinterBCS]

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
