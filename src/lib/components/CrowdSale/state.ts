import { TokenDataFE, BSC_TESTNET_CROWDSALE_ADDRESS } from 'lib/hooks/constants'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe } from 'valtio'
import { swapState, SwapState } from 'lib/components/Swap/state'
import { getCrowdSaleSeedData } from 'lib/hooks/useContract'
import { tokenListState } from 'lib/hooks/useTokenList'
import BN from 'bignumber.js'

export type CrowdSaleRoute = '/crowdSale' | '/search'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface CrowdSaleState extends Omit<SwapState, 'route'> {
  route: CrowdSaleRoute
  stableCoins: Address[]
}

const crowdSaleSnapshot: CrowdSaleState = {
  route: '/crowdSale',
  targetToken: null,
  tokenDelegator: BSC_TESTNET_CROWDSALE_ADDRESS,
  inputToken: {
    data: undefined,
    quantity: undefined,
    displayedBalance: undefined,
    allowance: undefined,
  },
  outputToken: {
    data: undefined,
    quantity: undefined,
    displayedBalance: undefined,
    allowance: undefined,
    priceOverride: undefined,
  },
  stableCoins: [],
}

export const crowdSaleState = proxy(crowdSaleSnapshot)

// Keep this state in sync with Swap's state
subscribe(swapState.inputToken, () => {
  crowdSaleState.inputToken = swapState.inputToken
})
subscribe(swapState.outputToken, () => {
  crowdSaleState.outputToken = swapState.outputToken
})
subscribe(crowdSaleState, () => {
  swapState.tokenDelegator = crowdSaleState.tokenDelegator
})

// Re-route the route for the crowdsale specific logic
subscribe(swapState, () => {
  if (swapState.route === '/search') {
    crowdSaleState.route = '/search'
  } else if (swapState.route === '/swap') {
    crowdSaleState.route = '/crowdSale'
  }
})

export const fetchCrowdSaleData = async () => {
  if (!crowdSaleState.tokenDelegator) {
    return
  }
  const { guildTokenAddress, guildTokenPrice, stableCoins } = await getCrowdSaleSeedData(crowdSaleState.tokenDelegator)
  crowdSaleState.stableCoins = ['0x0native', ...stableCoins]
  swapState.outputToken.data = getTokenFromList(guildTokenAddress)
  const guildTokenPriceParsed = new BN(guildTokenPrice).div(new BN('100000000')).decimalPlaces(4).toString()
  swapState.outputToken.priceOverride = guildTokenPriceParsed // Indicates that the swap logic will use this price instead of an oracle
}

const getTokenFromList = (address: Address | undefined): TokenDataFE | undefined => {
  if (!address) {
    return undefined
  }
  return tokenListState?.defaultTokenList.find((tokenData) => tokenData.address.toLowerCase() === address.toLowerCase())
}
