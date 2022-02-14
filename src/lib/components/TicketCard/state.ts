import { ITicket, Address, IDividend } from 'lib/types'
import { proxy } from 'valtio'
import { getLootboxURI } from 'lib/hooks/useContract'
import { readTicketMetadata } from 'lib/api/storage'
import { getTicketDividends } from 'lib/hooks/useContract'
import { getTokenFromList } from 'lib/hooks/useTokenList'

type TicketCardRoutes = '/payout' | '/card'

const DEFAULT_ROUTE: TicketCardRoutes = '/card'

export interface ITicketFE {
  route: TicketCardRoutes
  data: ITicket
  dividends: IDividend[]
}

export interface TicketCardState {
  // route: TicketCardRoutes
  lootboxAddress: Address | undefined
  lootboxURI: string | undefined
  tickets: {
    [key: string]: ITicketFE
  }
}

const ticketCardSnapshot: TicketCardState = {
  // route: '/card',
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
  await loadDividends(ticketID)
}

export const loadDividends = async (ticketID: string) => {
  if (!ticketCardState?.lootboxAddress) {
    return
  }
  const stateID = generateStateID(ticketCardState.lootboxAddress, ticketID)
  if (ticketCardState.tickets[stateID]) {
    const dividendFragments = await getTicketDividends(ticketCardState?.lootboxAddress, ticketID)
    const dividends: IDividend[] = dividendFragments.map((fragment) => {
      const token = getTokenFromList(fragment.tokenAddress)
      const symbol = token ? token.symbol : ''
      return {
        tokenSymbol: symbol,
        tokenAmount: fragment.tokenAmount,
        tokenAddress: fragment.tokenAddress,
        isRedeemed: false, // TODO: hardcoded for now
      }
    })
    ticketCardState.tickets[stateID].dividends = dividends
  }
}
