import { ChainIDDecimal, ChainIDHex, Address, ContractAddress } from '@wormgraph/helpers'
import { StepStage } from './StepCard'

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
  factoryAddress: {
    escrowFactory: ContractAddress
    instantFactory: ContractAddress
  }
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
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    isAvailable: true,
    isTestnet: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
    faucetUrl: 'https://testnet.binance.org/faucet-smart',
    factoryAddress: {
      escrowFactory: '0x5AdA44C7C78f0bD017B77F0829e2a9CB62572123' as ContractAddress,
      instantFactory: '0xbc7280E8dba198B76a8aFc50C36542d96f2FEb59' as ContractAddress,
    },
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    themeColor: '#8F5AE8',
    chainIdHex: '0x13881',
    chainIdDecimal: '80001',
    isAvailable: true,
    isTestnet: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC_COLORED.png?alt=media',
    priceFeed: '0xab594600376ec9fd91f8e885dadf0ce036862de0' as ContractAddress,
    factoryAddress: {
      escrowFactory: '0xB28E7973F4A32f32140621222f413d75c579EEa9' as ContractAddress,
      instantFactory: '0xCdDF9951877EB654ED8Eb1623b04198ebcC4bAFF' as ContractAddress,
    },
  },
  // {
  //   name: 'Polygon',
  //   symbol: 'MATIC',
  //   themeColor: '#8F5AE8',
  //   chainIdHex: 'b',
  //   chainIdDecimal: '',
  //   isAvailable: false,
  //   isTestnet: false,
  //   icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media',
  //   priceFeed: '0xab594600376ec9fd91f8e885dadf0ce036862de0' as ContractAddress,
  // },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    themeColor: '#627EEA',
    chainIdHex: 'c',
    chainIdDecimal: '',
    isAvailable: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FETH.png?alt=media',
    priceFeed: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419' as ContractAddress,
    factoryAddress: {
      escrowFactory: '___' as ContractAddress,
      instantFactory: '___' as ContractAddress,
    },
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    themeColor: '#0BC695',
    chainIdHex: 'd',
    chainIdDecimal: '',
    isAvailable: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FSOL.png?alt=media',
    factoryAddress: {
      escrowFactory: '___' as ContractAddress,
      instantFactory: '___' as ContractAddress,
    },
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
    factoryAddress: {
      escrowFactory: '___' as ContractAddress,
      instantFactory: '___' as ContractAddress,
    },
  },
]

interface InitialFormStateCreateLootbox {
  stepNetwork: StepStage
  stepType: StepStage
  stepFunding: StepStage
  stepReturns: StepStage
  stepCustomize: StepStage
  stepSocials: StepStage
  stepTerms: StepStage
}
interface InitialFormValidityCreateLootbox {
  stepNetwork: boolean
  stepType: boolean
  stepFunding: boolean
  stepReturns: boolean
  stepCustomize: boolean
  stepSocials: boolean
  stepTerms: boolean
}
export const extractURLState_CreateLootboxPage = () => {
  const url = new URL(window.location.href)
  const INITIAL_FORM_STATE: InitialFormStateCreateLootbox = {
    stepNetwork: 'in_progress',
    stepType: 'not_yet',
    stepFunding: 'not_yet',
    stepReturns: 'not_yet',
    stepCustomize: 'not_yet',
    stepSocials: 'not_yet',
    stepTerms: 'not_yet',
  }
  const INITIAL_VALIDITY: InitialFormValidityCreateLootbox = {
    stepNetwork: false,
    stepType: false,
    stepFunding: false,
    stepReturns: false,
    stepCustomize: false,
    stepSocials: false,
    stepTerms: false,
  }
  const params = {
    network: url.searchParams.get('network'),
    type: url.searchParams.get('type'),
    fundingTarget: url.searchParams.get('fundingTarget'),
    fundingLimit: url.searchParams.get('fundingLimit'),
    receivingWallet: url.searchParams.get('tournamentWallet'),
    returnsTarget: url.searchParams.get('returnsTarget'),
    returnsDate: url.searchParams.get('returnsDate'),
    badgeImage: url.searchParams.get('badgeImage'),
    campaignName: url.searchParams.get('tournamentName'),
    campaignWebsite: url.searchParams.get('tournamentWebsite'),
  }
  if (params.network) {
    INITIAL_FORM_STATE.stepNetwork = 'may_proceed'
    INITIAL_VALIDITY.stepNetwork = true
  }
  if (params.type) {
    INITIAL_FORM_STATE.stepType = 'may_proceed'
    INITIAL_VALIDITY.stepType = true
  }
  if (params.fundingTarget || params.fundingLimit) {
    INITIAL_FORM_STATE.stepFunding = 'may_proceed'
    INITIAL_VALIDITY.stepFunding = true
  }
  if (params.returnsTarget && params.receivingWallet) {
    INITIAL_FORM_STATE.stepReturns = 'may_proceed'
    INITIAL_VALIDITY.stepReturns = true
  }
  return { INITIAL_FORM_STATE, INITIAL_VALIDITY, INITIAL_URL_PARAMS: params }
}
