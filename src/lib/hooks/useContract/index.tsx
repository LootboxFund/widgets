import { Address, IDividend } from 'lib/types'
import { AbiItem } from 'web3-utils'
import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import { useWeb3 } from '../useWeb3Api'
import ERC20ABI from 'lib/abi/erc20.json'
import LootboxABI from 'lib/abi/lootbox.json'
import CrowdSaleABI from 'lib/abi/crowdSale.json'
import GFXConstantsABI from 'lib/abi/gfxConstants.json'
import { addresses, DEFAULT_CHAIN_ID_HEX } from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'
import BN from 'bignumber.js'
import { TokenData } from '@guildfx/helpers'

const BNB = 'bnb'
const TBNB = 'tbnb'
const USDC = 'usdc'
const ETH = 'eth'
const USDT = 'usdt'

interface CrowdSaleSeedData {
  guildTokenAddress: Address
  guildTokenPrice: string
  stableCoins: Address[]
}

export interface IDividendFragment {
  tokenAddress: Address
  tokenAmount: Address
}

// Opposite of padAddressTo32Bytes
export const stripZeros = (address: string) => {
  const desiredHexLength = 40 // Not including "0x"
  return `0x${address.slice(address.length - desiredHexLength)}`
}

export const getPriceFeed = async (contractAddress: Address) => {
  const data = await getPriceFeedRaw(contractAddress)
  const priceIn8Decimals = new BN(data).div(new BN(`100000000`)).decimalPlaces(4)
  return priceIn8Decimals
}

export const getPriceFeedRaw = async (contractAddress: Address): Promise<string> => {
  const web3 = await useWeb3()
  let contractInstance = new web3.eth.Contract(AggregatorV3Interface.abi as AbiItem[], contractAddress)
  const [currentUser, ..._] = await web3.eth.getAccounts()
  const data = await contractInstance.methods.latestRoundData().call({ from: currentUser })
  return data.answer
}

export const getCrowdSaleSeedData = async (crowdSaleAddress: Address): Promise<CrowdSaleSeedData> => {
  const networkAddresses = addresses[userState.network.currentNetworkIdHex || DEFAULT_CHAIN_ID_HEX]
  if (networkAddresses == undefined) {
    throw new Error('Network not configured!')
  }
  const web3 = await useWeb3()
  const crowdSale = new web3.eth.Contract(CrowdSaleABI, crowdSaleAddress)
  const gfxConstants = new web3.eth.Contract(
    GFXConstantsABI,
    // Can I use this "userState" here like this?
    networkAddresses.gfxConstants
  )
  const [guildTokenAddress, guildTokenPrice, ...stableCoins] = await Promise.all([
    // Load the guildTokenAddress
    crowdSale.methods.GUILD().call(),
    // Loads the current price for the guild token
    crowdSale.methods.currentPriceUSD().call(),
    // Gets stable coins from the gfxConstants
    gfxConstants.methods.ETH_ADDRESS().call(),
    gfxConstants.methods.USDC_ADDRESS().call(),
    gfxConstants.methods.USDT_ADDRESS().call(),
  ])

  return {
    guildTokenAddress,
    guildTokenPrice,
    stableCoins,
  }
}

export const purchaseFromCrowdSale = async (
  crowdSaleAddress: Address,
  stableCoinData: TokenData,
  stableCoinAmount: string
) => {
  const web3 = await useWeb3()
  const [currentUser, ..._] = await web3.eth.getAccounts()
  const crowdSale = new web3.eth.Contract(CrowdSaleABI, crowdSaleAddress, {
    from: currentUser,
    gas: '1000000', // Have to hardocode the gas limit for now...
  })
  const stableCoinSymbol = stableCoinData.symbol.toLowerCase()
  let tx = undefined
  if ([BNB, TBNB].includes(stableCoinSymbol)) {
    tx = crowdSale.methods.buyInBNB().send({ value: stableCoinAmount })
  } else {
    if (stableCoinSymbol === ETH) {
      tx = crowdSale.methods.buyInETH(stableCoinAmount).send()
    } else if (stableCoinSymbol === USDC) {
      tx = crowdSale.methods.buyInUSDC(stableCoinAmount).send()
    } else if (stableCoinSymbol === USDT) {
      tx = crowdSale.methods.buyInUSDT(stableCoinAmount).send()
    } else {
      // throw new Error(`${stableCoinSymbol} not supported!`)
      console.error(`${stableCoinSymbol} not supported!`)
      return
    }
  }
  await tx
  return tx
}

