// $ npx tsc src/scripts/upload-lootboxUri.ts 

import { createTokenURIData } from '../lib/api/storage'

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