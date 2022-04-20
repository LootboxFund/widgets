import { ChainIDHex, ITicketMetadata, TicketID, Address, ContractAddress } from '@wormgraph/helpers'
import { SemanticVersion } from '@wormgraph/manifest'
import { manifest } from '../../manifest'
import { encodeURISafe } from './helpers'

const getLootboxURI = async ({
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
  const downloadablePath = `${manifest.storage.downloadUrl}/${encodeURISafe(filePath)}`
  const lootboxURI = await (await fetch(downloadablePath)).json()
  return lootboxURI
}

export const readTicketMetadata = async (
  lootboxAddress: ContractAddress,
  ticketID: TicketID
): Promise<ITicketMetadata | undefined> => {
  const metadata = await getLootboxURI({
    lootboxAddress,
    semver: manifest.googleCloud.semver,
    chainIdHex: manifest.chain.chainIDHex,
    bucket: manifest.storage.buckets.data.id,
  })

  return metadata?.data as ITicketMetadata | undefined
}
