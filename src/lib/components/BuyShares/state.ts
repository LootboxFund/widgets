import { Address } from '@wormgraph/helpers'
import { proxy, subscribe } from 'valtio'
import BN from 'bignumber.js'
import {
  getPriceFeedRaw,
  getLootboxData,
  buyLootboxShares,
  getUserBalanceOfToken,
  getUserBalanceOfNativeToken,
} from 'lib/hooks/useContract'
import { ILootbox } from 'lib/types'
import { TokenDataFE, NATIVE_ADDRESS, FEE_DECIMALS } from 'lib/hooks/constants'
import { getTokenFromList } from 'lib/hooks/useTokenList'
import { parseWei } from './helpers'
import { userState } from 'lib/state/userState'
import { addERC721ToWallet } from 'lib/hooks/useWeb3Api'

export type BuySharesRoute = '/buyShares' | '/complete'
export interface BuySharesState {
  route: BuySharesRoute
  loading: boolean
  lootbox: {
    address: Address | undefined
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
    failureMessage: string | undefined
  }
}
const buySharesSnapshot: BuySharesState = {
  route: '/buyShares',
  loading: true,
  lootbox: {
    address: undefined,
    data: {
      address: undefined,
      name: undefined,
      symbol: undefined,
      sharePriceWei: undefined,
      sharesSoldCount: undefined,
      sharesSoldMax: undefined,
      ticketIdCounter: undefined,
      shareDecimals: undefined,
      variant: undefined,
      ticketPurchaseFee: undefined,
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
    failureMessage: undefined,
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
  loadInputTokenData()
})

const updateLootboxQuantity = () => {
  if (buySharesState.inputToken.quantity == undefined) {
    buySharesState.lootbox.quantity = '0'
  } else if (
    buySharesState.lootbox.data &&
    buySharesState.inputToken.quantity !== undefined &&
    buySharesState.lootbox.data.ticketPurchaseFee !== undefined &&
    buySharesState.lootbox.data.sharePriceWei
  ) {
    const inputTokenQuantity = new BN(buySharesState.inputToken.quantity).multipliedBy(new BN(10).pow(18))

    const deductableFee = inputTokenQuantity.multipliedBy(
      new BN(buySharesState.lootbox.data.ticketPurchaseFee).dividedBy(new BN(10).pow(FEE_DECIMALS))
    )

    buySharesState.lootbox.quantity = inputTokenQuantity
      .minus(deductableFee)
      .div(new BN(buySharesState.lootbox.data.sharePriceWei))
      .toString()
  }
}

export const purchaseLootboxShare = async () => {
  if (
    !buySharesState.lootbox.data ||
    !buySharesState.inputToken.data ||
    !buySharesState.inputToken.quantity ||
    !buySharesState.lootbox?.address
  ) {
    return
  }

  buySharesState.ui.isButtonLoading = true
  try {
    const transactionHash = await buyLootboxShares(
      buySharesState.lootbox.address,
      parseWei(buySharesState.inputToken.quantity, buySharesState.inputToken.data.decimals)
    )
    buySharesState.lastTransaction.success = true
    buySharesState.lastTransaction.hash = transactionHash
    buySharesState.lastTransaction.failureMessage = undefined
    loadInputTokenData()
  } catch (err) {
    console.error(err)
    buySharesState.lastTransaction.success = false
    buySharesState.lastTransaction.hash = err?.receipt?.transactionHash
    buySharesState.lastTransaction.failureMessage = err?.data?.message
    if (err?.code === 4001) {
      // Metamask, user denied signature
      return
    }
  } finally {
    buySharesState.ui.isButtonLoading = false
  }

  buySharesState.route = '/complete'

  initBuySharesState(buySharesState.lootbox.address).catch((err) => console.error(err))

  return
}

export const initBuySharesState = async (lootboxAddress: Address | undefined) => {
  buySharesState.loading = true

  buySharesState.inputToken.data = getTokenFromList(NATIVE_ADDRESS)
  loadInputTokenData()

  if (!lootboxAddress) {
    return
  }

  buySharesState.lootbox.address = lootboxAddress

  try {
    const {
      name,
      symbol,
      sharePriceWei,
      sharesSoldCount,
      sharesSoldMax,
      ticketIdCounter,
      shareDecimals,
      variant,
      ticketPurchaseFee,
    } = await getLootboxData(lootboxAddress)
    buySharesState.lootbox.data = {
      address: lootboxAddress,
      name: name,
      symbol: symbol,
      sharePriceWei: sharePriceWei,
      sharesSoldCount: sharesSoldCount,
      sharesSoldMax: sharesSoldMax,
      ticketIdCounter: ticketIdCounter,
      shareDecimals: shareDecimals,
      variant: variant,
      ticketPurchaseFee,
    }
  } catch (err) {
    console.error('Error fetching lootbox data', err)
    buySharesState.lootbox.data = {
      address: undefined,
      name: undefined,
      symbol: undefined,
      sharePriceWei: undefined,
      sharesSoldCount: undefined,
      sharesSoldMax: undefined,
      ticketIdCounter: undefined,
      shareDecimals: undefined,
      variant: undefined,
      ticketPurchaseFee: undefined,
    }
  } finally {
    buySharesState.loading = false
  }
}

export const addTicketToWallet = async () => {
  if (buySharesState.lootbox.data) {
    await addERC721ToWallet({
      address: buySharesState.lootbox.data.address as Address,
      decimals: 1,
      symbol: buySharesState.lootbox.data.symbol || 'Lootbox',
      image: 'https://www.dictionary.com/e/wp-content/uploads/2018/06/pics-300x300.jpg',
    })
  }
}

export const loadInputTokenData = async () => {
  if (!buySharesState.inputToken.data) {
    return
  }
  if (userState.currentAccount) {
    const promise =
      buySharesState.inputToken.data.address === NATIVE_ADDRESS
        ? getUserBalanceOfNativeToken(userState.currentAccount)
        : getUserBalanceOfToken(buySharesState.inputToken.data.address, userState.currentAccount)

    promise.then(async (tokenBalance) => {
      buySharesState.inputToken.balance = tokenBalance
    })
  } else {
    buySharesState.inputToken.balance = '0'
  }
  loadPriceFeed().catch((err) => console.error(err))
}

const loadPriceFeed = async () => {
  if (buySharesState.inputToken.data?.priceOracle) {
    // get price of conversion for the stable coin and save to buySharesState
    const inputTokenPrice = await getPriceFeedRaw(buySharesState.inputToken.data.priceOracle)
    buySharesState.inputToken.data.usdPrice = inputTokenPrice
  }
}
