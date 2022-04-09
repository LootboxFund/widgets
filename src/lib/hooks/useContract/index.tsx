import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import ERC20ABI from 'lib/abi/erc20.json'
import LootboxEscrowABI from 'lib/abi/LootboxEscrow.json'
import { NATIVE_ADDRESS } from 'lib/hooks/constants'
import BN from 'bignumber.js'
import { TokenData, Address } from '@wormgraph/helpers'
import { ethers as ethersObj } from 'ethers'
import { getProvider } from '../useWeb3Api'

const BNB = 'bnb'
const TBNB = 'tbnb'
const USDC = 'usdc'
const ETH = 'eth'
const USDT = 'usdt'

export interface IDividendFragment {
  tokenAddress: Address
  tokenAmount: Address
  isRedeemed: boolean
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
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const contractInstance = new ethers.Contract(contractAddress, AggregatorV3Interface.abi, provider)
  const data = await contractInstance.latestRoundData()
  return data.answer.toString()
}

export const getERC20Allowance = async (spender: Address | undefined, tokenAddress: Address): Promise<string> => {
  if (!spender) return '0'
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const signer = await provider.getSigner()
  const token = new ethers.Contract(tokenAddress, ERC20ABI, signer)
  return token.connect(signer).allowance(signer._address, spender)
}

export const getERC20Symbol = async (tokenAddress: Address): Promise<string> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const token = new ethers.Contract(tokenAddress, ERC20ABI, provider)
  return await token.symbol()
}

export const approveERC20Token = async (delegator: Address | undefined, tokenData: TokenData, quantity: string) => {
  if (!delegator) return
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const signer = await provider.getSigner()
  const token = new ethers.Contract(tokenData.address, ERC20ABI, signer)
  return token.connect(signer).approve(delegator, quantity).send({ from: signer._address })
}

interface GetLootboxDataOutput {
  name: string
  symbol: string
  sharePriceUSD: string
  sharesSoldCount: string
  sharesSoldMax: string
  ticketIdCounter: string
  shareDecimals: string
}
export const getLootboxData = async (lootboxAddress: Address): Promise<GetLootboxDataOutput> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, provider)
  const [name, symbol, sharePriceUSD, sharesSoldCount, sharesSoldMax, ticketIdCounter, shareDecimals] =
    await Promise.all([
      lootbox.name(),
      lootbox.symbol(),
      lootbox.sharePriceUSD(),
      lootbox.sharesSoldCount(),
      lootbox.sharesSoldMax(),
      lootbox.ticketIdCounter(),
      lootbox.shareDecimals(),
    ])

  return {
    name: name.toString(),
    symbol: symbol.toString(),
    sharePriceUSD: sharePriceUSD.toString(),
    sharesSoldCount: sharesSoldCount.toString(),
    sharesSoldMax: sharesSoldMax.toString(),
    ticketIdCounter: ticketIdCounter.toString(),
    shareDecimals: shareDecimals.toString(),
  }
}

export const getLootboxTicketId = async (lootboxAddress: Address): Promise<string> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, provider)
  const ticketId = await lootbox.ticketIdCounter()
  return ticketId.toString()
}

/**
 * Buys lootbox shares
 * @param lootboxAddress address of lootbox
 * @param amountOfStablecoin amount of stable coin to buy
 * @returns Promise resolving into transaction hash
 */
export const buyLootboxShares = async (lootboxAddress: Address, amountOfStablecoin: string): Promise<string> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const signer = await provider.getSigner()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, signer)
  const tx = await lootbox.connect(signer).purchaseTicket({
    value: amountOfStablecoin,
    gasLimit: 200000,
    gasPrice: ethers.utils.parseUnits('6', 'gwei'),
  })
  await tx.wait()
  return tx.hash
}

export const getTicketDividends = async (lootboxAddress: Address, ticketID: string): Promise<IDividendFragment[]> => {
  const res: IDividendFragment[] = []
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, provider)
  const proratedDeposits = await lootbox.viewProratedDepositsForTicket(ticketID)
  for (let deposit of proratedDeposits) {
    if (deposit.nativeTokenAmount && deposit.nativeTokenAmount.gt('0')) {
      res.push({
        tokenAddress: NATIVE_ADDRESS,
        tokenAmount: deposit.nativeTokenAmount.toString(),
        isRedeemed: deposit.redeemed,
      })
    }
    if (deposit.erc20TokenAmount && deposit.erc20TokenAmount.gt('0')) {
      res.push({
        tokenAddress: deposit.erc20Token,
        tokenAmount: deposit.erc20TokenAmount.toString(),
        isRedeemed: deposit.redeemed,
      })
    }
  }
  return res
}

export const fetchUserTicketsFromLootbox = async (userAddress: Address, lootboxAddress: Address) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, provider)
  const userTickets = await lootbox.viewAllTicketsOfHolder(userAddress)
  return userTickets
}

export const withdrawEarningsFromLootbox = async (ticketID: string, lootboxAddress: Address) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const signer = await provider.getSigner()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, signer)
  const res = await lootbox.connect(signer).withdrawEarnings(ticketID)
  await res.wait()
  return res
}

export const getUserBalanceOfToken = async (contractAddr: Address, userAddr: Address): Promise<string> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const ERC20 = new ethers.Contract(contractAddr, ERC20ABI, provider)
  const balance = await ERC20.balanceOf(userAddr)
  return balance.toString()
}

export const getUserBalanceOfNativeToken = async (userAddr: Address): Promise<string> => {
  const { provider } = await getProvider()
  const balance = await provider.getBalance(userAddr)
  return balance.toString()
}
