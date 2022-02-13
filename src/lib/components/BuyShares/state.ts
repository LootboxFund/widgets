import { TokenDataFE } from 'lib/hooks/constants'
import { addERC20ToWallet, useWeb3 } from 'lib/hooks/useWeb3Api'
import { Address, ILootbox } from 'lib/types'
import { proxy, subscribe } from 'valtio'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeedRaw, getLootboxData, buyLootboxShares } from 'lib/hooks/useContract'
import { tokenListState } from 'lib/hooks/useTokenList'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { userState } from 'lib/state/userState'
import parseUrlParams from 'lib/utils/parseUrlParams'

// const MAX_INT = new BN(2).pow(256).minus(1)
const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935' // Largest uint256 number

export type BuySharesRoute = '/buyShares' | '/complete'
export interface BuySharesState {
  route: BuySharesRoute
  lootbox: {
    data: ILootbox | undefined
    quantity: string | undefined
  }
  inputToken: {
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
    errorMessage: string | undefined
  }
}
const buySharesSnapshot: BuySharesState = {
  route: '/buyShares',
  lootbox: {
    data: {
      address: undefined,
      name: undefined,
      symbol: undefined,
      sharePriceUSD: undefined,
      sharesSoldCount: undefined,
      sharesSoldMax: undefined,
      ticketIdCounter: undefined,
      shareDecimals: undefined,
    },
    quantity: undefined,
  },
  inputToken: {
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
    errorMessage: undefined,
  },
}
export const buySharesState = proxy(buySharesSnapshot)

subscribe(buySharesState.inputToken, () => {
  try {
    updateLootboxQuantity()
  } catch (err) {
    console.error(err)
  }
})

subscribe(userState, () => {
  fetchLootboxData().catch((err) => console.error(err))
  if (buySharesState.inputToken.data) {
    loadTokenData(buySharesState.inputToken.data).catch((err) => console.error(err))
  }
})

const updateLootboxQuantity = () => {
  if (buySharesState.inputToken.quantity == undefined) {
    buySharesState.lootbox.quantity = '0'
  } else if (
    buySharesState.lootbox.data &&
    buySharesState.inputToken.data &&
    buySharesState.inputToken.quantity !== undefined &&
    buySharesState.inputToken.data.usdPrice &&
    buySharesState.lootbox.data.sharePriceUSD
  ) {
    const inputTokenPrice = buySharesState.inputToken.data.usdPrice
    const outputTokenPrice = buySharesState.lootbox.data.sharePriceUSD
    buySharesState.lootbox.quantity = new BN(buySharesState.inputToken.quantity)
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
    !buySharesState.lootbox.data ||
    !buySharesState.inputToken.data ||
    !buySharesState.inputToken.quantity ||
    !buySharesState.lootbox?.data?.address
  ) {
    return
  }

  buySharesState.ui.isButtonLoading = true
  try {
    const tx = await buyLootboxShares(
      buySharesState.lootbox.data.address,
      parseWei(buySharesState.inputToken.quantity, buySharesState.inputToken.data.decimals)
    )
    buySharesState.lastTransaction.success = true
    buySharesState.lastTransaction.hash = tx?.transactionHash
    loadTokenData(buySharesState.inputToken.data).catch((err) => console.error(err))
  } catch (err) {
    console.error(err)
    buySharesState.lastTransaction.success = false
    buySharesState.lastTransaction.hash = err?.receipt?.transactionHash
    if (err?.code === 4001) {
      // Metamask, user denied signature
      return
    }
  } finally {
    buySharesState.ui.isButtonLoading = false
  }

  buySharesState.route = '/complete'

  return
}

export const fetchLootboxData = async () => {
  buySharesState.inputToken.data = getTokenFromList('0x0native')
  const [lootboxAddress] = parseUrlParams(['fundraisers'])
  if (!lootboxAddress) {
    return
  }
  const { name, symbol, sharePriceUSD, sharesSoldCount, sharesSoldMax, ticketIdCounter, shareDecimals } =
    await getLootboxData(lootboxAddress)

  buySharesState.lootbox.data = {
    address: lootboxAddress,
    name: name,
    symbol: symbol,
    sharePriceUSD: sharePriceUSD,
    sharesSoldCount: sharesSoldCount,
    sharesSoldMax: sharesSoldMax,
    ticketIdCounter: ticketIdCounter,
    shareDecimals: shareDecimals,
  }
}

export const addTicketToWallet = async () => {
  // if (buySharesState.lootbox.data) {
  //   await addERC20ToWallet(buySharesState.lootbox.data)
  // }
}

export const loadTokenData = async (token: TokenDataFE) => {
  if (userState.currentAccount) {
    const promise =
      token.address === '0x0native'
        ? getUserBalanceOfNativeToken(userState.currentAccount)
        : getUserBalanceOfToken(token.address, userState.currentAccount)

    promise.then(async (tokenBalance) => {
      buySharesState.inputToken.balance = tokenBalance
    })

    buySharesState.inputToken.data = token
    loadPriceFeed().catch((err) => console.error(err))
  }
}

const loadPriceFeed = async () => {
  if (buySharesState.inputToken.data?.priceOracle) {
    // get price of conversion for the stable coin and save to buySharesState
    const inputTokenPrice = await getPriceFeedRaw(buySharesState.inputToken.data.priceOracle)
    buySharesState.inputToken.data.usdPrice = inputTokenPrice
  }
}

const getTokenFromList = (address: Address | undefined): TokenDataFE | undefined => {
  if (!address) {
    return undefined
  }
  return tokenListState?.defaultTokenList.find((tokenData) => tokenData.address.toLowerCase() === address.toLowerCase())
}
