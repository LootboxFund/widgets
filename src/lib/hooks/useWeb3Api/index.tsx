import react, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { userState } from 'lib/state/userState'
import { DEFAULT_CHAIN_ID_HEX } from '../constants'
import {
  Address,
  BLOCKCHAINS,
  ChainIDHex,
  chainIdHexToSlug,
  ChainInfo,
  convertDecimalToHex,
  TokenData,
} from '@lootboxfund/helpers'
import { initTokenList } from 'lib/hooks/useTokenList'
import { crowdSaleState } from 'lib/state/crowdSale.state'
import Web3Utils from 'web3-utils'
import { clearSwapState } from 'lib/state/swap.state'
import { ethers as ethersObj } from 'ethers'

export const useWeb3Utils = () => {
  return window.web3 && window.web3.utils ? window.web3.utils : Web3Utils
}

export const useEthers = () => {
  if (!window.ethers) {
    return ethersObj
  }
  return window.ethers
}

type useProviderReturnType = [provider: ethersObj.providers.Web3Provider | undefined, loading: boolean]
export const useProvider = (): useProviderReturnType => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const [provider, setProvider] = useState<ethersObj.providers.Web3Provider>()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    loadProvider()
  }, [])
  const loadProvider = async () => {
    const metamask: any = await detectEthereumProvider()
    const prov = new ethers.providers.Web3Provider(metamask, 'any')
    setProvider(prov)
    setLoading(false)
  }
  return [provider, loading]
}

// export const _useWeb3 = () => window.ethers

export const useUserInfo = () => {
  const requestAccounts = async () => {
    const ethers = window.ethers ? window.ethers : ethersObj
    const metamask: any = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(metamask, 'any')
    if (!provider) {
      return {
        success: false,
        message: 'Provider not connected',
      }
    }
    try {
      await provider.send('eth_requestAccounts', [])
      const userAccounts = (await provider.listAccounts()) as Address[]

      userState.accounts = userAccounts
      userState.currentAccount = userAccounts[0] as Address
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
    const ethers = window.ethers ? window.ethers : ethersObj
    const metamask: any = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(metamask, 'any')
    const nativeBalance = await provider.getBalance(userState.accounts[0])
    return nativeBalance
  }
  return {
    requestAccounts,
    getNativeBalance,
  }
}

export const addCustomEVMChain = async (chainIdHex: string) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const metamask: any = await detectEthereumProvider()
  const provider = new ethers.providers.Web3Provider(metamask, 'any')
  const chainSlug = chainIdHexToSlug(chainIdHex)
  if (chainSlug && provider) {
    const chainInfo = BLOCKCHAINS[chainSlug]
    if (chainInfo && provider) {
      try {
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: chainInfo.chainIdHex,
            chainName: chainInfo.chainName,
            nativeCurrency: chainInfo.nativeCurrency,
            rpcUrls: chainInfo.rpcUrls,
            blockExplorerUrls: chainInfo.blockExplorerUrls,
          },
        ])
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
    return
  }
  return
}

export const addERC20ToWallet = async (token: TokenData) => {
  try {
    const ethers = window.ethers ? window.ethers : ethersObj
    const metamask: any = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(metamask, 'any')
    await provider.send('wallet_watchAsset', [
      {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoURI,
        },
      },
    ])
    return
  } catch (err) {
    console.error(err)
    return
  }
}

export const addERC721ToWallet = async (token: TokenData) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const metamask: any = await detectEthereumProvider()
  const provider = new ethers.providers.Web3Provider(metamask, 'any')
  try {
    await provider.send('wallet_watchAsset', [
      {
        type: 'ERC721',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoURI,
        },
      },
    ])
    return
  } catch (err) {
    console.error(err)
    return
  }
}

export const initDApp = async () => {
  try {
    await initWeb3OnWindow()
  } catch (err) {
    console.error('Error initializing Web3', err)
  }
  const ethers = window.ethers ? window.ethers : ethersObj
  const metamask: any = await detectEthereumProvider()
  const provider = new ethers.providers.Web3Provider(metamask, 'any')
  if (!provider) {
    throw new Error('No provider')
  }
  provider.on('network', async (newNetwork, oldNetwork) => {
    console.log(newNetwork)
    const chainIdHex = convertDecimalToHex(newNetwork.chainId.toString())
    const chainSlug = chainIdHexToSlug(chainIdHex)
    if (chainSlug) {
      const blockchain = BLOCKCHAINS[chainSlug]
      if (blockchain) {
        updateStateToChain(blockchain)
      } else {
        clearStateToChain()
      }
    }
  })
  ;(window as any).ethereum.on('accountsChanged', async (accounts: Address[]) => {
    console.log(`----- accounts changed!`)
    userState.accounts = accounts
    userState.currentAccount = accounts[0]
  })
}

const initWeb3OnWindow = async () => {
  const ethers = window.ethers ? window.ethers : ethersObj
  const metamask = await detectEthereumProvider()
  const provider = new ethers.providers.Web3Provider(metamask as any)
  // const userAccounts = await provider.send('eth_requestAccounts', [])
  // userState.accounts = userAccounts
  // userState.currentAccount = userAccounts[0]
  const network = await provider.getNetwork()
  const chainIdHex = convertDecimalToHex(network.chainId.toString())
  const chainSlug = chainIdHexToSlug(chainIdHex)
  if (chainSlug) {
    const blockchain = BLOCKCHAINS[chainSlug]
    if (blockchain) {
      updateStateToChain(blockchain)
    }
  }
  return
}

export const updateStateToChain = (chainInfo: ChainInfo) => {
  userState.network.currentNetworkIdHex = chainInfo.chainIdHex
  userState.network.currentNetworkIdDecimal = chainInfo.chainIdDecimal
  userState.network.currentNetworkName = chainInfo.chainName
  userState.network.currentNetworkDisplayName = chainInfo.displayName
  userState.network.currentNetworkLogo = chainInfo.currentNetworkLogo
  initTokenList(chainInfo.chainIdHex)
}

export const clearStateToChain = () => {
  userState.network.currentNetworkIdHex = undefined
  userState.network.currentNetworkIdDecimal = undefined
  userState.network.currentNetworkName = undefined
  userState.network.currentNetworkDisplayName = undefined
  userState.network.currentNetworkLogo = undefined
  initTokenList()
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
