import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import ERC20ABI from 'lib/abi/erc20.json'
import LootboxABI from 'lib/abi/lootbox.json'
import LootboxPreknownABI from 'lib/abi/LootboxPreknown.json'
import LootboxEscrowABI from 'lib/abi/LootboxEscrow.json'
import LootboxInstantABI from 'lib/abi/LootboxInstant.json'
import { NATIVE_ADDRESS } from 'lib/hooks/constants'
import BN, { BigNumber } from 'bignumber.js'
import { TokenData, Address, ContractAddress } from '@wormgraph/helpers'
import { Contract, ethers as ethersObj } from 'ethers'
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
  const lootbox = new ethers.Contract(lootboxAddress, LootboxABI, provider)
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
  const lootbox = new ethers.Contract(lootboxAddress, LootboxABI, provider)
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
  const lootbox = new ethers.Contract(lootboxAddress, LootboxABI, signer)
  const tx = await lootbox.connect(signer).purchaseTicket({ value: amountOfStablecoin })
  await tx.wait()
  return tx.hash
}

export const getTicketDividends = async (lootboxAddress: Address, ticketID: string): Promise<IDividendFragment[]> => {
  const res: IDividendFragment[] = []
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxABI, provider)
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
  const lootbox = new ethers.Contract(lootboxAddress, LootboxABI, provider)
  const userTickets = await lootbox.viewAllTicketsOfHolder(userAddress)
  return userTickets
}

export const withdrawEarningsFromLootbox = async (ticketID: string, lootboxAddress: Address) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const signer = await provider.getSigner()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxABI, signer)
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

/**
 * Identifies the Lootbox as Escrow or Instant
 */
export type LootboxType = 'Escrow' | 'Instant'
export const identifyLootboxType = async (lootboxAddress: Address): Promise<LootboxType> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxPreknownABI, provider)
  const lootboxType = await lootbox.variant()
  return lootboxType
}

