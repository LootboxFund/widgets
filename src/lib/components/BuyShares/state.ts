import { TokenDataFE, NATIVE_ADDRESS } from 'lib/hooks/constants'
import { useEthers } from 'lib/hooks/useWeb3Api'
import { ILootbox } from 'lib/types'
import { proxy, subscribe } from 'valtio'
import ERC20ABI from 'lib/abi/erc20.json'
import { getPriceFeedRaw, getLootboxData, buyLootboxShares } from 'lib/hooks/useContract'
import { getTokenFromList } from 'lib/hooks/useTokenList'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { userState } from 'lib/state/userState'
import { Address } from '@lootboxfund/helpers'
import { useProvider } from '../../hooks/useWeb3Api/index'

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
  if (buySharesState.lootbox?.data?.address) {
    fetchLootboxData(buySharesState.lootbox.data.address).catch((err) => console.error(err))
  }
  loadInputTokenData()
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
  const ethers = useEthers()
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const ERC20 = new ethers.Contract(contractAddr, ERC20ABI, signer)
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
    loadInputTokenData()
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

export const fetchLootboxData = async (lootboxAddress: Address) => {
  buySharesState.inputToken.data = getTokenFromList(NATIVE_ADDRESS)
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
  loadInputTokenData()
}

export const addTicketToWallet = async () => {
  // if (buySharesState.lootbox.data) {
  //   await addERC20ToWallet(buySharesState.lootbox.data)
  // }
}

export const loadInputTokenData = async () => {
  if (!buySharesState.inputToken.data) {
    console.error('Input token not defined!')
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
