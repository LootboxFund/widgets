import { Address, TicketID, ContractAddress } from '@lootboxfund/helpers';

/**
 * Metadata of tickets stored on the IPFS
 */
export interface ITicketMetadata {
  address: ContractAddress
  name: string | undefined
  description: string | undefined
  image: string | undefined
  backgroundColor: string | undefined
  backgroundImage: string | undefined
  lootbox?: {
    address: Address
    chainIdHex: string
    chainIdDecimal: string
    chainName: string
    targetPaybackDate: Date
    fundraisingTarget: string
    basisPointsReturnTarget: string
    returnAmountTarget: string
    pricePerShare: string
    lootboxThemeColor: string
    transactionHash: string
    blockNumber: string
  },
  socials?: {
    twitter: string;
    email: string;
    instagram: string;
    tiktok: string;
    facebook: string;
    discord: string;
    youtube: string;
    snapchat: string;
    twitch: string;
    web:string;
  }
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
