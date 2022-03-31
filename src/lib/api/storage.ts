import { ChainIDHex, ITicketMetadata, TicketID, Address, ContractAddress } from '@wormgraph/helpers'
import { SemanticVersion } from '@wormgraph/manifest'
import { manifest } from '../../manifest'
import { encodeURISafe } from './helpers'

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
  const filePath = `${bucket}/${chainIdHex}/${lootboxAddress}.json`
  const downloadablePath = `${manifest.storage.downloadUrl}/${encodeURISafe(filePath)}?alt=media`
  const lootboxURI = await (await fetch(downloadablePath)).json()
  return lootboxURI
}

export const readTicketMetadata = async (
  lootboxAddress: ContractAddress,
  ticketID: TicketID
): Promise<ITicketMetadata> => {
  const { address, name, description, image, backgroundColor, backgroundImage } = await getLootboxURI({
    lootboxAddress,
    semver: manifest.googleCloud.semver,
    chainIdHex: manifest.chain.chainIDHex,
    bucket: manifest.storage.buckets.lootboxUri.id,
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
