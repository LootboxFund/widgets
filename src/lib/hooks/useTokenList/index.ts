import uriToHttp from 'lib/utils/uriToHttp'
import {
  ChainIDHex,
  DEFAULT_CHAIN_ID_HEX,
  DEMO_CUSTOM_TOKENS_BSC_MAINNET,
  TokenData,
  tokenMap,
} from 'lib/hooks/constants'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'

export const getCustomTokensList = (chainIdHex: string) => {
  const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)
  if (existingCustomTokens) {
    const customTokens: Record<string, TokenData[]> = JSON.parse(existingCustomTokens)
    if (customTokens[chainIdHex] && customTokens[chainIdHex].length > 0) {
      return customTokens[chainIdHex]
    }
    return []
  }
  return []
}

interface TokenListState {
  defaultTokenList: TokenData[]
  customTokenList: TokenData[]
}
const tokenListState: TokenListState = {
  defaultTokenList: [],
  customTokenList: [],
}

export const stateOfTokenList = proxy(tokenListState)

export const useTokenList = () => {
  const snap = useSnapshot(stateOfTokenList)
  return snap.defaultTokenList
}

export const useCustomTokenList = () => {
  const snap = useSnapshot(stateOfTokenList)
  return snap.customTokenList
}

export const addCustomToken = (data: TokenData) => {
  const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)
  if (existingCustomTokens) {
    const customTokens: Record<string, TokenData[]> = JSON.parse(existingCustomTokens)
    if (customTokens[data.chainId] && customTokens[data.chainId].length >= 0) {
      customTokens[data.chainId] = customTokens[data.chainId].filter((t) => t.address !== data.address).concat([data])
    } else {
      customTokens[data.chainId] = [data]
    }
    stateOfTokenList.customTokenList = customTokens[data.chainId]
    localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
  } else {
    const customTokens: Record<string, TokenData[]> = {
      [data.chainId]: [data],
    }
    stateOfTokenList.customTokenList = customTokens[data.chainId]
    localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
  }
}

export const removeCustomToken = (address: string, chainId: number) => {
  console.log(`Removing custom token ${address} from chain ${chainId}`)
  const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)
  console.log(existingCustomTokens)
  if (existingCustomTokens) {
    const customTokens: Record<string, TokenData[]> = JSON.parse(existingCustomTokens)
    console.log(customTokens)
    console.log(customTokens[chainId])
    if (customTokens[chainId]) {
      const updatedList = customTokens[chainId].filter((token) => token.address !== address)
      console.log(updatedList)
      console.log(address)
      const updatedTokens = {
        ...customTokens,
        [chainId]: updatedList,
      }
      console.log(updatedTokens)
      stateOfTokenList.customTokenList = updatedList
      localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens))
    }
  }
}

export const saveInitialCustomTokens = () => {
  const customTokens: Record<string, TokenData[]> = {
    [DEFAULT_CHAIN_ID_HEX]: DEMO_CUSTOM_TOKENS_BSC_MAINNET,
  }
  localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
}

export const initTokenList = (chainIdHex?: ChainIDHex) => {
  // remove in production
  saveInitialCustomTokens()

  const chosenChainIdHex = chainIdHex || DEFAULT_CHAIN_ID_HEX
  stateOfTokenList.defaultTokenList = tokenMap[chosenChainIdHex] || []
  stateOfTokenList.customTokenList = getCustomTokensList(chosenChainIdHex)
}
