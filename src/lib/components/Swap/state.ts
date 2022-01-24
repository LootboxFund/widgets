import { TokenData } from 'lib/hooks/constants'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { userState } from 'lib/state/userState'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe, useSnapshot } from 'valtio'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeed } from 'lib/hooks/useContract'

export type SwapRoute = '/swap' | '/search' | '/add' | '/customs' | '/settings'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface SwapState {
  route: SwapRoute
  targetToken: TokenPickerTarget
  inputToken: {
    data: TokenData | undefined
    quantity: number | undefined
    displayedBalance: string | undefined
  }
  outputToken: {
    data: TokenData | undefined
    quantity: number | undefined
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
export const stateOfSwap = proxy(swapSnapshot)

subscribe(stateOfSwap.inputToken, () => {
  updateOutputTokenValues()
})
subscribe(stateOfSwap.outputToken, () => {
  updateOutputTokenValues()
})
const updateOutputTokenValues = async () => {
  console.log('updateOutputTokenValues')
  if (stateOfSwap.outputToken.data?.priceOracle && stateOfSwap.inputToken.data?.priceOracle) {
    // get price of conversion rate and save to swapState
    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getPriceFeed(stateOfSwap.inputToken.data.priceOracle),
      getPriceFeed(stateOfSwap.outputToken.data.priceOracle),
    ])
    console.log(`
    
      inputToken = ${inputTokenPrice}
      outputToken = ${outputTokenPrice}

    `)
    stateOfSwap.inputToken.data.usdPrice = inputTokenPrice.toString()
    stateOfSwap.outputToken.data.usdPrice = outputTokenPrice.toString()
  }
  if (stateOfSwap.outputToken.data && stateOfSwap.inputToken.data && stateOfSwap.inputToken.quantity !== undefined) {
    const inputTokenPrice = stateOfSwap.inputToken.data.usdPrice || 1
    const outputTokenPrice = stateOfSwap.outputToken.data.usdPrice || 1
    stateOfSwap.outputToken.quantity = (stateOfSwap.inputToken.quantity * inputTokenPrice) / outputTokenPrice
  }
}

export const getUserBalanceOfToken = async (contractAddr: Address, userAddr: Address) => {
  const web3 = await useWeb3()
  const ERC20 = new web3.eth.Contract(ERC20ABI, contractAddr)
  const balance = ERC20.methods.balanceOf(userAddr).call()
  console.log(`
  
  --------- Balance = ${balance}
  
  
  `)
  return balance
}

export const getUserBalanceOfNativeToken = async (userAddr: Address) => {
  const web3 = useWeb3()
  const balanceAsString = await (await web3).eth.getBalance(userAddr)
  return parseFloat(balanceAsString)
}
