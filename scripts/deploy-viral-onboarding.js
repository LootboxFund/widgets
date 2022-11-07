const express = require('express')
const app = new express()
const { Manifest_v0_7_1_demo: Manifest } = require('@wormgraph/manifest')
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

const ViralOnboarding = process.env.NODE_ENV === 'production' ? 'ViralOnboarding.production.js' : 'ViralOnboarding.js'
const ViralOnboardingCSS =
  process.env.NODE_ENV === 'production' ? 'ViralOnboarding.production.css' : 'ViralOnboarding.js.css'

const fileNames = [ViralOnboarding, ViralOnboardingCSS]
// const fileNames = [ViralOnboarding]
// const fileNames = [ViralOnboardingCSS]

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
