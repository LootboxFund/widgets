import { ILootbox, ITicket, Address } from 'lib/types'
import { proxy, subscribe } from 'valtio'
import { getLootboxURI } from 'lib/hooks/useContract'
import { readTicketMetadata } from 'lib/api/storage'

export interface TicketCardState {
  lootboxAddress: Address | undefined
  lootboxURI: string | undefined
  tickets: {
    [key: string]: ITicket
  }
}

const ticketCardSnapshot: TicketCardState = { lootboxAddress: undefined, tickets: {}, lootboxURI: undefined }

export const ticketCardState = proxy(ticketCardSnapshot)

export const generateStateID = (ticket: ITicket) => `${ticket.metadata.name}${ticket.id}`

export const initializeLootbox = async (lootboxAddress: Address) => {
  const { lootboxURI } = await getLootboxURI(lootboxAddress)
  ticketCardState.lootboxURI = lootboxURI
}

export const loadTicketData = async (ticketID: string) => {
  if (!ticketCardState?.lootboxURI) {
    return
  }
  const metadata = await readTicketMetadata(ticketCardState.lootboxURI)
  const stateID = generateStateID({ id: ticketID, metadata })
  ticketCardState.tickets[stateID] = {
    id: ticketID,
    metadata,
  }
}
