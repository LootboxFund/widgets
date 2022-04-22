import { TokenData, Address } from '@wormgraph/helpers'
import { manifest } from '../../manifest'
import { SocialFragment } from 'lib/types'
import { ScreenSize } from './useScreenSize'

// update this to match backend types `TokenDataFE`
export interface TokenDataFE extends TokenData {
  usdPrice?: string
}
export const USD_DECIMALS = 8
export const DEFAULT_CHAIN_ID_HEX = manifest.chain.chainIDHex
export const DEFAULT_TICKET_IMAGE = `${manifest.storage.downloadUrl}/o/${manifest.storage.buckets.constants.id}%2Fassets%2Fdefault-ticket-logo.png?alt=media`
export const DEFAULT_TICKET_BACKGROUND = `${manifest.storage.downloadUrl}/o/${manifest.storage.buckets.constants.id}%2Fassets%2Fdefault-ticket-background.png?alt=media`
export const DEFAULT_TICKET_BACKGROUND_COLOR = '#AC00FD'
export const NATIVE_ADDRESS = '0x0native' as Address

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

export const tokenMap: Record<string, TokenDataFE[]> = {
  '0x38': BSC_MAINNET_FULL_TOKEN_LIST,
  '0x61': BSC_TESTNET_FULL_TOKEN_LIST,
  '13881': [],
  '89': [],
}

export const SOCIALS: SocialFragment[] = [
  {
    slug: 'email',
    name: 'Email',
    placeholder: 'Email',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Femail.png?alt=media',
  },
  {
    slug: 'twitter',
    name: 'Twitter',
    placeholder: 'Twitter',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ftwitter.png?alt=media',
  },
  {
    slug: 'youtube',
    name: 'YouTube',
    placeholder: 'YouTube 1 min Intro Video',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fyoutube.png?alt=media',
  },
  {
    slug: 'instagram',
    name: 'Instagram',
    placeholder: 'Instagram',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Finstagram.png?alt=media',
  },
  {
    slug: 'tiktok',
    name: 'Tiktok',
    placeholder: 'Tiktok',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ftiktok.png?alt=media',
  },
  {
    slug: 'facebook',
    name: 'Facebook',
    placeholder: 'Facebook',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ffacebook.png?alt=media',
  },
  {
    slug: 'discord',
    name: 'Discord',
    placeholder: 'Discord Server',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fdiscord.png?alt=media',
  },
  {
    slug: 'snapchat',
    name: 'Snapchat',
    placeholder: 'Snapchat',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fsnapchat.png?alt=media',
  },
  {
    slug: 'twitch',
    name: 'Twitch',
    placeholder: 'Twitch',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ftwitch.png?alt=media',
  },
  {
    slug: 'web',
    name: 'Website',
    placeholder: 'Website',
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fweb.png?alt=media',
  },
]

export const smallScreens: ScreenSize[] = ['mobile', 'tablet']
