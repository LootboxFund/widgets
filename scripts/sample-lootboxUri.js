/**
 *  Run this script to give Pipedream sample data (source:onLootboxURI)
 *
 *  $ node scripts/sample-lootboxUri.js
 */

const axios = require('axios').default
const { Manifest_v0_2_0_demo: Manifest } = require('@lootboxfund/manifest')
const manifest = Manifest.default

const PIPEDREAM_TOKEN_URI_UPLOADER =
  manifest.pipedream.sources.onLootboxURI.webhookEndpoint || 'https://f9f785f54e8f51a5ae6ba9708ffe77cf.m.pipedream.net'

const createTokenURIData = async (inputs) => {
  console.log(`... createTokenURIData`)
  const headers = {
    'Content-Type': 'application/json',
    secret: 'mysecret',
  }
  const x = await axios.post(PIPEDREAM_TOKEN_URI_UPLOADER, JSON.stringify(inputs), {
    headers: headers,
  })
  console.log(x.data)
  return x
}

console.log(`Sending sample tokenURI to ${PIPEDREAM_TOKEN_URI_UPLOADER}`)

createTokenURIData({
  address: '0x00000000000000000000000',
  name: 'lootboxName',
  description: 'ticketState.description as string',
  image: 'ticketState.logoUrl as string',
  backgroundColor: 'ticketState.lootboxThemeColor as string',
  backgroundImage: 'ticketState.coverUrl as string',
  lootbox: {
    address: 'lootbox',
    chainIdHex: 'chainIdHex',
    chainIdDecimal: 'chainIdDecimal',
    chainName: 'chainName',
    targetPaybackDate: new Date(),
    fundraisingTarget: '100000000',
    basisPointsReturnTarget: '100',
    returnAmountTarget: '1100000000',
    pricePerShare: '10000000',
    lootboxThemeColor: '#345dsf',
    transactionHash: 'event.transactionHash as string',
    blockNumber: 'event.blockNumber',
  },
  socials: {
    twitter: 'socialState.twitter',
    email: 'socialState.email',
    instagram: 'socialState.instagram',
    tiktok: 'socialState.tiktok',
    facebook: 'socialState.facebook',
    discord: 'socialState.discord',
    youtube: 'socialState.youtube',
    snapchat: 'socialState.snapchat',
    twitch: 'socialState.twitch',
    web: 'socialState.web',
  },
})
