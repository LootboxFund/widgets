const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const uploadFile = async ({ filename, semver, absPath, bucketName }) => {
  const build = 'build-74'
  // Uploads a local file to the bucket
  const filepath = `widgets/${semver}/${build}/${filename}`
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
      //   cacheControl: 'public, max-age=no-cache',
    },
  })
  console.log(`${filename} on semver=${semver} build=${build} uploaded to ${bucketName}.`)
  await storage.bucket(bucketName).file(filepath).makePublic()
  console.log(`${filename} made public`)
  // return
}

module.exports = { uploadFile }
