import {
  DEFAULT_CHAIN_ID_HEX,
  storageUrl,
  DEFAULT_TICKET_IMAGE,
  DEFAULT_TICKET_BACKGROUND,
  DEFAULT_TICKET_BACKGROUND_COLOR,
} from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'
import { SemanticVersion, ChainIDHex, ITicketMetadata, TicketID, Address, ContractAddress } from '@lootboxfund/helpers'
import { manifest } from '../../manifest'
import { encodeURISafe } from './helpers'

const lootboxUrl = (lootboxAddress: Address) =>
  `${storageUrl(userState.network.currentNetworkIdHex || DEFAULT_CHAIN_ID_HEX)}/lootbox/${lootboxAddress}`

const metadataStorageUrl = (lootboxAddress: Address, ticketID: TicketID) =>
  `${lootboxUrl(lootboxAddress)}/lootbox/${lootboxAddress}/ticket/${ticketID}.json?alt=media`

const defaultMetadataStorageUrl = (lootboxAddress: Address) =>
  `${lootboxUrl(lootboxAddress)}/lootbox/${lootboxAddress}/ticket/default.json?alt=media`

export const readJSON = async <T>(file: string): Promise<T> => {
  // TODO: dynamically read json file in cloud storage
  const result: any = {
    address: '________',
    name: 'Artemis Guild',
    description: '',
    image: DEFAULT_TICKET_IMAGE,
    backgroundColor: DEFAULT_TICKET_BACKGROUND_COLOR,
    backgroundImage: DEFAULT_TICKET_BACKGROUND,
  }
  return result as T
}

export const getLootboxURI = async ({
  semver,
  chainIdHex,
  lootboxAddress,
  bucket,
}: {
  semver: SemanticVersion
  chainIdHex: ChainIDHex
  lootboxAddress: ContractAddress
  bucket: string
}) => {
  const filePath = `v/${semver}/${chainIdHex}/lootbox-uri/${lootboxAddress}.json`
  const downloadablePath = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURISafe(
    filePath
  )}?alt=media`
  const lootboxURI = await (await fetch(downloadablePath)).json()
  return lootboxURI
}

export const readTicketMetadata = async (
  lootboxAddress: ContractAddress,
  ticketID: TicketID
): Promise<ITicketMetadata> => {
  // const defaultFilepath = defaultMetadataStorageUrl(lootboxAddress)
  // const filepath = metadataStorageUrl(lootboxAddress, ticketID)
  // const { address, name, description, image, backgroundColor, backgroundImage } = await readJSON(filepath)
  const { address, name, description, image, backgroundColor, backgroundImage } = await getLootboxURI({
    lootboxAddress,
    semver: manifest.googleCloud.semver,
    chainIdHex: manifest.chain.chainIDHex,
    bucket: manifest.googleCloud.bucket.id,
  })

  return { address, name, description, image, backgroundColor, backgroundImage }
}

export const createTokenURIData = async (inputs: ITicketMetadata) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    secret: 'mysecret',
  })
  const x = await fetch(manifest.pipedream.sources.onLootboxURI.webhookEndpoint, {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(inputs),
  })

  return x
}
