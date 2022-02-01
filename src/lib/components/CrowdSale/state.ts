import { TokenDataFE, BSC_TESTNET_CROWDSALE_ADDRESS } from 'lib/hooks/constants'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import { getCrowdSaleSeedData } from 'lib/hooks/useContract'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { userState } from 'lib/state/userState'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe, useSnapshot } from 'valtio'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeed } from 'lib/hooks/useContract'
import { purchaseFromCrowdSale, approveERC20Token } from 'lib/hooks/useContract'
import { tokenListState } from 'lib/hooks/useTokenList'
import BN from 'bignumber.js'

export type CrowdSaleRoute = '/crowdSale' | '/search'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface CrowdSaleState {
  route: CrowdSaleRoute
  targetToken: TokenPickerTarget
  crowdSaleAddress: Address | undefined
  stableCoins: Address[]
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
const crowdSaleSnapshot: CrowdSaleState = {
  route: '/crowdSale',
  targetToken: null,
  crowdSaleAddress: BSC_TESTNET_CROWDSALE_ADDRESS,
  stableCoins: [],
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
export const crowdSaleState = proxy(crowdSaleSnapshot)

subscribe(crowdSaleState.inputToken, () => {
  updateOutputTokenValues()
})

subscribe(crowdSaleState.outputToken, () => {
  updateOutputTokenValues()
})

const updateOutputTokenValues = async () => {
  if (
    crowdSaleState.outputToken.data &&
    (crowdSaleState.outputToken.data?.priceOracle || crowdSaleState.outputToken.priceOverride) &&
    crowdSaleState.inputToken.data?.priceOracle
  ) {
    // get price of conversion rate and save to crowdSaleState
    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
      getPriceFeed(crowdSaleState.inputToken.data.priceOracle),
      crowdSaleState.outputToken.priceOverride
        ? Promise.resolve(new BN(crowdSaleState.outputToken.priceOverride))
        : getPriceFeed(crowdSaleState.outputToken.data.priceOracle),
    ])
    crowdSaleState.inputToken.data.usdPrice = inputTokenPrice.toString()
    crowdSaleState.outputToken.data.usdPrice = outputTokenPrice.toString()
  }

  if (
    crowdSaleState.outputToken.data &&
    crowdSaleState.inputToken.data &&
    crowdSaleState.inputToken.quantity !== undefined
  ) {
    const inputTokenPrice = crowdSaleState.inputToken.data.usdPrice || ''
    const outputTokenPrice = crowdSaleState.outputToken.data.usdPrice || ''
    crowdSaleState.outputToken.quantity = new BN(crowdSaleState.inputToken.quantity)
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
  if (!crowdSaleState.inputToken.data || !crowdSaleState.inputToken.quantity || !crowdSaleState.crowdSaleAddress) {
    return
  }
  const tx = await purchaseFromCrowdSale(
    crowdSaleState.crowdSaleAddress,
    crowdSaleState.inputToken.data,
    crowdSaleState.inputToken.quantity
  )
}

export const approveGuildToken = async () => {
  if (!crowdSaleState.inputToken.data || !crowdSaleState.inputToken.quantity || !crowdSaleState.crowdSaleAddress) {
    return
  }
  const tx = await approveERC20Token(
    crowdSaleState.crowdSaleAddress,
    crowdSaleState.inputToken.data,
    crowdSaleState.inputToken.quantity
  )
}

export const fetchCrowdSaleData = async () => {
  if (!crowdSaleState.crowdSaleAddress) {
    return
  }
  const { guildTokenAddress, guildTokenPrice, stableCoins } = await getCrowdSaleSeedData(
    crowdSaleState.crowdSaleAddress
  )
  crowdSaleState.stableCoins = ['0x0native', ...stableCoins]
  crowdSaleState.outputToken.data = getTokenFromList(guildTokenAddress)
  const guildTokenPriceParsed = new BN(guildTokenPrice).div(new BN('100000000')).toString()
  crowdSaleState.outputToken.priceOverride = guildTokenPriceParsed // Indicates that the swap logic will use this price instead of an oracle
}

const getTokenFromList = (address: Address | undefined): TokenDataFE | undefined => {
  if (!address) {
    return undefined
  }
  return tokenListState?.defaultTokenList.find((tokenData) => tokenData.address.toLowerCase() === address.toLowerCase())
}
