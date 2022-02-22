import { ITicket, Address } from 'lib/types'
import { proxy } from 'valtio'
import { subscribe } from 'valtio'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { fetchLootboxData } from 'lib/components/BuyShares/state'

export interface TicketMinterState {
  lootboxAddress: Address | undefined
  ticketID: string | undefined
}

const ticketMinterSnapshot: TicketMinterState = { lootboxAddress: undefined, ticketID: undefined }

export const ticketMinterState = proxy(ticketMinterSnapshot)

subscribe(ticketMinterState, async () => {
  if (ticketMinterState.lootboxAddress) {
    try {
      const ticketId = await getLootboxTicketId(ticketMinterState.lootboxAddress)
      ticketMinterState.ticketID = ticketId
    } catch (err) {
      console.error(err)
    }
  }
})

export const loadState = async (lootboxAddress: Address) => {
  ticketCardState.lootboxAddress = lootboxAddress
  ticketMinterState.lootboxAddress = lootboxAddress
  let ticketID = undefined
  try {
    ;[ticketID] = await Promise.all([getLootboxTicketId(lootboxAddress), fetchLootboxData(lootboxAddress)])
  } catch (err) {
    console.error('Error fetching ticket id', err)
    ticketID = '0'
  }
  ticketMinterState.ticketID = ticketID
  loadTicketData(ticketID).catch((err) => console.error('Error loading ticket data', err))
}