export const getLootboxEscrowManagementDetails = async (
  lootboxAddress: ContractAddress,
  nativePriceFeed: ContractAddress
) => {
  console.log('grabing...')
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const escrowLootbox = new ethers.Contract(lootboxAddress, LootboxEscrowABI, provider)
  console.log(escrowLootbox)
  const [
    shareDecimals,
    feeDecimals,
    deploymentStartTime,
    issuer,
    sharePriceUSD,
    sharesSoldCount,
    sharesSoldTarget,
    sharesSoldMax,
    nativeTokenRaisedTotal,
    isFundraising,
    treasury,
    depositIdCounter,
    ticketIdCounter,
  ] = await Promise.all([
    escrowLootbox.shareDecimals(),
    escrowLootbox.feeDecimals(),
    escrowLootbox.deploymentStartTime(),
    escrowLootbox.issuer(),
    escrowLootbox.sharePriceUSD(),
    escrowLootbox.sharesSoldCount(),
    escrowLootbox.sharesSoldTarget(),
    escrowLootbox.sharesSoldMax(),
    escrowLootbox.nativeTokenRaisedTotal(),
    escrowLootbox.isFundraising(),
    escrowLootbox.treasury(),
    escrowLootbox.depositIdCounter(),
    escrowLootbox.ticketIdCounter(),
  ])
  const nativeTokenPriceEther = await getPriceFeed(nativePriceFeed)
  const nativeTokenPriceBN = nativeTokenPriceEther.multipliedBy(new BigNumber('10').pow('8'))
  const nativeTokenPrice = ethers.BigNumber.from(nativeTokenPriceBN.toString())
  const priceFeedDecimals = ethers.utils.parseUnits('1', '8')
  const nativeTokenDecimals = ethers.utils.parseUnits('1', '18')

  console.log(`

  ---- ESCROW LOOTBOX ----
    
  shareDecimals,                = ${shareDecimals}
  feeDecimals,                  = ${feeDecimals}
  deploymentStartTime,          = ${deploymentStartTime}
  issuer,                       = ${issuer}
  sharePriceUSD,                = ${sharePriceUSD}
  sharesSoldCount,              = ${sharesSoldCount}
  sharesSoldTarget,             = ${sharesSoldTarget}
  sharesSoldMax,                = ${sharesSoldMax}
  nativeTokenRaisedTotal,       = ${nativeTokenRaisedTotal}
  isFundraising,                = ${isFundraising}
  treasury,                     = ${treasury}
  depositIdCounter,             = ${depositIdCounter}
  ticketIdCounter,              = ${ticketIdCounter}
  nativeTokenPrice,             = ${nativeTokenPrice.toString()}

  `)

  const fundedAmountNative = parseFloat(ethers.utils.formatUnits(nativeTokenRaisedTotal.toString(), 18)).toFixed(4)
  const fundedAmountUSD = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(nativeTokenRaisedTotal).mul(nativeTokenPrice).div(priceFeedDecimals).toString(),
      '18'
    )
  ).toFixed(2)
  const fundedAmountShares = parseFloat(ethers.utils.formatUnits(sharesSoldCount.toString(), shareDecimals)).toFixed(0)
  const maxAmountNative = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldMax.toString())
        .mul(ethers.BigNumber.from(sharePriceUSD))
        .div(priceFeedDecimals)
        .div(nativeTokenPrice),
      18 - 8
    )
  ).toFixed(4)

  const maxAmountUSD = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldMax.toString()).mul(ethers.BigNumber.from(sharePriceUSD)).div(priceFeedDecimals),
      shareDecimals
    )
  ).toFixed(2)
  const maxAmountShares = parseFloat(ethers.utils.formatUnits(sharesSoldMax, shareDecimals)).toFixed(0)
  const targetAmountNative = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldTarget.toString())
        .mul(ethers.BigNumber.from(sharePriceUSD))
        .div(priceFeedDecimals)
        .div(nativeTokenPrice),
      18 - 8
    )
  ).toFixed(4)
  const targetAmountUSD = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldTarget.toString())
        .mul(ethers.BigNumber.from(sharePriceUSD))
        .div(priceFeedDecimals),
      shareDecimals
    )
  ).toFixed(2)
  const targetAmountShares = parseFloat(ethers.utils.formatUnits(sharesSoldTarget, shareDecimals)).toFixed(0)
  const isActivelyFundraising = isFundraising
  const mintedCount = ticketIdCounter
  const payoutsMade = depositIdCounter
  const deploymentDate = parseInt(`${deploymentStartTime}000`)
  const treasuryAddress = treasury
  const reputationAddress = issuer
  const percentageFunded = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldCount)
        .mul(ethers.utils.parseUnits('1', shareDecimals))
        .div(sharesSoldMax)
        .toString(),
      shareDecimals - 2
    )
  ).toFixed(1)

  console.log(`
    
  ----- ESCROW TRANSLATED -----

  fundedAmountNative,           = ${fundedAmountNative}
  fundedAmountUSD,              = ${fundedAmountUSD}
  fundedAmountShares,           = ${fundedAmountShares}
  targetAmountNative,           = ${targetAmountNative}
  targetAmountUSD,              = ${targetAmountUSD}
  targetAmountShares,           = ${targetAmountShares}
  maxAmountNative,              = ${maxAmountNative}
  maxAmountUSD,                 = ${maxAmountUSD}
  maxAmountShares,              = ${maxAmountShares}
  isActivelyFundraising,        = ${isActivelyFundraising}
  mintedCount,                  = ${mintedCount}
  payoutsMade,                  = ${payoutsMade}
  deploymentDate,               = ${deploymentDate}
  treasuryAddress,              = ${treasuryAddress}
  reputationAddress,            = ${reputationAddress}
  percentageFunded,             = ${percentageFunded}

  `)

  return [
    fundedAmountNative,
    fundedAmountUSD,
    fundedAmountShares,
    targetAmountNative,
    targetAmountUSD,
    targetAmountShares,
    maxAmountNative,
    maxAmountUSD,
    maxAmountShares,
    isActivelyFundraising,
    mintedCount,
    payoutsMade,
    deploymentDate,
    treasuryAddress,
    reputationAddress,
    percentageFunded,
  ]
}

