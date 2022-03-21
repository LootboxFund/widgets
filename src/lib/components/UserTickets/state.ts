import { proxy, subscribe } from 'valtio'
import { fetchUserTicketsFromLootbox } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { userState } from 'lib/state/userState'
import { buySharesState, loadInputTokenData, initBuySharesState } from '../BuyShares/state'
import { Address, ContractAddress } from '@wormgraph/helpers'

// const MAX_INT = new BN(2).pow(256).minus(1)
const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935' // Largest uint256 number

export interface UserTicketsState {
  lootboxAddress: ContractAddress | undefined
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
      userTicketState.lootboxAddress && initBuySharesState(userTicketState.lootboxAddress),
    ])
  }
})

export const loadState = async (lootboxAddress: ContractAddress) => {
  userTicketState.lootboxAddress = lootboxAddress
  ticketCardState.lootboxAddress = lootboxAddress
  try {
    await loadUserTickets()
  } catch (err) {
    console.error('Error loading user tickets', err)
  }
}

export const loadUserTickets = async () => {
  if (!userTicketState.lootboxAddress) {
    throw new Error('No lootbox initialized')
  }

  if (!userState.currentAccount) {
    throw new Error('No user account')
  }

  userTicketState.userTickets = await fetchUserTicketsFromLootbox(
    userState.currentAccount,
    userTicketState.lootboxAddress
  )

  for (const ticket of userTicketState.userTickets) {
    try {
      await loadTicketData(ticket)
    } catch (err) {
      console.error('Error loading ticket', err)
    }
  }
}
