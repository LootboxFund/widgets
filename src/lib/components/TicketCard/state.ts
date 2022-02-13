import { ITicket, Address } from 'lib/types'
import { proxy } from 'valtio'
import { getLootboxURI } from 'lib/hooks/useContract'
import { readTicketMetadata } from 'lib/api/storage'

type TicketCardRoutes = '/payout' | '/card'

export interface TicketCardState {
  route: TicketCardRoutes
  lootboxAddress: Address | undefined
  lootboxURI: string | undefined
  tickets: {
    [key: string]: ITicket
  }
}

const ticketCardSnapshot: TicketCardState = {
  route: '/card',
  lootboxAddress: undefined,
  tickets: {},
  lootboxURI: undefined,
}

export const ticketCardState = proxy(ticketCardSnapshot)

export const generateStateID = (lootboxAddress: Address, ticketID: string) => `${lootboxAddress}${ticketID}`

export const initializeLootbox = async (lootboxAddress: Address) => {
  const { lootboxURI } = await getLootboxURI(lootboxAddress)
  ticketCardState.lootboxURI = lootboxURI
  ticketCardState.lootboxAddress = lootboxAddress
  return {
    lootboxAddress,
    lootboxURI,
  }
}

export const loadTicketData = async (ticketID: string) => {
  // TODO: ADD URI
  // if (!ticketCardState?.lootboxURI || !ticketCardState?.lootboxAddress) {
  if (!ticketCardState?.lootboxAddress) {
    return
  }
  const metadata = await readTicketMetadata(ticketCardState.lootboxAddress, ticketID)
  const stateID = generateStateID(ticketCardState.lootboxAddress, ticketID)
  ticketCardState.tickets[stateID] = {
    id: ticketID,
    metadata,
  }
}
