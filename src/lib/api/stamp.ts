import { manifest } from 'manifest'
import { ChainIDHex, ContractAddress, Url } from '@wormgraph/helpers'

export const downloadFile = async (fileName: string, fileSrc: Url) => {
  const image = await fetch(fileSrc)
  const imageBlob = await image.blob()
  const imageURL = URL.createObjectURL(imageBlob)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return
}

interface StampNewLootboxProps {
  backgroundImage: Url
  badgeImage?: Url
  logoImage: Url
  themeColor: string
  name: string
  ticketID: string
  lootboxAddress: ContractAddress
  chainIdHex: ChainIDHex
  numShares: string
}
export const stampNewLootbox = async (props: StampNewLootboxProps): Promise<string> => {
  const { backgroundImage, logoImage, themeColor, name, ticketID, lootboxAddress, chainIdHex, numShares } = props
  const stampConfig = {
    backgroundImage,
    logoImage,
    themeColor,
    name,
    ticketID,
    lootboxAddress,
    chainIdHex,
    numShares,
  }
  const headers = new Headers({
    'Content-Type': 'application/json',
    secret: 'mysecret',
  })
  try {
    const data = await fetch(manifest.cloudRun.containers.stampNewLootbox.fullRoute, {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(stampConfig),
    })
    const { stamp } = await data.json()
    return stamp
  } catch (e) {
    console.log(e)
    return ''
  }
}

interface StampNewBadgeProps {
  backgroundImage: Url
  logoImage: Url
  themeColor: string
  guildName: string
  memberName: string
  ticketID: string
  badgeAddress: ContractAddress
  chainIdHex: ChainIDHex
}
export const stampNewBadge = async (props: StampNewBadgeProps): Promise<string> => {
  // constants
  const BADGE_STAMP_URL = 'https://stamp-nft-mfvwkxffsq-uc.a.run.app/stamp/new/badge-bcs'
  //
  const { backgroundImage, logoImage, themeColor, guildName, memberName, ticketID, badgeAddress, chainIdHex } = props
  const stampConfig = {
    backgroundImage,
    logoImage,
    themeColor,
    guildName,
    memberName,
    ticketID,
    badgeAddress,
    chainIdHex,
  }
  const headers = new Headers({
    'Content-Type': 'application/json',
    secret: '7XsxFA!C&X8f*5&65g3XFNXmJ^K#Y1BDlx2kVZRp',
  })
  try {
    const data = await fetch(BADGE_STAMP_URL, {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(stampConfig),
    })
    const { stamp } = await data.json()
    return stamp
  } catch (e) {
    console.log(e)
    return ''
  }
}
