import { Address, TicketID } from './baseTypes'

/**
 * Metadata of tickets stored on the IPFS
 */
export interface ITicketMetadata {
  name: string | undefined
  description: string | undefined
  image: string | undefined
  backgroundColor: string | undefined
  backgroundImage: string | undefined
}

export interface ILootbox {
  address: Address | undefined
  name: string | undefined
  symbol: string | undefined
  sharePriceUSD: string | undefined
  sharesSoldCount: string | undefined
  sharesSoldMax: string | undefined
  ticketIdCounter: string | undefined
  shareDecimals: string | undefined
}

export interface ITicket {
  id: TicketID | undefined
  metadata: ITicketMetadata
}

export interface IDividend {
  tokenAddress: Address
  tokenAmount: string
  tokenSymbol: string
  isRedeemed: boolean
}