import { AdEventNonce, AdID, ClaimID, PixelTrackingParams, SessionID } from '@wormgraph/helpers'
import { AdEventAction } from '../api/graphql/generated/types'
import { v4 as uuidv } from 'uuid'
import { manifest } from '../../manifest'

export const buildAdTrackingPixelUrl = (params: PixelTrackingParams) => {
  // Prevents caching & helps dedupe
  const nonce: AdEventNonce = uuidv() as AdEventNonce
  let url = `
  ${manifest.storage.buckets.pixel.accessUrl}/${manifest.storage.buckets.pixel.files.adTrackingPixel}?`
  if (nonce) {
    url += `nonce=${nonce}`
  }
  if (params.eventAction) {
    url += `&eventAction=${params.eventAction}`
  }
  if (params.flightID) {
    url += `&flightID=${params.flightID}`
  }
  if (params.userID) {
    url += `&userID=${params.userID}`
  }
  if (params.adID) {
    url += `&adID=${params.adID}`
  }
  if (params.adSetID) {
    url += `&adSetID=${params.adSetID}`
  }
  if (params.offerID) {
    url += `&offerID=${params.offerID}`
  }
  if (params.claimID) {
    url += `&claimID=${params.claimID}`
  }
  if (params.campaignID) {
    url += `&campaignID=${params.campaignID}`
  }
  if (params.tournamentID) {
    url += `&tournamentID=${params.tournamentID}`
  }
  if (params.organizerID) {
    url += `&organizerID=${params.organizerID}`
  }
  if (params.promoterID) {
    url += `&promoterID=${params.promoterID}`
  }
  if (params.sessionID) {
    url += `&sessionID=${params.sessionID}`
  }
  if (params.timeElapsed) {
    url += `&timeElapsed=${params.timeElapsed}`
  }
  return url
}

export const loadAdTrackingPixel = (params: PixelTrackingParams) => {
  const img = document.createElement('img')
  img.width = 1
  img.height = 1
  img.src = buildAdTrackingPixelUrl(params)
  return
}
