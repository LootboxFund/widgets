
import { ChainIDDecimal, ChainIDHex, Address, ContractAddress } from '@lootboxfund/helpers';


export interface NetworkOption {
  name: string;
  icon: string;
  symbol: string;
  themeColor: string;
  chainIdHex: ChainIDHex,
  chainIdDecimal: ChainIDDecimal,
  isAvailable: boolean;
  priceFeed?: Address;
  isTestnet?: boolean;
}
export const NETWORK_OPTIONS: NetworkOption[] = [
  // {
  //   name: 'Binance',
  //   symbol: 'BNB',
  //   themeColor: '#F0B90B',
  //   chainIdHex: 'a',
  //   chainIdDecimal: '',
  //   isAvailable: true,
  //   icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
  //   priceFeed: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
  // },
  {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: 'a',
    chainIdDecimal: '',
    isAvailable: true,
    isTestnet: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    themeColor: '#8F5AE8',
    chainIdHex: 'b',
    chainIdDecimal: '',
    isAvailable: true,
    isTestnet: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media',
    priceFeed: '0xab594600376ec9fd91f8e885dadf0ce036862de0' as ContractAddress,
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
