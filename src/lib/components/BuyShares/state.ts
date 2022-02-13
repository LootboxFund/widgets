import { TokenDataFE } from 'lib/hooks/constants'
import { addToWallet, useWeb3 } from 'lib/hooks/useWeb3Api'
// import { getLootboxData } from 'lib/hooks/useContract'
import { Address } from 'lib/types/baseTypes'
import { proxy, subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeed } from 'lib/hooks/useContract'
// import { buySharesShares, approveERC20Token, getERC20Allowance } from 'lib/hooks/useContract'
import { tokenListState } from 'lib/hooks/useTokenList'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { userState } from 'lib/state/userState'

// const MAX_INT = new BN(2).pow(256).minus(1)
const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935' // Largest uint256 number

export type BuySharesRoute = '/buyShares' | '/complete'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface BuySharesState {
  route: BuySharesRoute
  targetToken: TokenPickerTarget
  lootbox: {
    address: Address | undefined
    pricePerShare: string | undefined
  }
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
const buySharesSnapshot: BuySharesState = {
  route: '/buyShares',
  targetToken: null,
  lootbox: {
    address: undefined,
    pricePerShare: undefined,
  },
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
export const buySharesState = proxy(buySharesSnapshot)

subscribe(buySharesState.inputToken, () => {
  try {
    updateOutputTokenValues()
  } catch (err) {
    console.error(err)
  }
})

subscribe(userState, () => {
  fetchLootboxData().catch((err) => console.error(err))
  if (buySharesState.inputToken.data) {
    loadTokenData(buySharesState.inputToken.data, 'inputToken').catch((err) => console.error(err))
  }
})

const updateOutputTokenValues = () => {
  if (buySharesState.inputToken.quantity == undefined) {
    buySharesState.outputToken.quantity = '0'
  } else if (
    buySharesState.outputToken.data &&
    buySharesState.inputToken.data &&
    buySharesState.inputToken.quantity !== undefined &&
    buySharesState.inputToken.data.usdPrice &&
    buySharesState.outputToken.data.usdPrice
  ) {
    const inputTokenPrice = buySharesState.inputToken.data.usdPrice
    const outputTokenPrice = buySharesState.outputToken.data.usdPrice
    buySharesState.outputToken.quantity = new BN(buySharesState.inputToken.quantity)
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

export const purchaseLootboxShare = async () => {
  if (
    !buySharesState.outputToken.data ||
    !buySharesState.inputToken.data ||
    !buySharesState.inputToken.quantity ||
    !buySharesState.lootbox.address
  ) {
    return
  }

  // buySharesState.ui.isButtonLoading = true
  // try {
  //   const tx = await buySharesShares(
  //     buySharesState.lootbox.address,
  //     buySharesState.inputToken.data,
  //     parseWei(buySharesState.inputToken.quantity, buySharesState.inputToken.data.decimals)
  //   )
  //   buySharesState.lastTransaction.success = true
  //   buySharesState.lastTransaction.hash = tx?.transactionHash
  //   Promise.all([
  //     loadTokenData(buySharesState.inputToken.data, 'inputToken'),
  //     loadTokenData(buySharesState.outputToken.data, 'outputToken'),
  //   ]).catch((err) => console.error(err))
  // } catch (err) {
  //   buySharesState.lastTransaction.success = false
  //   buySharesState.lastTransaction.hash = err?.receipt?.transactionHash
  //   if (err?.code === 4001) {
  //     // Metamask, user denied signature
  //     return
  //   }
  // } finally {
  //   buySharesState.ui.isButtonLoading = false
  // }

  // buySharesState.route = '/complete'

  // return
}

export const fetchLootboxData = async () => {
  if (!buySharesState.lootbox.address) {
    return
  }
  // const { guildTokenAddress, guildTokenPrice, stableCoins } = await getLootboxData(buySharesState.lootbox.address)
  // buySharesState.stableCoins = ['0x0native', ...stableCoins]
  // const guildToken = getTokenFromList(guildTokenAddress)
  // if (guildToken) {
  //   await loadTokenData(guildToken, 'outputToken')
  // }
  // const guildTokenPriceParsed = new BN(guildTokenPrice).div(new BN('100000000')).toString()
  // buySharesState.lootbox.pricePerShare = guildTokenPriceParsed // Indicates that the swap logic will use this price instead of an oracle
}

export const addOutputTokenToWallet = async () => {
  if (buySharesState.outputToken.data) {
    await addToWallet(buySharesState.outputToken.data)
  }
}

export const loadTokenData = async (token: TokenDataFE, targetToken: TokenPickerTarget) => {
  // if (userState.currentAccount) {
  //   const promise =
  //     token.address === '0x0native'
  //       ? Promise.all([getUserBalanceOfNativeToken(userState.currentAccount), Promise.resolve('0')])
  //       : Promise.all([
  //           getUserBalanceOfToken(token.address, userState.currentAccount),
  //           getERC20Allowance(buySharesState.buySharesAddress, token.address),
  //         ])
  //   promise.then(async ([tokenBalance, tokenAllowance]) => {
  //     if (targetToken) {
  //       buySharesState[targetToken].balance = tokenBalance
  //       buySharesState[targetToken].allowance = tokenAllowance
  //     }
  //   })
  //   if (targetToken) {
  //     buySharesState[targetToken].data = token
  //     loadPriceFeed(targetToken).catch((err) => console.error(err))
  //   }
  // }
}

const loadPriceFeed = async (targetToken: TokenPickerTarget) => {
  if (targetToken === 'outputToken' && buySharesState.lootbox.pricePerShare && buySharesState?.outputToken?.data) {
    // Price for output token (i.e. guild token)
    buySharesState.outputToken.data.usdPrice = buySharesState.lootbox.pricePerShare.toString()
  } else if (targetToken === 'inputToken' && buySharesState.inputToken.data?.priceOracle) {
    // get price of conversion for the stable coin and save to buySharesState
    const inputTokenPrice = await getPriceFeed(buySharesState.inputToken.data.priceOracle)

    buySharesState.inputToken.data.usdPrice = inputTokenPrice.toString()
  }
}
