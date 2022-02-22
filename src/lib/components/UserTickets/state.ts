import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe } from 'valtio'
import { fetchUserTicketsFromLootbox } from 'lib/hooks/useContract'
import { loadTicketData } from 'lib/components/TicketCard/state'
import { userState } from 'lib/state/userState'
import { buySharesState, loadInputTokenData, fetchLootboxData } from '../BuyShares/state'

// const MAX_INT = new BN(2).pow(256).minus(1)
const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935' // Largest uint256 number

export interface UserTicketsState {
  lootboxAddress: string | undefined
  userTickets: Address[]
}

const userTicketSnapshot: UserTicketsState = {
  lootboxAddress: undefined,
  userTickets: [],
}

export const userTicketState = proxy(userTicketSnapshot)

subscribe(userState, () => {
  loadUserTickets().catch((err) => console.error('Could not load user tickets', err))
})

subscribe(buySharesState.lastTransaction, () => {
  if (buySharesState.lastTransaction.success) {
    Promise.all([
      loadUserTickets(),
      loadInputTokenData(),
      userTicketState.lootboxAddress && fetchLootboxData(userTicketState.lootboxAddress),
    ])
  }
})

export const loadUserTickets = async () => {
  if (!userTicketState.lootboxAddress) {
    throw new Error('No lootbox initialized')
  }

  userTicketState.userTickets = await fetchUserTicketsFromLootbox(userTicketState.lootboxAddress)

  // // DEV HACK
  // const tix = await fetchUserTicketsFromLootbox(userTicketState.lootboxAddress)
  // userTicketState.userTickets = [...tix, ...tix]

  for (const ticket of userTicketState.userTickets) {
    try {
      await loadTicketData(ticket)
    } catch (err) {
      console.error('Error loading ticket', err)
    }
  }
}
