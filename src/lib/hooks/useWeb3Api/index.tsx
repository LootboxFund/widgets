import react from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { userState } from 'lib/state/userState'
import { ChainInfo, BLOCKCHAINS } from '../constants'
import { ChainIDHex, TokenData } from '@guildfx/helpers'
import { initTokenList } from 'lib/hooks/useTokenList'
import { swapState } from 'lib/components/Swap/state'
import { crowdSaleState } from 'lib/components/CrowdSale/state'

export const useWeb3 = async () => {
  return window.web3
}

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

export const addToWallet = async (token: TokenData) => {
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

export const initDApp = async () => {
  initWeb3OnWindow()
  const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })

  const blockchain = BLOCKCHAINS[chainIdHex]

  if (blockchain) {
    updateStateToChain(blockchain)
  }
  const userAccounts = await window.web3.eth.getAccounts()

  userState.accounts = userAccounts
  userState.currentAccount = userAccounts[0]
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

const initWeb3OnWindow = async () => {
  const provider = await detectEthereumProvider()
  // const provider = (window as any).ethereum
  window.web3 = new (window as any).Web3('https://bsc-dataseed.binance.org/')
  if (provider) {
    window.web3 = new (window as any).Web3(provider)
    const userAccounts = await window.web3.eth.getAccounts()
    userState.accounts = userAccounts
  } else {
    console.error('Please install MetaMask!')
    throw Error('MetaMask not detected')
  }
}

export const updateStateToChain = (chainInfo: ChainInfo) => {
  userState.currentNetworkIdHex = chainInfo.chainIdHex
  userState.currentNetworkIdDecimal = chainInfo.chainIdDecimal
  userState.currentNetworkName = chainInfo.chainName
  userState.currentNetworkDisplayName = chainInfo.displayName
  userState.currentNetworkLogo = chainInfo.currentNetworkLogo
  clearSwapState()
  clearCrowdSaleState()
  initTokenList(chainInfo.chainIdHex)
}

export const clearStateToChain = () => {
  userState.currentNetworkIdHex = undefined
  userState.currentNetworkIdDecimal = undefined
  userState.currentNetworkName = undefined
  userState.currentNetworkDisplayName = undefined
  userState.currentNetworkLogo = undefined
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
