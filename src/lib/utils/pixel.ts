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
  if (params.flightId) {
    url += `&flightId=${params.flightId}`
  }
  if (params.userId) {
    url += `&userId=${params.userId}`
  }
  if (params.adId) {
    url += `&adId=${params.adId}`
  }
  if (params.adSetId) {
    url += `&adSetId=${params.adSetId}`
  }
  if (params.offerId) {
    url += `&offerId=${params.offerId}`
  }
  if (params.claimId) {
    url += `&claimId=${params.claimId}`
  }
  if (params.campaignId) {
    url += `&campaignId=${params.campaignId}`
  }
  if (params.tournamentId) {
    url += `&tournamentId=${params.tournamentId}`
  }
  if (params.organizerID) {
    url += `&organizerID=${params.organizerID}`
  }
  if (params.promoterID) {
    url += `&promoterID=${params.promoterID}`
  }
  if (params.sessionId) {
    url += `&sessionId=${params.sessionId}`
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
