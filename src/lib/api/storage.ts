import { ITicketMetadata, TicketID, Address } from 'lib/types'
import {
  DEFAULT_CHAIN_ID_HEX,
  storageUrl,
  DEFAULT_TICKET_IMAGE,
  DEFAULT_TICKET_BACKGROUND,
  DEFAULT_TICKET_BACKGROUND_COLOR,
} from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'

const lootboxUrl = (lootboxAddress: Address) =>
  `${storageUrl(userState.network.currentNetworkIdHex || DEFAULT_CHAIN_ID_HEX)}/lootbox/${lootboxAddress}`

const metadataStorageUrl = (lootboxAddress: Address, ticketID: TicketID) =>
  `${lootboxUrl(lootboxAddress)}/lootbox/${lootboxAddress}/ticket/${ticketID}.json?alt=media`

const defaultMetadataStorageUrl = (lootboxAddress: Address) =>
  `${lootboxUrl(lootboxAddress)}/lootbox/${lootboxAddress}/ticket/default.json?alt=media`

export const readJSON = async <T>(file: string): Promise<T> => {
  // TODO: dynamically read json file in cloud storage
  const result: any = {
    name: 'Artemis Guild Demo',
    description: '',
    image: DEFAULT_TICKET_IMAGE,
    backgroundColor: DEFAULT_TICKET_BACKGROUND_COLOR,
    backgroundImage: DEFAULT_TICKET_BACKGROUND,
  }
  return result as T
}

export const readTicketMetadata = async (lootboxAddress: Address, ticketID: TicketID): Promise<ITicketMetadata> => {
  const defaultFilepath = defaultMetadataStorageUrl(lootboxAddress)
  const filepath = metadataStorageUrl(lootboxAddress, ticketID)

  const { name, description, image, backgroundColor, backgroundImage } = await readJSON(filepath)

  return { name, description, image, backgroundColor, backgroundImage }
}
