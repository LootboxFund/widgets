import { BigNumber } from 'bignumber.js'
import { Address } from 'lib/types/baseTypes'
import { ChainIDHex, Url, ChainIDDecimal, TokenData } from '@guildfx/helpers'

// update this to match backend types `TokenDataFE`
export interface TokenDataFE extends TokenData {
  usdPrice: string
}

interface IAddresses {
  /** GuildFX Constants address (from deploy script "./scripts/deployGuildFactory.dev.ts") */
  gfxConstants: string
}

export const DEFAULT_CHAIN_ID_HEX = '0x38'

// TODO: Dynamically load this
export const BSC_TESTNET_CROWDSALE_ADDRESS = '0x803c267a3bf44099b75ad4d244a1eddd98df13ba'

export type ChainInfo = {
  chainIdHex: ChainIDHex
  chainIdDecimal: ChainIDDecimal
  chainName: string
  displayName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: Url[]
  blockExplorerUrls: Url[]
  currentNetworkLogo: string
}
export const BLOCKCHAINS: Record<string, ChainInfo> = {
  '0x38': {
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    chainName: 'Binance Smart Chain',
    displayName: 'BSC Mainnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
    currentNetworkLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  },
  '0x61': {
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    chainName: 'Binance Smart Chain (Testnet)',
    displayName: 'BSC Testnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    currentNetworkLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  },
}

export const BSC_MAINNET_FULL_TOKEN_LIST: TokenDataFE[] = [
  {
    address: '0x0native',
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    priceOracle: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
  },
  {
    address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    name: 'Wrapped Ethereum',
    symbol: 'ETH',
    priceOracle: '0x9ef1b8c0e4f7dc8bf5719ea496883dc6401d5b2e',
  },
  {
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    name: 'USD Coin',
    symbol: 'USDC',
    priceOracle: '0x51597f405303c4377e36123cbc172b13269ea163',
  },
  {
    address: '0x55d398326f99059ff775485246999027b3197955',
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    name: 'Tether',
    symbol: 'USDT',
    priceOracle: '0xb97ad0e74fa7d920791e90258a6e2085088b4320',
  },
]

export const DEMO_CUSTOM_TOKENS_BSC_MAINNET: TokenDataFE[] = [
  {
    address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
    name: 'Dogecoin',
    symbol: 'DOGE',
    priceOracle: '0x3ab0a0d137d4f946fbb19eecc6e92e64660231c8',
  },
]

export const BSC_TESTNET_FULL_TOKEN_LIST: TokenDataFE[] = [
  {
    address: '0x0native',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    name: 'Binance Smart Chain',
    symbol: 'tBNB',
    priceOracle: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526',
  },
  {
    address: '0x7638f12cAf512BF4754B8166F5f26aC74BBFfFB5',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    name: 'Wrapped Ethereum',
    symbol: 'ETH',
    priceOracle: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7',
  },
  {
    address: '0x8031b35155d97B6730154B68C046d2C69A4Afd4d',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    name: 'USD Circle',
    symbol: 'USDC',
    priceOracle: '0x90c069C4538adAc136E051052E14c1cD799C41B7',
  },
  {
    address: '0xBb6Da17FF643a0F92B326f58de4133d4416A131e',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    name: 'Tether',
    symbol: 'USDT',
    priceOracle: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620',
  },
  {
    address: '0x016D620466C75DeBA325F4202973197CF5DfEd3A',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://i.imgur.com/gG1fBg0.jpg',
    name: 'Artemis',
    symbol: 'ATMS',
    priceOracle: '________',
  },
]
export const DEMO_CUSTOM_TOKENS_BSC_TESTNET = [
  {
    address: '_________________',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://i.imgur.com/gG1fBg0.jpg',
    name: 'Artemis',
    symbol: 'ATMS',
    priceOracle: '________',
  },
]

export const tokenMap: Record<string, TokenDataFE[]> = {
  '0x38': BSC_MAINNET_FULL_TOKEN_LIST,
  '0x61': BSC_TESTNET_FULL_TOKEN_LIST,
}

export const addresses: Record<string, IAddresses> = {
  // BSC MAINNET
  // 56: {},
  // BSC TESTNET 0x61 = 97
  '0x61': {
    // --- Contract addresses (from deploy scripts in backend) ---
    gfxConstants: '0x3aeDdd9AE5681E78e1645685d5898d88C43B568c',
  },
}
