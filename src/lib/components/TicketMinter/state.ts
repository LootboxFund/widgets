import { ITicket, Address } from 'lib/types'
import { proxy } from 'valtio'
import { subscribe } from 'valtio'
import { getLootboxTicketId } from 'lib/hooks/useContract'

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
