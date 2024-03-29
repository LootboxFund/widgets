import react, { useEffect, useMemo, useState } from 'react'
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
} from '@wormgraph/helpers'
import { initTokenList } from 'lib/hooks/useTokenList'
import Web3Utils from 'web3-utils'
import { ethers as ethersObj, providers } from 'ethers'
import { manifest } from 'manifest'

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

interface ReadOnlyProviderParams {
  chainIDHex?: ChainIDHex
}
export const useReadOnlyProvider = ({ chainIDHex }: ReadOnlyProviderParams) => {
  const provider = useMemo<providers.JsonRpcProvider | null>(() => {
    const chainInfo = manifest.chains.find((chain) => chain.chainIdHex === chainIDHex)

    if (!chainInfo) {
      return null
    }

    return new providers.JsonRpcProvider(chainInfo.rpcUrls[0])
  }, [chainIDHex])

  return { provider }
}

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
        code: e?.code || -1,
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
        // TODO: this method does not throw when rejected by user in metamask
        // If you want to change chains, you need to call:
        // await provider.send('wallet_switchEthereumChain'...) which
        // will correctly throw when the user denies the request
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

interface Erc721Token {
  address: Address
  symbol: string
  decimals: number
  image: string
}
export const addERC721ToWallet = async (token: Erc721Token) => {
  const { provider } = await getProvider()
  try {
    await provider.send('wallet_watchAsset', [
      {
        type: 'ERC721',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.image,
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
export const getProvider = async (fallbackChain?: ChainIDHex): Promise<ProviderOutput> => {
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
  } else if (fallbackChain) {
    const DEFAULT_CHAIN_SLUG = chainIdHexToSlug(fallbackChain)
    const DEFAULT_BLOCKCHAIN = DEFAULT_CHAIN_SLUG && BLOCKCHAINS[DEFAULT_CHAIN_SLUG]
    provider = new ethers.providers.JsonRpcProvider(DEFAULT_BLOCKCHAIN?.rpcUrls[0])
  } else {
    provider = new ethers.providers.JsonRpcProvider()
  }
  return { provider, metamask }
}

export const initDApp = async (fallbackChain?: ChainIDHex) => {
  const { provider, metamask } = await getProvider(fallbackChain)
  const network = await provider.getNetwork()
  const chainIdHex = convertDecimalToHex(network.chainId.toString())
  const chainSlug = chainIdHexToSlug(chainIdHex)
  if (chainSlug) {
    const blockchain = BLOCKCHAINS[chainSlug]
    if (blockchain) {
      updateStateToChain(blockchain)
    }
  }

  if (metamask) {
    const accounts = await provider.listAccounts()
    userState.accounts = accounts as Address[]
    userState.currentAccount = accounts[0] as Address
    ;(metamask as any).on('accountsChanged', async (accounts: Address[]) => {
      userState.accounts = accounts
      userState.currentAccount = accounts[0]
    })
    ;(metamask as any).on('chainChanged', async (networkId: string) => {
      window.location.reload()
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
