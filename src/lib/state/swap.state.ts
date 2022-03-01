import { TokenDataFE } from 'lib/hooks/constants'
import { useEthers } from 'lib/hooks/useWeb3Api'
import { proxy, subscribe, useSnapshot } from 'valtio'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeed } from 'lib/hooks/useContract'
import BN from 'bignumber.js'
import { Address } from '@lootboxfund/helpers'
import { useProvider } from '../hooks/useWeb3Api/index'

export type SwapRoute = '/swap' | '/search' | '/add' | '/customs' | '/settings'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface SwapState {
  route: SwapRoute
  targetToken: TokenPickerTarget
  inputToken: {
    data: TokenDataFE | undefined
    quantity: string | undefined
    displayedBalance: string | undefined
  }
  outputToken: {
    data: TokenDataFE | undefined
    quantity: string | undefined
    displayedBalance: string | undefined
  }
}
const swapSnapshot: SwapState = {
  route: '/swap',
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
  },
}
export const swapState = proxy(swapSnapshot)

subscribe(swapState.inputToken, () => {
  updateOutputTokenValues()
})
subscribe(swapState.outputToken, () => {
  updateOutputTokenValues()
})
const updateOutputTokenValues = async () => {
  if (swapState.outputToken.data?.priceOracle && swapState.inputToken.data?.priceOracle) {
    // get price of conversion rate and save to swapState
    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getPriceFeed(swapState.inputToken.data.priceOracle),
      getPriceFeed(swapState.outputToken.data.priceOracle),
    ])
    swapState.inputToken.data.usdPrice = inputTokenPrice.toString()
    swapState.outputToken.data.usdPrice = outputTokenPrice.toString()
  }
  if (swapState.outputToken.data && swapState.inputToken.data && swapState.inputToken.quantity !== undefined) {
    const inputTokenPrice = swapState.inputToken.data.usdPrice || ''
    const outputTokenPrice = swapState.outputToken.data.usdPrice || ''
    swapState.outputToken.quantity = new BN(swapState.inputToken.quantity)
      .multipliedBy(new BN(inputTokenPrice))
      .dividedBy(new BN(outputTokenPrice))
      .toString()
  }
}

export const getUserBalanceOfToken = async (contractAddr: Address, userAddr: Address) => {
  const ethers = await useEthers()
  const ERC20 = new ethers.Contract(contractAddr, ERC20ABI)
  const balance = await ERC20.balanceOf(userAddr).call()
  return balance
}

export const getUserBalanceOfNativeToken = async (userAddr: Address) => {
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const balanceAsString = await provider.getBalance(userAddr)
  return balanceAsString.toNumber()
}

export const clearSwapState = () => {
  swapState.targetToken = null
  swapState.inputToken.data = undefined
  swapState.inputToken.displayedBalance = undefined
  swapState.inputToken.quantity = undefined
  swapState.outputToken.data = undefined
  swapState.outputToken.displayedBalance = undefined
  swapState.outputToken.quantity = undefined
}
