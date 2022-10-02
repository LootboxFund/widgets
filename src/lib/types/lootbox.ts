import { Address, TicketID } from '@wormgraph/helpers'
import { LootboxMetadata } from 'lib/api/graphql/generated/types'

/** @deprecated use Lootbox_Firestore or Lootbox type from helpers / GQL */
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

/** @deprecated use Lootbox_Firestore or Lootbox type from helpers / GQL */
export interface ITicket {
  id: TicketID | undefined
  // @TODO make this correct ITicketMetadata type
  metadata: LootboxMetadata | undefined
}

/** @deprecated use Lootbox_Firestore or Lootbox type from helpers / GQL */
export interface IDividend {
  tokenAddress: Address
  tokenAmount: string
  tokenSymbol: string
  isRedeemed: boolean
  decimal: string
}
