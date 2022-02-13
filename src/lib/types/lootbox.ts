import { Address } from './baseTypes'

export interface ILootbox {
  address: Address | undefined
  name: string | undefined
  symbol: string | undefined
  sharePriceUSD: string | undefined
  sharesSoldCount: string | undefined
  sharesSoldGoal: string | undefined
  depositIdCounter: string | undefined
  sharesDecimals: string | undefined
}
