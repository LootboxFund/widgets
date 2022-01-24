import react from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'
import { ChainInfo, ChainIDHex, BLOCKCHAINS } from '../constants'
import { getCustomTokensList, saveInitialCustomTokens, stateOfTokenList } from '../useTokenList'
import { tokenMap, DEFAULT_CHAIN_ID_HEX } from 'lib/hooks/constants'
import { initTokenList } from 'lib/hooks/useTokenList'
import { stateOfSwap } from '../../components/Swap/state'

export const useWeb3 = async () => {
  const provider = await detectEthereumProvider()
  let web3 = new Web3('https://bsc-dataseed.binance.org/')
  if (provider) {
    // From now on, this should always be true:
    // provider === window.ethereum
    web3 = new Web3((window as any).ethereum)
    const userAccounts = await web3.eth.getAccounts()
    userState.accounts = userAccounts
  } else {
    console.log('Please install MetaMask!')
    throw Error('MetaMask not detected')
  }
  return web3
}

export const useUserInfo = () => {
  const requestAccounts = async () => {
    try {
      const web3 = await useWeb3()
      const preAccounts = await web3.eth.getAccounts()
      console.log(preAccounts)
      await web3.eth.requestAccounts(async (err, accounts) => {
        if (err) {
          console.log(err)
        } else {
          console.log('--- accounts ---')
          console.log(accounts)
          const userAccounts = await web3.eth.getAccounts()
          userState.accounts = userAccounts
          console.log(userAccounts)
        }
      })
      return {
        success: true,
        message: 'Successfully connected to wallet',
      }
    } catch (e) {
      return {
        success: false,
        message: 'Please install MetaMask',
      }
    }
  }
  const getNativeBalance = async () => {
    const web3 = await useWeb3()
    const nativeBalance = await web3.eth.getBalance(userState.accounts[0])
    return nativeBalance
  }
  return {
    requestAccounts,
    getNativeBalance,
  }
}

export const addCustomEVMChain = async (chainIdHex: string) => {
  const chainInfo = BLOCKCHAINS[chainIdHex]
  if (chainInfo) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainInfo.chainIdHex,
            chainName: chainInfo.chainName,
            nativeCurrency: chainInfo.nativeCurrency,
            rpcUrls: chainInfo.rpcUrls,
            blockExplorerUrls: chainInfo.blockExplorerUrls,
          },
        ],
      })
      updateStateToChain(chainInfo)
      return
    } catch (e) {
      console.log(
        `Could not connect to the desired chain ${chainInfo.chainIdHex} in hex (${chainInfo.chainIdDecimal} in decimals)`
      )
      return
    }
  }
}

export const initDApp = async () => {
  const web3 = await useWeb3()
  const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
  const blockchain = BLOCKCHAINS[chainIdHex]
  if (blockchain) {
    updateStateToChain(blockchain)
  }
  const userAccounts = await web3.eth.getAccounts()
  userState.accounts = userAccounts
  userState.currentAccount = userAccounts[0]
  initTokenList()
  ;(window as any).ethereum.on('chainChanged', async (chainIdHex: ChainIDHex) => {
    console.log(`
      
    ---- EVM Chain Changed!

    `)
    const blockchain = BLOCKCHAINS[chainIdHex]
    if (blockchain) {
      updateStateToChain(blockchain)
    } else {
      clearStateToChain()
    }
  })
}

export const updateStateToChain = (chainInfo: ChainInfo) => {
  userState.currentNetworkIdHex = chainInfo.chainIdHex
  userState.currentNetworkIdDecimal = chainInfo.chainIdDecimal
  userState.currentNetworkName = chainInfo.chainName
  userState.currentNetworkDisplayName = chainInfo.displayName
  userState.currentNetworkLogo = chainInfo.currentNetworkLogo
  clearSwapState()
  initTokenList(chainInfo.chainIdHex)
}

export const clearStateToChain = () => {
  userState.currentNetworkIdHex = undefined
  userState.currentNetworkIdDecimal = undefined
  userState.currentNetworkName = undefined
  userState.currentNetworkDisplayName = undefined
  userState.currentNetworkLogo = undefined
  clearSwapState()
  initTokenList()
}

export const clearSwapState = () => {
  stateOfSwap.targetToken = null
  stateOfSwap.inputToken.data = undefined
  stateOfSwap.inputToken.displayedBalance = undefined
  stateOfSwap.inputToken.quantity = undefined
  stateOfSwap.outputToken.data = undefined
  stateOfSwap.outputToken.displayedBalance = undefined
  stateOfSwap.outputToken.quantity = undefined
}
