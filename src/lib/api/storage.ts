import { ITicketMetadata, ContractAddress } from '@wormgraph/helpers'
import { manifest } from '../../manifest'
import { encodeURISafe } from './helpers'
import { parseTicketMetadata } from '../utils/parseTicketMetadata'

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

  return parseTicketMetadata(metadata)
}
