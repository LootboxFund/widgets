import { Address, TicketID, ContractAddress, ITicketMetadata, ILootboxMetadata } from '@wormgraph/helpers'

export interface ILootbox {
  address: Address | undefined
  name: string | undefined
  symbol: string | undefined
  sharePriceWei: string | undefined
  sharesSoldCount: string | undefined
  sharesSoldMax: string | undefined
  ticketIdCounter: string | undefined
  shareDecimals: string | undefined
  variant: string | undefined
  ticketPurchaseFee: string | undefined
}

export interface ITicket {
  id: TicketID | undefined
  // @TODO make this correct ITicketMetadata type
  metadata: ILootboxMetadata | undefined
}

export interface IDividend {
  tokenAddress: Address
  tokenAmount: string
  tokenSymbol: string
  isRedeemed: boolean
}
