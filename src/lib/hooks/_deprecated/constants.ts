import { version } from '../../../../package.json'
import { ChainIDHex, Url, ChainIDDecimal, TokenData, Address } from '@lootboxfund/helpers'

// update this to match backend types `TokenDataFE`
export interface TokenDataFE extends TokenData {
  usdPrice?: string
}

interface IAddresses {
  /** GuildFX Constants address (from deploy script "./scripts/deployGuildFactory.dev.ts") */
  gfxConstants: string
}

export const USD_DECIMALS = 8
// TODO: DYNAMIC LOOTBOX_ADDRESS
// export const DEFAULT_LOOTBOX_ADDRESS = '0xeeb0ff2c65bbd583634611c4794a088bb8bb9b94'
export const DEFAULT_CHAIN_ID_HEX = '0x38'
export const STORAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com'

export const DEFAULT_TICKET_IMAGE = `${STORAGE_URL}/o/assets%2Fdefault-ticket-logo.png?alt=media`
export const DEFAULT_TICKET_BACKGROUND = `${STORAGE_URL}/o/assets%2Fdefault-ticket-background.png?alt=media`
export const DEFAULT_TICKET_BACKGROUND_COLOR = '#AC00FD'

export const PIPEDREAM_TOKEN_URI_UPLOADER = "https://93710fd07188364cb11a891d56bb93a2.m.pipedream.net"

// TODO: Dynamically load this
export const BSC_TESTNET_CROWDSALE_ADDRESS = '0x7B8f9b6Daa03E39BC046CA06c72C8A81b8FcEceb'

export const NATIVE_ADDRESS = '0x0native' as Address;

export const storageUrl = (chainID: ChainIDHex) => `${STORAGE_URL}/o/v/${version}/${chainID}`

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
  '13881': {
    chainIdHex: '13881',
    chainIdDecimal: '80001',
    chainName: 'Polygon Mumbai (Testnet)',
    displayName: 'Mumbai',
    nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    currentNetworkLogo:
      'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media',
  },
  '89': {
    chainIdHex: '89',
    chainIdDecimal: '137',
    chainName: 'Polygon (Mainnet)',
    displayName: 'Polygon Mainnet',
    nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
    currentNetworkLogo:
      'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media',
  },
}

export const BSC_MAINNET_FULL_TOKEN_LIST: TokenDataFE[] = [
  {
    address: NATIVE_ADDRESS,
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    priceOracle: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee' as Address,
  },
  {
    address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8' as Address,
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    name: 'Wrapped Ethereum',
    symbol: 'ETH',
    priceOracle: '0x9ef1b8c0e4f7dc8bf5719ea496883dc6401d5b2e' as Address,
  },
  {
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' as Address,
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    name: 'USD Coin',
    symbol: 'USDC',
    priceOracle: '0x51597f405303c4377e36123cbc172b13269ea163' as Address,
  },
  {
    address: '0x55d398326f99059ff775485246999027b3197955' as Address,
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    name: 'Tether',
    symbol: 'USDT',
    priceOracle: '0xb97ad0e74fa7d920791e90258a6e2085088b4320' as Address,
  },
]

export const DEMO_CUSTOM_TOKENS_BSC_MAINNET: TokenDataFE[] = [
  {
    address: '0xba2ae424d960c26247dd6c32edc70b295c744c43' as Address,
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
    name: 'Dogecoin',
    symbol: 'DOGE',
    priceOracle: '0x3ab0a0d137d4f946fbb19eecc6e92e64660231c8' as Address,
  },
]

export const BSC_TESTNET_FULL_TOKEN_LIST: TokenDataFE[] = [
  {
    address: NATIVE_ADDRESS,
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    name: 'Binance Smart Chain',
    symbol: 'tBNB',
    priceOracle: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as Address,
  },
  {
    address: '0x98a0BE5B6a1195DC7F189957847Fac179D1a93F9' as Address,
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    name: 'Wrapped Ethereum',
    symbol: 'ETH',
    priceOracle: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7' as Address,
  },
  {
    address: '0xb224C63DAf1f6823900bf10dBA511ad0F646bF22' as Address,
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    name: 'USD Circle',
    symbol: 'USDC',
    priceOracle: '0x90c069C4538adAc136E051052E14c1cD799C41B7' as Address,
  },
  {
    address: '0x2E84416b422801ddf81049DE572C05167D640822' as Address,
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    name: 'Tether',
    symbol: 'USDT',
    priceOracle: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620' as Address,
  },
  {
    address: '0xf5dFf9D049b0BD219b82d38DeecdFaB0D30b85f6' as Address,
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://i.imgur.com/gG1fBg0.jpg',
    name: 'Artemis',
    symbol: 'ATMS',
    priceOracle: '________' as Address,
  },
]
export const DEMO_CUSTOM_TOKENS_BSC_TESTNET = [
  {
    address: '_________________' as Address,
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    decimals: 18,
    logoURI: 'https://i.imgur.com/gG1fBg0.jpg',
    name: 'Artemis',
    symbol: 'ATMS',
    priceOracle: '________' as Address,
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
    gfxConstants: '0x168083FDF252ccF2543fbAE6cA44b42E1214D0c1',
  },
}
