import { manifest } from 'manifest'
import { ChainIDHex, ContractAddress, ITicketMetadata, Url } from '@wormgraph/helpers'

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
    secret:
      'kjnlkvsjdnlkjsfnlvksjdnlksjdnvrjgnwoeirwhoqiwhqowncasljcnalsknaslkcnvlkdnlsdknscldksdjfnskdjfbksdjfbskdjqlwekjqwlekjqwlj',
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

interface StampNewTicketProps {
  backgroundImage: Url
  badgeImage?: Url
  logoImage: Url
  themeColor: string
  name: string
  ticketID: string
  lootboxAddress: ContractAddress
  chainIdHex: ChainIDHex
  numShares: string
  metadata: ITicketMetadata
}

export const stampNewTicket = async (props: StampNewTicketProps): Promise<string> => {
  const { backgroundImage, logoImage, themeColor, name, ticketID, lootboxAddress, chainIdHex, numShares, metadata } =
    props
  const stampConfig = {
    backgroundImage,
    logoImage,
    themeColor,
    name,
    ticketID,
    lootboxAddress,
    chainIdHex,
    numShares,
    metadata,
  }
  const headers = new Headers({
    'Content-Type': 'application/json',
    secret:
      ';kdfng;dkjfgn;dkfjgnsldkjfna;sdaposdjpaokcpaoskpaosckapsocksdgnekrfnvlsdknalkdcnalsdgbrhejbgjrbkbakjsbaksjbksdjfs',
  })
  try {
    const data = await fetch(manifest.cloudRun.containers.stampNewTicket.fullRoute, {
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
