import { TokenDataFE } from 'lib/hooks/constants'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe } from 'valtio'
import { swapState, SwapState } from 'lib/components/Swap/state'
import { getCrowdSaleSeedData } from 'lib/hooks/useContract'
import { tokenListState } from 'lib/hooks/useTokenList'
import { purchaseFromCrowdSale } from 'lib/hooks/useContract'
import BN from 'bignumber.js'

export type CrowdSaleRoute = '/crowdSale' | '/search'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface CrowdSaleState extends Omit<SwapState, 'route'> {
  route: CrowdSaleRoute
  stableCoins: Address[]
  crowdSaleAddress: Address
}
const crowdSaleSnapshot: CrowdSaleState = {
  route: '/crowdSale',
  targetToken: null,
  inputToken: {
    data: undefined,
    quantity: undefined,
    displayedBalance: undefined,
  },
  outputToken: {
    data: undefined,
    quantity: undefined,
    displayedBalance: undefined,
    priceOverride: undefined,
  },
  stableCoins: [],
  // TODO: dynamically load this
  crowdSaleAddress: '0x803c267a3bf44099b75ad4d244a1eddd98df13ba',
}

export const crowdSaleState = proxy(crowdSaleSnapshot)

// Keep this state in sync with Swap's state
subscribe(swapState.inputToken, () => {
  crowdSaleState.inputToken = swapState.inputToken
})
subscribe(swapState.outputToken, () => {
  crowdSaleState.outputToken = swapState.outputToken
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
  const { guildTokenAddress, guildTokenPrice, stableCoins } = await getCrowdSaleSeedData(
    crowdSaleState.crowdSaleAddress
  )
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

export const purchaseGuildToken = async () => {
  if (!crowdSaleState.inputToken.data || !crowdSaleState.inputToken.quantity) {
    return
  }
  const tx = await purchaseFromCrowdSale(
    crowdSaleState.crowdSaleAddress,
    crowdSaleState.inputToken.data,
    crowdSaleState.inputToken.quantity
  )
}
