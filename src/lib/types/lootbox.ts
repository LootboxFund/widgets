import { Address, TicketID, ContractAddress, ITicketMetadata } from '@wormgraph/helpers';

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
