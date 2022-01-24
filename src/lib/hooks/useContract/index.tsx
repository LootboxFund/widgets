import { Address } from 'lib/types/baseTypes'
import { AbiItem } from 'web3-utils'
import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'
import { useWeb3 } from '../useWeb3Api'
import BN from 'bignumber.js'

export const getPriceFeed = async (contractAddress: Address) => {
  const web3 = await useWeb3()
  console.log('Trying price oracle...')
  let contractInstance = new web3.eth.Contract(AggregatorV3Interface.abi as AbiItem[], contractAddress)
  const [currentUser, ...otherUserAddress] = await web3.eth.getAccounts()
  console.log(contractInstance)
  console.log(`---- contractInstance.methods.latestRoundData() ----`)
  const data = await contractInstance.methods.latestRoundData().call({ from: currentUser })
  // .on('receipt', function (data: any) {
  //   console.log(data)
  // })
  console.log(data)
  const priceIn8Decimals = new BN(data.answer).div(new BN(`100000000`)).decimalPlaces(4)
  console.log(`priceIn8Decimals = ${priceIn8Decimals}`)
  return priceIn8Decimals
}
