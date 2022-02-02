import { Address } from 'lib/types/baseTypes'
import { AbiItem } from 'web3-utils'
import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import { useWeb3 } from '../useWeb3Api'
import ERC20ABI from 'lib/abi/erc20.json'
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

export const getPriceFeed = async (contractAddress: Address) => {
  const web3 = await useWeb3()
  let contractInstance = new web3.eth.Contract(AggregatorV3Interface.abi as AbiItem[], contractAddress)
  const [currentUser, ...otherUserAddress] = await web3.eth.getAccounts()
  const data = await contractInstance.methods.latestRoundData().call({ from: currentUser })
  const priceIn8Decimals = new BN(data.answer).div(new BN(`100000000`)).decimalPlaces(4)
  return priceIn8Decimals
}

export const getCrowdSaleSeedData = async (crowdSaleAddress: Address): Promise<CrowdSaleSeedData> => {
  const web3 = await useWeb3()
  const crowdSale = new web3.eth.Contract(CrowdSaleABI, crowdSaleAddress)
  const gfxConstants = new web3.eth.Contract(
    GFXConstantsABI,
    // Can I use this "userState" here like this?
    addresses[userState.currentNetworkIdHex || DEFAULT_CHAIN_ID_HEX].gfxConstants
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
    gas: '10000000', // Have to hardocode the gas limit for now...
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
