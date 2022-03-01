import { AbiItem } from 'web3-utils'
import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import ERC20ABI from 'lib/abi/erc20.json'
import LootboxABI from 'lib/abi/lootbox.json'
import CrowdSaleABI from 'lib/abi/_deprecated/crowdSale.json'
import { NATIVE_ADDRESS } from 'lib/hooks/constants'
import BN from 'bignumber.js'
import { TokenData, Address, convertDecimalToHex } from '@lootboxfund/helpers'
import { useEthers } from 'lib/hooks/useWeb3Api'
import { ethers } from 'ethers'
import { useProvider } from '../useWeb3Api/index'
import detectEthereumProvider from '@metamask/detect-provider'

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
  const ethersObj = window.ethers ? window.ethers : ethers
  const metamask: any = await detectEthereumProvider()
  const provider = new ethersObj.providers.Web3Provider(metamask, 'any')
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const contractInstance = new ethersObj.Contract(contractAddress, AggregatorV3Interface.abi, signer)
  console.log(`---- contractInstance `, contractInstance)
  try {
    const data = await contractInstance.latestRoundData()
    return data.answer
  } catch (e) {
    console.log(e)
  }
  return ''
}

export const purchaseFromCrowdSale = async (
  crowdSaleAddress: Address,
  stableCoinData: TokenData,
  stableCoinAmount: string
) => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const crowdSale = new ethersObj.Contract(crowdSaleAddress, CrowdSaleABI, signer)
  const stableCoinSymbol = stableCoinData.symbol.toLowerCase()
  let tx = undefined
  if ([BNB, TBNB].includes(stableCoinSymbol)) {
    tx = crowdSale.connect(signer).buyInBNB().send({ value: stableCoinAmount })
  } else {
    if (stableCoinSymbol === ETH) {
      tx = crowdSale.connect(signer).buyInETH(stableCoinAmount).send()
    } else if (stableCoinSymbol === USDC) {
      tx = crowdSale.connect(signer).buyInUSDC(stableCoinAmount).send()
    } else if (stableCoinSymbol === USDT) {
      tx = crowdSale.connect(signer).buyInUSDT(stableCoinAmount).send()
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
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const token = new ethersObj.Contract(tokenAddress, ERC20ABI, signer)
  return token.connect(signer).allowance(signer._address, spender).call()
}

export const getERC20Symbol = async (tokenAddress: Address): Promise<string> => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const token = new ethersObj.Contract(tokenAddress, ERC20ABI, signer)
  return token.connect(signer).symbol().call()
}

export const approveERC20Token = async (delegator: Address | undefined, tokenData: TokenData, quantity: string) => {
  if (!delegator) return
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const token = new ethersObj.Contract(tokenData.address, ERC20ABI, signer)
  return token.connect(signer).approve(delegator, quantity).send({ from: signer._address })
}

export const getLootboxData = async (lootboxAddress: Address) => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const lootbox = new ethersObj.Contract(lootboxAddress, LootboxABI, signer)
  const [name, symbol, sharePriceUSD, sharesSoldCount, sharesSoldMax, ticketIdCounter, shareDecimals] =
    await Promise.all([
      lootbox.connect(signer).name().call(),
      lootbox.connect(signer).symbol().call(),
      lootbox.connect(signer).sharePriceUSD().call(),
      lootbox.connect(signer).sharesSoldCount().call(),
      lootbox.connect(signer).sharesSoldMax().call(),
      lootbox.connect(signer).ticketIdCounter().call(),
      lootbox.connect(signer).shareDecimals().call(),
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
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const lootbox = new ethersObj.Contract(lootboxAddress, LootboxABI, signer)
  const ticketId = await lootbox.connect(signer).ticketIdCounter().call()
  return ticketId
}

export const buyLootboxShares = async (lootboxAddress: Address, amountOfStablecoin: string) => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const lootbox = new ethersObj.Contract(lootboxAddress, LootboxABI, signer)
  return await lootbox.connect(signer).purchaseTicket().send({ value: amountOfStablecoin })
}

export const getTicketDividends = async (lootboxAddress: Address, ticketID: string): Promise<IDividendFragment[]> => {
  const res: IDividendFragment[] = []
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const lootbox = new ethersObj.Contract(lootboxAddress, LootboxABI, signer)
  const proratedDeposits = await lootbox.connect(signer).viewProratedDepositsForTicket(ticketID).call()
  for (let deposit of proratedDeposits) {
    if (deposit.nativeTokenAmount && deposit.nativeTokenAmount !== '0') {
      res.push({
        tokenAddress: NATIVE_ADDRESS,
        tokenAmount: deposit.nativeTokenAmount,
        isRedeemed: deposit.redeemed,
      })
    }
    if (deposit.erc20TokenAmount && deposit.erc20TokenAmount !== '0') {
      res.push({
        tokenAddress: deposit.erc20Token,
        tokenAmount: deposit.erc20TokenAmount,
        isRedeemed: deposit.redeemed,
      })
    }
  }
  return res
}

export const fetchUserTicketsFromLootbox = async (lootboxAddress: Address) => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const lootbox = new ethersObj.Contract(lootboxAddress, LootboxABI, signer)
  const userTickets = await lootbox.connect(signer).viewAllTicketsOfHolder(signer._address).call()
  return userTickets
}

export const withdrawEarningsFromLootbox = async (ticketID: string, lootboxAddress: Address) => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
  const signer = await provider.getSigner()
  const lootbox = new ethersObj.Contract(lootboxAddress, LootboxABI, signer)
  const res = await lootbox.connect(signer).withdrawEarnings(ticketID).send()
  return res
}
