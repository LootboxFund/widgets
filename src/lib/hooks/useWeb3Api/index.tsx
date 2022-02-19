import react from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { userState } from 'lib/state/userState'
import { ChainInfo, BLOCKCHAINS, DEFAULT_CHAIN_ID_HEX } from '../constants'
import { ChainIDHex, TokenData } from '@guildfx/helpers'
import { initTokenList } from 'lib/hooks/useTokenList'
import { swapState } from 'lib/components/Swap/state'
import { crowdSaleState } from 'lib/components/CrowdSale/state'

import { buySharesState } from 'lib/components/BuyShares/state'
import Web3Utils from 'web3-utils';
import * as Web3 from 'web3';
import { Eth } from 'web3-eth';

export const useWeb3 = async () => {
  return window.Web3
}

export const useWeb3Utils = () => {
  return window.Web3 && window.Web3.utils ? window.Web3.utils : Web3Utils
}

export const useWeb3Eth = () => {
  if (!window.Web3 || !window.Web3.eth) { 
    const client: Eth = new (Web3 as any)('https://data-seed-prebsc-1-s1.binance.org:8545/').eth;
    return client
  }
  return window.Web3.eth
}

// export const _useWeb3 = () => window.Web3

export const useUserInfo = () => {
  const requestAccounts = async () => {
    const web3 = await useWeb3()
    try {
      await web3.eth.requestAccounts(async (err: any, accounts: string[]) => {
        if (err) {
          console.error(err)
        } else {
          const userAccounts = await web3.eth.getAccounts()
          userState.accounts = userAccounts
        }
      })
      return {
        success: true,
        message: 'Successfully connected to wallet',
      }
    } catch (e) {
      console.error(e)
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
      console.error(
        `Could not connect to the desired chain ${chainInfo.chainIdHex} in hex (${chainInfo.chainIdDecimal} in decimals)`
      )
      console.error(e)
      return
    }
  }
}

export const addERC20ToWallet = async (token: TokenData) => {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoURI,
        },
      },
    })
    return
  } catch (err) {
    console.error(err)
    return
  }
}

export const addERC721ToWallet = async (token: TokenData) => {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoURI,
        },
      },
    })
    return
  } catch (err) {
    console.error(err)
    return
  }
}

export const initDApp = async (rpcUrl?: string) => {
  try {
    await initWeb3OnWindow(rpcUrl)
  } catch (err) {
    console.error('Error initializing Web3', err)
  }

  const chainIdHex = (window as any).ethereum
    ? await (window as any).ethereum.request({ method: 'eth_chainId' })
    : DEFAULT_CHAIN_ID_HEX

  const blockchain = BLOCKCHAINS[chainIdHex]

  if (blockchain) {
    updateStateToChain(blockchain)
  }
  const userAccounts = await window.Web3.eth.getAccounts()

  userState.accounts = userAccounts
  userState.currentAccount = userAccounts[0]
  if (!window.ethereum) {
    throw new Error('window.ethereum is not defined!')
  }
  ;(window as any).ethereum.on('chainChanged', async (chainIdHex: ChainIDHex) => {
    const blockchain = BLOCKCHAINS[chainIdHex]
    if (blockchain) {
      updateStateToChain(blockchain)
    } else {
      clearStateToChain()
    }
  })
  ;(window as any).ethereum.on('accountsChanged', async (accounts: ChainIDHex[]) => {
    userState.accounts = accounts
    userState.currentAccount = accounts[0]
  })
}

const initWeb3OnWindow = async (rpcUrl?: string) => {
  const provider = await detectEthereumProvider()
  // const provider = (window as any).ethereum
  window.Web3 = new (window as any).Web3(rpcUrl || 'https://bsc-dataseed.binance.org/')
  if (provider) {
    window.Web3 = new (window as any).Web3(provider)
    const userAccounts = await window.Web3.eth.getAccounts()
    userState.accounts = userAccounts
  } else {
    console.error('Please install MetaMask!')
    throw Error('MetaMask not detected')
  }
}

export const updateStateToChain = (chainInfo: ChainInfo) => {
  console.log(`-----> chainInfo`)
  console.log(chainInfo)
  userState.network.currentNetworkIdHex = chainInfo.chainIdHex
  userState.network.currentNetworkIdDecimal = chainInfo.chainIdDecimal
  userState.network.currentNetworkName = chainInfo.chainName
  userState.network.currentNetworkDisplayName = chainInfo.displayName
  userState.network.currentNetworkLogo = chainInfo.currentNetworkLogo
  clearSwapState()
  clearCrowdSaleState()
  initTokenList(chainInfo.chainIdHex)
}

export const clearStateToChain = () => {
  userState.network.currentNetworkIdHex = undefined
  userState.network.currentNetworkIdDecimal = undefined
  userState.network.currentNetworkName = undefined
  userState.network.currentNetworkDisplayName = undefined
  userState.network.currentNetworkLogo = undefined
  clearSwapState()
  clearCrowdSaleState()
  initTokenList()
}

export const clearSwapState = () => {
  swapState.targetToken = null
  swapState.inputToken.data = undefined
  swapState.inputToken.displayedBalance = undefined
  swapState.inputToken.quantity = undefined
  swapState.outputToken.data = undefined
  swapState.outputToken.displayedBalance = undefined
  swapState.outputToken.quantity = undefined
}

export const clearCrowdSaleState = () => {
  crowdSaleState.targetToken = null
  crowdSaleState.inputToken.data = undefined
  crowdSaleState.inputToken.balance = undefined
  crowdSaleState.inputToken.quantity = undefined
  crowdSaleState.inputToken.allowance = undefined
  crowdSaleState.outputToken.data = undefined
  crowdSaleState.outputToken.balance = undefined
  crowdSaleState.outputToken.quantity = undefined
  crowdSaleState.inputToken.allowance = undefined
}