export const getLootboxInstantManagementDetails = async (
  lootboxAddress: ContractAddress,
  nativePriceFeed: ContractAddress
) => {
  console.log('grabing...')
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const instantLootbox = new ethers.Contract(lootboxAddress, LootboxInstantABI, provider)
  const [
    shareDecimals,
    feeDecimals,
    deploymentStartTime,
    issuer,
    sharePriceUSD,
    sharesSoldCount,
    sharesSoldMax,
    nativeTokenRaisedTotal,
    isFundraising,
    treasury,
    depositIdCounter,
    ticketIdCounter,
  ] = await Promise.all([
    instantLootbox.shareDecimals(),
    instantLootbox.feeDecimals(),
    instantLootbox.deploymentStartTime(),
    instantLootbox.issuer(),
    instantLootbox.sharePriceUSD(),
    instantLootbox.sharesSoldCount(),
    instantLootbox.sharesSoldMax(),
    instantLootbox.nativeTokenRaisedTotal(),
    instantLootbox.isFundraising(),
    instantLootbox.treasury(),
    instantLootbox.depositIdCounter(),
    instantLootbox.ticketIdCounter(),
  ])
  const nativeTokenPriceEther = await getPriceFeed(nativePriceFeed)
  const nativeTokenPriceBN = nativeTokenPriceEther.multipliedBy(new BigNumber('10').pow('8'))
  const nativeTokenPrice = ethers.BigNumber.from(nativeTokenPriceBN.toString())
  const priceFeedDecimals = ethers.utils.parseUnits('1', '8')
  const nativeTokenDecimals = ethers.utils.parseUnits('1', '18')

  const fundedAmountNative = parseFloat(ethers.utils.formatUnits(nativeTokenRaisedTotal.toString(), 18)).toFixed(4)
  const fundedAmountUSD = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(nativeTokenRaisedTotal).mul(nativeTokenPrice).div(priceFeedDecimals).toString(),
      '18'
    )
  ).toFixed(2)
  const fundedAmountShares = parseFloat(ethers.utils.formatUnits(sharesSoldCount.toString(), shareDecimals)).toFixed(0)
  const maxAmountNative = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldMax.toString())
        .mul(ethers.BigNumber.from(sharePriceUSD))
        .div(priceFeedDecimals)
        .div(nativeTokenPrice),
      18 - 8
    )
  ).toFixed(4)

  const maxAmountUSD = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldMax.toString()).mul(ethers.BigNumber.from(sharePriceUSD)).div(priceFeedDecimals),
      shareDecimals
    )
  ).toFixed(2)
  const maxAmountShares = parseFloat(ethers.utils.formatUnits(sharesSoldMax, shareDecimals)).toFixed(0)
  const targetAmountNative = maxAmountNative
  const targetAmountUSD = maxAmountUSD
  const targetAmountShares = maxAmountShares
  const isActivelyFundraising = isFundraising
  const mintedCount = ticketIdCounter
  const payoutsMade = depositIdCounter
  const deploymentDate = parseInt(`${deploymentStartTime}000`)
  const treasuryAddress = treasury
  const reputationAddress = issuer
  const percentageFunded = parseFloat(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(sharesSoldCount)
        .mul(ethers.utils.parseUnits('1', shareDecimals))
        .div(sharesSoldMax)
        .toString(),
      shareDecimals - 2
    )
  ).toFixed(1)

  return [
    fundedAmountNative,
    fundedAmountUSD,
    fundedAmountShares,
    targetAmountNative,
    targetAmountUSD,
    targetAmountShares,
    maxAmountNative,
    maxAmountUSD,
    maxAmountShares,
    isActivelyFundraising,
    mintedCount,
    payoutsMade,
    deploymentDate,
    treasuryAddress,
    reputationAddress,
    percentageFunded,
  ]
}

export const getLootboxIssuer = async (lootboxAddress: ContractAddress) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const { provider } = await getProvider()
  const lootbox = new ethers.Contract(lootboxAddress, LootboxPreknownABI, provider)
  const reputationAddress = await lootbox.issuer()
  return reputationAddress
}