export const getERC20Allowance = async (spender: Address | undefined, tokenAddress: Address): Promise<string> => {
  if (!spender) return '0'
  const web3 = await useWeb3()
  const [currentUser] = await web3.eth.getAccounts()
  const token = new web3.eth.Contract(ERC20ABI, tokenAddress)
  return token.methods.allowance(currentUser, spender).call()
}

export const approveERC20Token = async (delegator: Address | undefined, tokenData: TokenData, quantity: string) => {
  if (!delegator) return
  const web3 = await useWeb3()
  const [currentUser, ..._] = await web3.eth.getAccounts()
  const token = new web3.eth.Contract(ERC20ABI, tokenData.address)
  return token.methods.approve(delegator, quantity).send({ from: currentUser })
}

export const getLootboxData = async (lootboxAddress: Address) => {
  const networkAddresses = addresses[userState.network.currentNetworkIdHex || DEFAULT_CHAIN_ID_HEX]
  if (networkAddresses == undefined) {
    throw new Error('Network not configured!')
  }
  const web3 = await useWeb3()
  const lootbox = new web3.eth.Contract(LootboxABI, lootboxAddress)
  const [name, symbol, sharePriceUSD, sharesSoldCount, sharesSoldMax, ticketIdCounter, shareDecimals] =
    await Promise.all([
      lootbox.methods.name().call(),
      lootbox.methods.symbol().call(),
      lootbox.methods.sharePriceUSD().call(),
      lootbox.methods.sharesSoldCount().call(),
      lootbox.methods.sharesSoldMax().call(),
      lootbox.methods.ticketIdCounter().call(),
      lootbox.methods.shareDecimals().call(),
    ])

  return {
    name,
    symbol,
    sharePriceUSD,
    sharesSoldCount,
    sharesSoldMax,
    ticketIdCounter,
    shareDecimals,
  }
}

export const getLootboxTicketId = async (lootboxAddress: Address): Promise<string> => {
  const web3 = await useWeb3()
  const lootbox = new web3.eth.Contract(LootboxABI, lootboxAddress)
  const ticketId = await lootbox.methods.ticketIdCounter().call()
  return ticketId
}

export const buyLootboxShares = async (lootboxAddress: Address, amountOfStablecoin: string) => {
  const web3 = await useWeb3()
  const [currentUser, ..._] = await web3.eth.getAccounts()
  const lootbox = new web3.eth.Contract(LootboxABI, lootboxAddress, {
    from: currentUser,
    gas: '1000000', // TODO: estimate gas price... Have to hardocode the gas limit for now...
  })
  return await lootbox.methods.purchaseTicket().send({ value: amountOfStablecoin })
}

export const getTicketDividends = async (lootboxAddress: Address, ticketID: string): Promise<IDividendFragment[]> => {
  const res: IDividendFragment[] = []
  const web3 = await useWeb3()
  const lootbox = new web3.eth.Contract(LootboxABI, lootboxAddress)
  try {
    const nativeTokenOwed = await lootbox.methods.viewOwedOfNativeTokenToTicket(ticketID).call()
    res.push({
      tokenAddress: '0x0native',
      tokenAmount: nativeTokenOwed,
    })
  } catch (err) {
    console.error('Error fetching ticket native dividends', err)
  }

  try {
    const stablecoins: Address[] = (await lootbox.methods.viewDepositedTokens().call()).map(stripZeros)
    const stablecoinsOwed = await Promise.allSettled(
      stablecoins.map((addr) => lootbox.methods.viewOwedErc20TokensToTicket(ticketID, addr).call())
    )
    for (let i = 0; i < stablecoins.length; i++) {
      const stablecoin = stablecoins[i]
      const owedAmount = stablecoinsOwed[i]
      if (owedAmount.status === 'fulfilled' && owedAmount.value) {
        res.push({
          tokenAddress: stablecoin,
          tokenAmount: owedAmount.value,
        })
      }
    }
  } catch (err) {
    console.error('Error fetching ticket stablecoin dividends', err)
  }
  return res
}

export const fetchUserTicketsFromLootbox = async (lootboxAddress: Address) => {
  const web3 = await useWeb3()
  const [currentUser, ..._] = await web3.eth.getAccounts()
  if (!currentUser) {
    throw new Error('Please login to metamask!')
  }
  const lootbox = new web3.eth.Contract(LootboxABI, lootboxAddress)
  const userTickets = await lootbox.methods.viewAllTicketsOfHolder(currentUser).call()
  return userTickets
}
