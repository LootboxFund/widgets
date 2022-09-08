import { AdEventNonce, AdID, SessionID } from '@wormgraph/helpers'
import { AdEventAction } from '../api/graphql/generated/types'
import { v4 as uuidv } from 'uuid'
import { manifest } from '../../manifest'

interface PixelTrackingParams {
  adId: AdID | null
  sessionId: SessionID | null
  eventAction: AdEventAction | null
}

export const buildAdTrackingPixelUrl = (params: PixelTrackingParams) => {
  // Prevents caching & helps dedupe
  const nonce: AdEventNonce = uuidv() as AdEventNonce
  const url = `${manifest.storage.buckets.pixel.accessUrl}/${manifest.storage.buckets.pixel.files.adTrackingPixel}?a=${params.adId}&s=${params.sessionId}&e=${params.eventAction}&n=${nonce}`
  return url
}

export const loadAdTrackingPixel = (params: PixelTrackingParams) => {
  const img = document.createElement('img')
  img.width = 1
  img.height = 1
  img.src = buildAdTrackingPixelUrl(params)
  return
}
