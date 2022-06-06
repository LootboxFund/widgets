import { ITicketMetadata, ContractAddress } from '@wormgraph/helpers'
import { manifest } from '../../manifest'
import { encodeURISafe } from './helpers'
import { parseLootboxMetadata } from '../utils/parseTicketMetadata'
import { LootboxMetadata } from './graphql/generated/types'

const getLootboxURI = async ({ lootboxAddress, bucket }: { lootboxAddress: ContractAddress; bucket: string }) => {
  try {
    const filePath = `${bucket}/${lootboxAddress.toLowerCase()}/lootbox.json`
    const downloadablePath = `${manifest.storage.downloadUrl}/${encodeURISafe(filePath)}`
    const lootboxURI = await (await fetch(downloadablePath)).json()
    return lootboxURI
  } catch (err) {
    if (err?.name === 'SyntaxError') {
      // Possibly can't find the uri file because its in a deprecated path
      // TODO: remove this once we're ready
      const filePath = `${bucket}/${lootboxAddress}.json`
      console.log('Retrying metadata read with deprecated path', filePath)
      const downloadablePath = `${manifest.storage.downloadUrl}/${encodeURISafe(filePath)}`
      const lootboxURI = await (await fetch(downloadablePath)).json()
      return lootboxURI
    }
  }
  return undefined
}

const getTicketURI = async ({
  lootboxAddress,
  bucket,
  ticket,
}: {
  lootboxAddress: ContractAddress
  bucket: string
  ticket: string
}) => {
  const filePath = `${bucket}/${lootboxAddress.toLowerCase()}/${ticket}.json`
  const downloadablePath = `${manifest.storage.downloadUrl}/${encodeURISafe(filePath)}`
  const ticketURI = await (await fetch(downloadablePath)).json()
  return ticketURI
}

export const readLootboxMetadata = async (lootboxAddress: ContractAddress): Promise<LootboxMetadata | undefined> => {
  const metadata = await getLootboxURI({
    lootboxAddress,
    bucket: manifest.storage.buckets.data.id,
  })

  return parseLootboxMetadata(metadata)
}

export const readTicketMetadata = async (
  lootboxAddress: ContractAddress,
  ticket: string
): Promise<ITicketMetadata | undefined> => {
  const metadata = await getTicketURI({
    lootboxAddress,
    bucket: manifest.storage.buckets.data.id,
    ticket,
  })

  return metadata
}
