/**
 *  Run this script to give Pipedream sample data (source:onLootboxURI)
 * 
 *  $ node scripts/upload-lootboxUri.js
 */

const PIPEDREAM_TOKEN_URI_UPLOADER = "_________________________"

const createTokenURIData = async (inputs) => {
  console.log(`... createTokenURIData`)
  const headers = new Headers({
    'Content-Type': 'application/json',
    'secret': 'mysecret'
  });
  const x = await fetch(PIPEDREAM_TOKEN_URI_UPLOADER, {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(inputs)
  })
  console.log(x)
  return x
}

createTokenURIData({
  address: "0x00000000000000000000000",
  name: "lootboxName",
  description: "ticketState.description as string",
  image: "ticketState.logoUrl as string",
  backgroundColor: "ticketState.lootboxThemeColor as string",
  backgroundImage: "ticketState.coverUrl as string",
  lootbox: {
    address: "lootbox",
    chainIdHex: "chainIdHex",
    chainIdDecimal: "chainIdDecimal",
    chainName: "chainName",
    targetPaybackDate: new Date(),
    fundraisingTarget: "100000000",
    basisPointsReturnTarget: "100",
    returnAmountTarget: "1100000000",
    pricePerShare: "10000000",
    lootboxThemeColor: "#345dsf",
    transactionHash: "event.transactionHash as string",
    blockNumber: "event.blockNumber"
  },
  socials: {
    twitter: "socialState.twitter",
    email: "socialState.email",
    instagram: "socialState.instagram",
    tiktok: "socialState.tiktok",
    facebook: "socialState.facebook",
    discord: "socialState.discord",
    youtube: "socialState.youtube",
    snapchat: "socialState.snapchat",
    twitch: "socialState.twitch",
    web: "socialState.web",
  }
})