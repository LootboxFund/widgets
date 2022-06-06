import { Address, TicketID } from '@wormgraph/helpers'
import { LootboxMetadata } from 'lib/api/graphql/generated/types'

export interface ILootbox {
  address: Address | undefined
  name: string | undefined
  symbol: string | undefined
  sharePriceWei: string | undefined
  sharesSoldCount: string | undefined
  sharesSoldMax: string | undefined
  sharesSoldTarget: string | undefined
  ticketIdCounter: string | undefined
  shareDecimals: string | undefined
  variant: string | undefined
  ticketPurchaseFee: string | undefined
}

export interface ITicket {
  id: TicketID | undefined
  // @TODO make this correct ITicketMetadata type
  metadata: LootboxMetadata | undefined
}

export interface IDividend {
  tokenAddress: Address
  tokenAmount: string
  tokenSymbol: string
  isRedeemed: boolean
}
