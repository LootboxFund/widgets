const packageJSON = require('../package.json')
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
const semver = packageJSON.version
const absPath = '/Users/starship420/repo/lootbox/widgets/iife/'

console.log(`

  Uploading ${semver} to ${bucketName}

  env: ${process.env.NODE_ENV}
`)

const ViralOnboarding = process.env.NODE_ENV === 'production' ? 'ViralOnboarding.production.js' : 'ViralOnboarding.js'
const ViralOnboardingCSS =
  process.env.NODE_ENV === 'production' ? 'ViralOnboarding.production.css' : 'ViralOnboarding.js.css'

const fileNames = [ViralOnboarding, ViralOnboardingCSS]

const run = async () => {
  console.log(`running...`)
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
