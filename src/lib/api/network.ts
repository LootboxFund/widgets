import { ChainIDDecimal, ChainIDHex, Address, ContractAddress, BLOCKCHAINS } from '@wormgraph/helpers'

export interface NetworkOption {
  name: string
  icon: string
  symbol: string
  themeColor: string
  chainIdHex: ChainIDHex
  chainIdDecimal: ChainIDDecimal
  isAvailable: boolean
  priceFeed?: Address
  isTestnet?: boolean
  faucetUrl?: string
  blockExplorerUrl?: string
}
export const NETWORK_OPTIONS: NetworkOption[] = [
  // {
  //   name: 'Binance',
  //   symbol: 'BNB',
  //   themeColor: '#F0B90B',
  //   chainIdHex: '0x61',
  //   chainIdDecimal: '97',
  //   isAvailable: true,
  //   isTestnet: true,
  //   icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
  //   priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
  //   faucetUrl: 'https://testnet.binance.org/faucet-smart',
  //   blockExplorerUrl: 'https://testnet.bscscan.com/',
  // },
  // {
  //   name: 'Polygon',
  //   symbol: 'MATIC',
  //   themeColor: '#8F5AE8',
  //   chainIdHex: '0x13881',
  //   chainIdDecimal: '80001',
  //   isAvailable: true,
  //   isTestnet: true,
  //   icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC_COLORED.png?alt=media',
  //   priceFeed: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada' as ContractAddress,
  //   faucetUrl: 'https://faucet.polygon.technology/',
  //   blockExplorerUrl: 'https://mumbai.polygonscan.com/',
  // },
  {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: BLOCKCHAINS.BSC_MAINNET.chainIdHex,
    chainIdDecimal: BLOCKCHAINS.BSC_MAINNET.chainIdDecimal,
    isAvailable: true,
    isTestnet: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    priceFeed: BLOCKCHAINS.BSC_MAINNET.priceFeedUSD,
    blockExplorerUrl: BLOCKCHAINS.BSC_MAINNET.blockExplorerUrls[0],
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    themeColor: '#8F5AE8',
    chainIdHex: BLOCKCHAINS.POLYGON_MAINNET.chainIdHex,
    chainIdDecimal: BLOCKCHAINS.POLYGON_MAINNET.chainIdDecimal,
    isAvailable: true,
    isTestnet: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC_COLORED.png?alt=media',
    priceFeed: BLOCKCHAINS.POLYGON_MAINNET.priceFeedUSD,
    blockExplorerUrl: BLOCKCHAINS.POLYGON_MAINNET.blockExplorerUrls[0],
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    themeColor: '#627EEA',
    chainIdHex: 'c',
    chainIdDecimal: '',
    isAvailable: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FETH.png?alt=media',
    priceFeed: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419' as ContractAddress,
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    themeColor: '#0BC695',
    chainIdHex: 'd',
    chainIdDecimal: '',
    isAvailable: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FSOL.png?alt=media',
  },
  {
    name: 'Fantom',
    symbol: 'FTM',
    themeColor: '#13B5EC',
    chainIdHex: 'e',
    chainIdDecimal: '',
    isAvailable: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FFANTOM.png?alt=media',
    priceFeed: '0xf4766552d15ae4d256ad41b6cf2933482b0680dc' as ContractAddress,
  },
]

export const matchNetworkByHex = (chainIdHex: ChainIDHex) => {
  return NETWORK_OPTIONS.find((network) => network.chainIdHex === chainIdHex)
}
