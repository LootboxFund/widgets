import { ITicket, IDividend } from 'lib/types'
import { proxy } from 'valtio'
import { readTicketMetadata } from 'lib/api/storage'
import { getTicketDividends, withdrawEarningsFromLootbox, getERC20Symbol } from 'lib/hooks/useContract'
import { getTokenFromList } from 'lib/hooks/useTokenList'
import { NATIVE_ADDRESS } from 'lib/hooks/constants'
import { ContractAddress } from '@lootboxfund/helpers'

type TicketCardRoutes = '/payout' | '/card'

const DEFAULT_ROUTE: TicketCardRoutes = '/card'

export interface ITicketFE {
  route: TicketCardRoutes
  data: ITicket
  dividends: IDividend[]
}

export interface TicketCardState {
  lootboxAddress: ContractAddress | undefined
  tickets: {
    [key: string]: ITicketFE
  }
}

const ticketCardSnapshot: TicketCardState = {
  lootboxAddress: undefined,
  tickets: {},
}

export const ticketCardState = proxy(ticketCardSnapshot)

export const generateStateID = (lootboxAddress: ContractAddress, ticketID: string) => `${lootboxAddress}${ticketID}`

export const loadTicketData = async (ticketID: string) => {
  if (!ticketCardState?.lootboxAddress) {
    return
  }
  const metadata = await readTicketMetadata(ticketCardState.lootboxAddress, ticketID)
  const stateID = generateStateID(ticketCardState.lootboxAddress, ticketID)
  const isNew = !ticketCardState.tickets[stateID]
  ticketCardState.tickets[stateID] = {
    route: isNew ? DEFAULT_ROUTE : ticketCardState.tickets[stateID].route,
    dividends: isNew ? [] : ticketCardState.tickets[stateID].dividends,
    data: {
      id: ticketID,
      metadata,
    },
  }
}

export const loadDividends = async (ticketID: string) => {
  if (!ticketCardState?.lootboxAddress) {
    return
  }
  const stateID = generateStateID(ticketCardState.lootboxAddress, ticketID)
  if (!ticketCardState.tickets[stateID]) {
    await loadTicketData(ticketID)
  }
  const dividendFragments = await getTicketDividends(ticketCardState.lootboxAddress, ticketID)
  const nativeToken = getTokenFromList(NATIVE_ADDRESS)
  const dividends: IDividend[] = await Promise.all(
    dividendFragments.map(async (fragment) => {
      let symbol: string
      if (fragment.tokenAddress === NATIVE_ADDRESS) {
        symbol = nativeToken?.symbol || NATIVE_ADDRESS
      } else {
        try {
          symbol = await getERC20Symbol(fragment.tokenAddress)
        } catch (err) {
          symbol = fragment.tokenAddress?.slice(0, 4) + '...' || ''
        }
      }
      return {
        tokenSymbol: symbol,
        tokenAmount: fragment.tokenAmount,
        tokenAddress: fragment.tokenAddress,
        isRedeemed: fragment.isRedeemed,
      }
    })
  )
  ticketCardState.tickets[stateID].dividends = dividends
}

export const redeemTicket = async (ticketID: string) => {
  if (!ticketCardState?.lootboxAddress) {
    return
  }

  // const stateID = generateStateID(ticketCardState.lootboxAddress, ticketID)
  await withdrawEarningsFromLootbox(ticketID, ticketCardState.lootboxAddress)
  await loadDividends(ticketID)
}
