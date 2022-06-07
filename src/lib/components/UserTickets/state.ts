import { proxy, subscribe } from 'valtio'
import { fetchUserTicketsFromLootbox } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { userState } from 'lib/state/userState'
import { buySharesState, loadInputTokenData, initBuySharesState } from '../BuyShares/state'
import { Address, ContractAddress } from '@wormgraph/helpers'
import { promiseChainDelay } from 'lib/utils/promise'

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
    promiseChainDelay([
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
