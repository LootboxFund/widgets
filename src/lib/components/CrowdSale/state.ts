import { TokenDataFE, BSC_TESTNET_CROWDSALE_ADDRESS } from 'lib/hooks/constants'
import { addToWallet, useWeb3 } from 'lib/hooks/useWeb3Api'
import { getCrowdSaleSeedData } from 'lib/hooks/useContract'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeed } from 'lib/hooks/useContract'
import { purchaseFromCrowdSale, approveERC20Token, getERC20Allowance } from 'lib/hooks/useContract'
import { tokenListState } from 'lib/hooks/useTokenList'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { userState } from 'lib/state/userState'

// const MAX_INT = new BN(2).pow(256).minus(1)
const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935' // Largest uint256 number

export type CrowdSaleRoute = '/crowdSale' | '/search' | '/complete'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface CrowdSaleState {
  route: CrowdSaleRoute
  targetToken: TokenPickerTarget
  crowdSaleAddress: Address | undefined
  stableCoins: Address[]
  price: string | undefined
  inputToken: {
    data: TokenDataFE | undefined
    quantity: string | undefined
    balance: string | undefined
    allowance: string | undefined
  }
  outputToken: {
    data: TokenDataFE | undefined
    quantity: string | undefined
    balance: string | undefined
    allowance: string | undefined
  }
  ui: {
    isButtonLoading: boolean
  }
  lastTransaction: {
    success: boolean
    hash: string | undefined
  }
}
const crowdSaleSnapshot: CrowdSaleState = {
  route: '/crowdSale',
  targetToken: null,
  crowdSaleAddress: BSC_TESTNET_CROWDSALE_ADDRESS,
  stableCoins: [],
  price: undefined,
  inputToken: {
    data: undefined,
    quantity: undefined,
    balance: undefined,
    allowance: undefined,
  },
  outputToken: {
    data: undefined,
    quantity: undefined,
    balance: undefined,
    allowance: undefined,
  },
  ui: {
    isButtonLoading: false,
  },
  lastTransaction: {
    success: false,
    hash: undefined,
  },
}
export const crowdSaleState = proxy(crowdSaleSnapshot)

subscribe(crowdSaleState.inputToken, () => {
  try {
    updateOutputTokenValues()
  } catch (err) {
    console.error(err)
  }
})

subscribeKey(userState, 'currentNetworkIdHex', () => {
  fetchCrowdSaleData().catch((err) => console.error(err))
})

subscribeKey(userState, 'currentAccount', () => {
  fetchCrowdSaleData().catch((err) => console.error(err))
  if (crowdSaleState.inputToken.data) {
    loadTokenData(crowdSaleState.inputToken.data, 'inputToken').catch((err) => console.error(err))
  }
})

