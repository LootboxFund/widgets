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
import { ethers } from 'ethers'

export const useWeb3Utils = () => {
  return window.web3 && window.web3.utils ? window.web3.utils : Web3Utils
}

export const useEthers = () => {
  if (!window.ethers) {
    return ethers
  }
  return window.ethers
}

type useProviderReturnType = [provider: ethers.providers.Web3Provider | undefined, loading: boolean]
export const useProvider = (): useProviderReturnType => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    loadProvider()
  }, [])
  const loadProvider = async () => {
    const metamask: any = await detectEthereumProvider()
    const prov = new ethersObj.providers.Web3Provider(metamask, 'any')
    setProvider(prov)
    setLoading(false)
  }
  return [provider, loading]
}

// export const _useWeb3 = () => window.ethers

export const useUserInfo = () => {
  const requestAccounts = async () => {
    console.log(`--- requesting accounts...`)
    const [provider] = await useProvider()
    console.log(`--- got ethers `, ethers)
    if (!provider) {
      return {
        success: false,
        message: 'Provider not connected',
      }
    }
    try {
      await provider.send('eth_requestAccounts', [])
      const userAccounts = (await provider.listAccounts()) as Address[]
      console.log(`Got user accounts `, userAccounts)
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
    const [provider] = useProvider()
    if (!provider) {
      throw new Error('No provider')
    }
    const nativeBalance = await provider.getBalance(userState.accounts[0])
    return nativeBalance
  }
  return {
    requestAccounts,
    getNativeBalance,
  }
}

export const addCustomEVMChain = async (chainIdHex: string) => {
  const [provider] = useProvider()
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
    const [provider] = useProvider()
    if (!provider) {
      throw new Error('No provider')
    }
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
  const [provider] = useProvider()
  if (!provider) {
    throw new Error('No provider')
  }
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

export const initDApp = async (rpcUrl?: string) => {
  try {
    await initWeb3OnWindow(rpcUrl)
  } catch (err) {
    console.error('Error initializing Web3', err)
  }
  const metamask: any = await detectEthereumProvider()
  const provider = new ethers.providers.Web3Provider(metamask, 'any')
  if (!provider) {
    throw new Error('No provider')
  }
  provider.on('chainChanged', async (chainIdHex: ChainIDHex) => {
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
  provider.on('accountsChanged', async (accounts: Address[]) => {
    userState.accounts = accounts
    // userState.currentAccount = accounts[0]
  })
}

const initWeb3OnWindow = async (rpcUrl?: string) => {
  const ethersObj = window.ethers ? window.ethers : ethers
  const metamask = await detectEthereumProvider()
  const provider = new ethersObj.providers.Web3Provider(metamask as any)
  console.log(`------------ provider: `, provider)
  const userAccounts = await provider.send('eth_requestAccounts', [])
  userState.accounts = userAccounts
  userState.currentAccount = userAccounts[0]
  const network = await provider.getNetwork()
  const chainIdHex = convertDecimalToHex(network.chainId.toString())
  const chainSlug = chainIdHexToSlug(chainIdHex)
  if (chainSlug) {
    const blockchain = BLOCKCHAINS[chainSlug]
    if (blockchain) {
      updateStateToChain(blockchain)
    }
  }
}

export const updateStateToChain = (chainInfo: ChainInfo) => {
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
