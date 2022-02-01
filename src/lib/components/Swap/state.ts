import { TokenDataFE } from 'lib/hooks/constants'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { userState } from 'lib/state/userState'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe, useSnapshot } from 'valtio'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeed } from 'lib/hooks/useContract'
import { purchaseFromCrowdSale, approveERC20Token } from 'lib/hooks/useContract'
import BN from 'bignumber.js'

export type SwapRoute = '/swap' | '/search' | '/add' | '/customs' | '/settings'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface SwapState {
  route: SwapRoute
  targetToken: TokenPickerTarget
  tokenDelegator: Address | undefined
  inputToken: {
    data: TokenDataFE | undefined
    quantity: string | undefined
    displayedBalance: string | undefined
    allowance: string | undefined
  }
  outputToken: {
    data: TokenDataFE | undefined
    quantity: string | undefined
    displayedBalance: string | undefined
    allowance: string | undefined
    priceOverride: string | undefined // Override to store a price - fetching via price oracle not needed when this exists
  }
}
const swapSnapshot: SwapState = {
  route: '/swap',
  targetToken: null,
  tokenDelegator: undefined,
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
    priceOverride: undefined,
    allowance: undefined,
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
  if (
    swapState.outputToken.data &&
    (swapState.outputToken.data?.priceOracle || swapState.outputToken.priceOverride) &&
    swapState.inputToken.data?.priceOracle
  ) {
    // get price of conversion rate and save to swapState
    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getPriceFeed(swapState.inputToken.data.priceOracle),
      swapState.outputToken.priceOverride
        ? Promise.resolve(new BN(swapState.outputToken.priceOverride))
        : getPriceFeed(swapState.outputToken.data.priceOracle),
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
  const web3 = await useWeb3()
  const ERC20 = new web3.eth.Contract(ERC20ABI, contractAddr)
  const balance = await ERC20.methods.balanceOf(userAddr).call()
  return balance
}

export const getUserBalanceOfNativeToken = async (userAddr: Address) => {
  const web3 = useWeb3()
  const balanceAsString = await (await web3).eth.getBalance(userAddr)
  return parseFloat(balanceAsString)
}

export const purchaseGuildToken = async () => {
  if (!swapState.inputToken.data || !swapState.inputToken.quantity || !swapState.tokenDelegator) {
    return
  }
  const tx = await purchaseFromCrowdSale(
    swapState.tokenDelegator,
    swapState.inputToken.data,
    swapState.inputToken.quantity
  )
}

export const approveGuildToken = async () => {
  if (!swapState.inputToken.data || !swapState.inputToken.quantity || !swapState.tokenDelegator) {
    return
  }
  const tx = await approveERC20Token(swapState.tokenDelegator, swapState.inputToken.data, swapState.inputToken.quantity)
}