const updateOutputTokenValues = () => {
  if (crowdSaleState.inputToken.quantity == undefined) {
    crowdSaleState.outputToken.quantity = '0'
  } else if (
    crowdSaleState.outputToken.data &&
    crowdSaleState.inputToken.data &&
    crowdSaleState.inputToken.quantity !== undefined &&
    crowdSaleState.inputToken.data.usdPrice &&
    crowdSaleState.outputToken.data.usdPrice
  ) {
    const inputTokenPrice = crowdSaleState.inputToken.data.usdPrice
    const outputTokenPrice = crowdSaleState.outputToken.data.usdPrice
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

  crowdSaleState.ui.isButtonLoading = true
  try {
    const tx = await purchaseFromCrowdSale(
      crowdSaleState.crowdSaleAddress,
      crowdSaleState.inputToken.data,
      parseWei(crowdSaleState.inputToken.quantity, crowdSaleState.inputToken.data.decimals)
    )
    crowdSaleState.lastTransaction.success = true
    crowdSaleState.lastTransaction.hash = tx?.transactionHash
  } catch (err) {
    crowdSaleState.lastTransaction.success = false
    crowdSaleState.lastTransaction.hash = err?.receipt?.transactionHash
    if (err?.code === 4001) {
      // Metamask, user denied signature
      return
    }
  } finally {
    crowdSaleState.ui.isButtonLoading = false
  }

  crowdSaleState.route = '/complete'

  return
}

export const approveStableCoinToken = async () => {
  if (!crowdSaleState.inputToken.data || !crowdSaleState.crowdSaleAddress) {
    return
  }
  if (crowdSaleState.inputToken.data.address === '0x0native') {
    // Native tokens don't need approval
    crowdSaleState.inputToken.allowance = MAX_INT
    return
  }

  let tx = undefined
  crowdSaleState.ui.isButtonLoading = true
  try {
    tx = await approveERC20Token(
      crowdSaleState.crowdSaleAddress,
      crowdSaleState.inputToken.data,
      // parseWei(crowdSaleState.inputToken.quantity, crowdSaleState.inputToken.data.decimals)
      MAX_INT
    )

    crowdSaleState.inputToken.allowance = await getERC20Allowance(
      crowdSaleState.crowdSaleAddress,
      crowdSaleState.inputToken.data.address
    )
  } catch (err) {
    console.error(err)
  } finally {
    crowdSaleState.ui.isButtonLoading = false
  }

  return tx
}

export const fetchCrowdSaleData = async () => {
  if (!crowdSaleState.crowdSaleAddress) {
    return
  }
  const { guildTokenAddress, guildTokenPrice, stableCoins } = await getCrowdSaleSeedData(
    crowdSaleState.crowdSaleAddress
  )
  crowdSaleState.stableCoins = ['0x0native', ...stableCoins]
  const guildToken = getTokenFromList(guildTokenAddress)
  if (guildToken) {
    await loadTokenData(guildToken, 'outputToken')
  }
  const guildTokenPriceParsed = new BN(guildTokenPrice).div(new BN('100000000')).toString()
  crowdSaleState.price = guildTokenPriceParsed // Indicates that the swap logic will use this price instead of an oracle
}

const getTokenFromList = (address: Address | undefined): TokenDataFE | undefined => {
  if (!address) {
    return undefined
  }
  return tokenListState?.defaultTokenList.find((tokenData) => tokenData.address.toLowerCase() === address.toLowerCase())
}

export const addOutputTokenToWallet = async () => {
  if (crowdSaleState.outputToken.data) {
    await addToWallet(crowdSaleState.outputToken.data)
  }
}

export const loadTokenData = async (token: TokenDataFE, targetToken: TokenPickerTarget) => {
  if (userState.currentAccount) {
    const promise =
      token.address === '0x0native'
        ? Promise.all([getUserBalanceOfNativeToken(userState.currentAccount), Promise.resolve('0')])
        : Promise.all([
            getUserBalanceOfToken(token.address, userState.currentAccount),
            getERC20Allowance(crowdSaleState.crowdSaleAddress, token.address),
          ])
    promise.then(async ([tokenBalance, tokenAllowance]) => {
      if (targetToken) {
        crowdSaleState[targetToken].balance = tokenBalance
        crowdSaleState[targetToken].allowance = tokenAllowance
      }
    })
    if (targetToken) {
      crowdSaleState[targetToken].data = token
      loadPriceFeed(targetToken).catch((err) => console.error(err))
    }
  }
}

const loadPriceFeed = async (targetToken: TokenPickerTarget) => {
  if (targetToken === 'outputToken' && crowdSaleState.price && crowdSaleState?.outputToken?.data) {
    // Price for output token (i.e. guild token)
    crowdSaleState.outputToken.data.usdPrice = crowdSaleState.price.toString()
  } else if (targetToken === 'inputToken' && crowdSaleState.inputToken.data?.priceOracle) {
    // get price of conversion for the stable coin and save to crowdSaleState
    const inputTokenPrice = await getPriceFeed(crowdSaleState.inputToken.data.priceOracle)

    crowdSaleState.inputToken.data.usdPrice = inputTokenPrice.toString()
  }
}
