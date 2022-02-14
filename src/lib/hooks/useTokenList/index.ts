import uriToHttp from 'lib/utils/uriToHttp'
import { DEFAULT_CHAIN_ID_HEX, DEMO_CUSTOM_TOKENS_BSC_MAINNET, TokenDataFE, tokenMap } from 'lib/hooks/constants'
import { ChainIDHex } from '@guildfx/helpers'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import { Address } from 'lib/types'

export const getCustomTokensList = (chainIdHex: string) => {
  const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)
  if (existingCustomTokens) {
    const customTokens: Record<string, TokenDataFE[]> = JSON.parse(existingCustomTokens)
    if (customTokens[chainIdHex] && customTokens[chainIdHex].length > 0) {
      return customTokens[chainIdHex]
    }
    return []
  }
  return []
}

interface TokenListState {
  defaultTokenList: TokenDataFE[]
  customTokenList: TokenDataFE[]
}
const initialTokenListState: TokenListState = {
  defaultTokenList: [],
  customTokenList: [],
}

export const tokenListState = proxy(initialTokenListState)

export const useTokenList = () => {
  const snap = useSnapshot(tokenListState)
  return snap.defaultTokenList
}

export const useCustomTokenList = () => {
  const snap = useSnapshot(tokenListState)
  return snap.customTokenList
}

export const addCustomToken = (data: TokenDataFE) => {
  const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)
  if (existingCustomTokens) {
    const customTokens: Record<string, TokenDataFE[]> = JSON.parse(existingCustomTokens)
    if (customTokens[data.chainIdHex] && customTokens[data.chainIdHex].length >= 0) {
      customTokens[data.chainIdHex] = customTokens[data.chainIdHex]
        .filter((t) => t.address !== data.address)
        .concat([data])
    } else {
      customTokens[data.chainIdHex] = [data]
    }
    tokenListState.customTokenList = customTokens[data.chainIdHex]
    localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
  } else {
    const customTokens: Record<string, TokenDataFE[]> = {
      [data.chainIdHex]: [data],
    }
    tokenListState.customTokenList = customTokens[data.chainIdHex]
    localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
  }
}

export const removeCustomToken = (address: string, chainIdHex: string) => {
  const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)

  if (existingCustomTokens) {
    const customTokens: Record<string, TokenDataFE[]> = JSON.parse(existingCustomTokens)
    if (customTokens[chainIdHex]) {
      const updatedList = customTokens[chainIdHex].filter((token) => token.address !== address)
      const updatedTokens = {
        ...customTokens,
        [chainIdHex]: updatedList,
      }
      tokenListState.customTokenList = updatedList
      localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens))
    }
  }
}

export const saveInitialCustomTokens = () => {
  const customTokens: Record<string, TokenDataFE[]> = {
    [DEFAULT_CHAIN_ID_HEX]: DEMO_CUSTOM_TOKENS_BSC_MAINNET,
  }
  localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
}

export const initTokenList = (chainIdHex?: ChainIDHex) => {
  // remove in production
  saveInitialCustomTokens()

  const chosenChainIdHex = chainIdHex || DEFAULT_CHAIN_ID_HEX
  tokenListState.defaultTokenList = tokenMap[chosenChainIdHex] || []
  tokenListState.customTokenList = getCustomTokensList(chosenChainIdHex)
}

export const getTokenFromList = (address: Address | undefined): TokenDataFE | undefined => {
  if (!address) {
    return undefined
  }
  return tokenListState?.defaultTokenList.find((tokenData) => tokenData.address.toLowerCase() === address.toLowerCase())
}
