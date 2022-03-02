import react, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { userState } from 'lib/state/userState'
import { DEFAULT_CHAIN_ID_HEX } from '../constants'
import { Address, BLOCKCHAINS, chainIdHexToSlug, ChainInfo, convertDecimalToHex, TokenData } from '@lootboxfund/helpers'
import { initTokenList } from 'lib/hooks/useTokenList'
import { crowdSaleState } from 'lib/state/crowdSale.state'
import Web3Utils from 'web3-utils'
import { ethers as ethersObj } from 'ethers'

const DEFAULT_CHAIN_SLUG = chainIdHexToSlug(DEFAULT_CHAIN_ID_HEX)
const DEFAULT_BLOCKCHAIN = DEFAULT_CHAIN_SLUG && BLOCKCHAINS[DEFAULT_CHAIN_SLUG]

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
  const { provider } = await getProvider()
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
  const { provider, metamask } = await getProvider()
  if (metamask) {
    try {
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
}

export const addERC721ToWallet = async (token: TokenData) => {
  const { provider } = await getProvider()
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

interface ProviderOutput {
  provider: ethersObj.providers.Web3Provider | ethersObj.providers.JsonRpcProvider
  metamask: unknown
}
export const getProvider = async (): Promise<ProviderOutput> => {
  const ethers = window.ethers ? window.ethers : ethersObj
  let metamask: unknown = undefined
  try {
    metamask = await detectEthereumProvider()
  } catch (err) {
    console.error(err)
  }
  let provider: ethersObj.providers.Web3Provider | ethersObj.providers.JsonRpcProvider
  if (metamask) {
    provider = new ethers.providers.Web3Provider(metamask as any)
  } else {
    provider = new ethers.providers.JsonRpcProvider(
      DEFAULT_BLOCKCHAIN?.rpcUrls[0] || 'https://bsc-dataseed.binance.org/'
    )
  }
  return { provider, metamask }
}

export const initDApp = async () => {
  const { provider, metamask } = await getProvider()
  if (metamask) {
    provider
      .send('eth_requestAccounts', [])
      .then((userAccounts) => {
        userState.accounts = userAccounts
        userState.currentAccount = userAccounts[0]
      })
      .catch((err) => console.error(err))
  }
  const network = await provider.getNetwork()
  const chainIdHex = convertDecimalToHex(network.chainId.toString())
  const chainSlug = chainIdHexToSlug(chainIdHex)
  if (chainSlug) {
    const blockchain = BLOCKCHAINS[chainSlug]
    if (blockchain) {
      updateStateToChain(blockchain)
    }
  }

  provider.on('network', async (newNetwork, oldNetwork) => {
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

  if (metamask) {
    ;(metamask as any).on('accountsChanged', async (accounts: Address[]) => {
      userState.accounts = accounts
      userState.currentAccount = accounts[0]
    })
  }
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
