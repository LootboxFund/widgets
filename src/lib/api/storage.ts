import { ChainIDHex, ITicketMetadata, TicketID, Address, ContractAddress } from '@wormgraph/helpers'
import { SemanticVersion } from '@wormgraph/manifest'
import { manifest } from '../../manifest'
import { encodeURISafe } from './helpers'

const getLootboxURI = async ({ lootboxAddress, bucket }: { lootboxAddress: ContractAddress; bucket: string }) => {
  const filePath = `${bucket}/${lootboxAddress}.json`
  const downloadablePath = `${manifest.storage.downloadUrl}/${encodeURISafe(filePath)}`
  const lootboxURI = await (await fetch(downloadablePath)).json()
  return lootboxURI
}

export const readTicketMetadata = async (lootboxAddress: ContractAddress): Promise<ITicketMetadata | undefined> => {
  const metadata = await getLootboxURI({
    lootboxAddress,
    bucket: manifest.storage.buckets.data.id,
  })

  return metadata?.data as ITicketMetadata | undefined
}
