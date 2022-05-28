import { Address, ContractAddress } from '@wormgraph/helpers'
import { proxy, subscribe } from 'valtio'
import BN from 'bignumber.js'
import {
  getPriceFeedRaw,
  buyLootboxShares,
  getUserBalanceOfToken,
  getUserBalanceOfNativeToken,
  getLootboxTicketId,
} from 'lib/hooks/useContract'
import { loadLootbox, OnChainLootbox, lootboxState, loadLootboxMetadata } from 'lib/state/lootbox.state'
import { TokenDataFE, NATIVE_ADDRESS, FEE_DECIMALS } from 'lib/hooks/constants'
import { getTokenFromList } from 'lib/hooks/useTokenList'
import { parseWei } from './helpers'
import { userState } from 'lib/state/userState'
import { stampNewTicket } from 'lib/api/stamp'
import { manifest } from 'manifest'

export type BuySharesRoute = '/buyShares' | '/complete'
export interface BuySharesState {
  route: BuySharesRoute
  loading: boolean
  lootbox: {
    data: OnChainLootbox | undefined
    address: Address | undefined
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
    data: undefined,
    address: undefined,
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

export const fillLootboxEstimate = () => {
  if (buySharesState.lootbox.data) {
    const { sharesSoldMax, sharesSoldCount, ticketPurchaseFee, sharePriceWei } = buySharesState.lootbox.data
    const sharesAvailable = new BN(sharesSoldMax).minus(new BN(sharesSoldCount))
    if (sharesAvailable.gt(new BN('0'))) {
      // From the shares available, calculate how much native token is needed to buy them by including the lootbox fee
      const nativeTokenWithoutFee = sharesAvailable.multipliedBy(new BN(sharePriceWei)).dividedBy(new BN(10).pow(18))

      const amountOfNativeTokenNeeded = nativeTokenWithoutFee
        .multipliedBy(new BN(10).pow(FEE_DECIMALS))
        .dividedBy(new BN(10).pow(FEE_DECIMALS).minus(ticketPurchaseFee))
      return amountOfNativeTokenNeeded.toFixed(0, 1) // Round down
    }
  }
  return new BN('0')
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
    // Get ticket id of the ticket to be purchased
    const ticketId = await getLootboxTicketId(buySharesState.lootbox.address)

    const transactionHash = await buyLootboxShares(
      buySharesState.lootbox.address,
      parseWei(buySharesState.inputToken.quantity, buySharesState.inputToken.data.decimals)
    )

    const shares = new BN(buySharesState.lootbox.quantity || '0').toFixed(2)

    // Stamp the ticket + write metadata
    const metadata = await loadLootboxMetadata(buySharesState.lootbox.address as ContractAddress)

    await stampNewTicket({
      backgroundImage: metadata?.lootboxCustomSchema?.lootbox?.backgroundImage || '',
      logoImage: metadata?.lootboxCustomSchema?.lootbox?.image || '',
      themeColor: metadata?.lootboxCustomSchema?.lootbox?.backgroundColor || '',
      name: buySharesState.lootbox.data.name || '',
      ticketID: ticketId,
      lootboxAddress: buySharesState.lootbox.address as ContractAddress,
      chainIdHex: userState.network.currentNetworkIdHex || '',
      numShares: shares,
      metadata: {
        image: '', // the stamp - should get filled in by the backend
        external_url: metadata?.external_url || '',
        description: metadata?.description || '',
        name: metadata?.name || '',
        background_color: metadata?.background_color || '000000',
        animation_url: metadata?.animation_url || '',
        youtube_url: metadata?.youtube_url || '',
        attributes: [
          {
            trait_type: 'Shares',
            value: shares,
            display_type: 'number',
          },
          {
            trait_type: 'Ticket Number',
            value: ticketId,
            display_type: 'number',
          },
        ],
        lootboxCustomSchema: {
          version: metadata?.lootboxCustomSchema.version || manifest.semver.id,
          chain: {
            /** lootbox address */
            address: metadata?.lootboxCustomSchema?.chain?.address || '',
            chainIdHex: metadata?.lootboxCustomSchema?.chain?.chainIdHex || '',
            chainName: metadata?.lootboxCustomSchema?.chain?.chainName || '',
            chainIdDecimal: metadata?.lootboxCustomSchema?.chain?.chainIdDecimal || '',
          },
          lootbox: {
            ticketNumber: Number(ticketId),
            backgroundImage: metadata?.lootboxCustomSchema?.lootbox?.backgroundImage || '',
            image: metadata?.lootboxCustomSchema?.lootbox?.image || '',
            backgroundColor: metadata?.lootboxCustomSchema?.lootbox?.backgroundColor || '',
            badgeImage: metadata?.lootboxCustomSchema?.lootbox?.badgeImage,
            sharesInTicket: shares,
          },
        },
      },
    })

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
    const lootbox = await loadLootbox(lootboxAddress as ContractAddress)
    buySharesState.lootbox.data = lootbox?.onChain
  } catch (err) {
    console.error('Error fetching lootbox data', err)
  } finally {
    buySharesState.loading = false
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
