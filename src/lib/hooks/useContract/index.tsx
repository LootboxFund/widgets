import { Address } from 'lib/types/baseTypes'
import { AbiItem } from 'web3-utils'
import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import { useWeb3 } from '../useWeb3Api'
import CrowdSaleABI from 'lib/abi/crowdSale.json'
import GFXConstantsABI from 'lib/abi/gfxConstants.json'
import { addresses, DEFAULT_CHAIN_ID_HEX } from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'
import BN from 'bignumber.js'

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

export const getCrowdSaleSeedData = async (crowdsaleAddress: Address): Promise<CrowdSaleSeedData> => {
  const web3 = await useWeb3()
  const crowdSale = new web3.eth.Contract(
    CrowdSaleABI,
    // Can I use this "userState" here like this?
    crowdsaleAddress
  )
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
