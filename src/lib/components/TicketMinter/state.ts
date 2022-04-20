import { proxy } from 'valtio'
import { subscribe } from 'valtio'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { initBuySharesState, buySharesState } from 'lib/components/BuyShares/state'
import { ContractAddress } from '@wormgraph/helpers'

export interface TicketMinterState {
  lootboxAddress: ContractAddress | undefined
  ticketID: string | undefined
}

const ticketMinterSnapshot: TicketMinterState = { lootboxAddress: undefined, ticketID: undefined }

export const ticketMinterState = proxy(ticketMinterSnapshot)

subscribe(buySharesState.lastTransaction, async () => {
  if (ticketMinterState.lootboxAddress) {
    try {
      const ticketId = await getLootboxTicketId(ticketMinterState.lootboxAddress)
      ticketMinterState.ticketID = ticketId
    } catch (err) {
      console.error(err)
    }
  }
})

export const loadState = async (lootboxAddress: ContractAddress) => {
  ticketCardState.lootboxAddress = lootboxAddress
  ticketMinterState.lootboxAddress = lootboxAddress
  let ticketID = undefined
  try {
    ;[ticketID] = await getLootboxTicketId(lootboxAddress)
  } catch (err) {
    console.error('Error fetching ticket id', err)
    ticketID = '0'
  }
  try {
    await initBuySharesState(lootboxAddress)
  } catch (err) {
    console.error('Error init buy sharesstate', err)
  }
  ticketMinterState.ticketID = ticketID
  loadTicketData(ticketID).catch((err) => console.error('Error loading ticket data', err))
}
