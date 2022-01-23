import uriToHttp from 'lib/utils/uriToHttp'
import { DEMO_CUSTOM_TOKENS_BSC_MAINNET, TokenData, tokenMap } from 'lib/hooks/constants'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import { DEFAULT_CHAIN_ID } from 'lib/state/valtio'


export const getCustomTokensList = (chainId: number) => {
	const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY)
	if (existingCustomTokens) {
		const customTokens: Record<string, TokenData[]> = JSON.parse(existingCustomTokens)
    if (customTokens[chainId] && customTokens[chainId].length > 0) {
      return customTokens[chainId]
    }
		return []
	}
	return []
}

interface TokenListState {
  chainId: number
  defaultTokenList: TokenData[]
  customTokenList: TokenData[]
}
const tokenListState: TokenListState = {
	chainId: 56,
  defaultTokenList: [],
  customTokenList: []
}

export const stateOfTokenList = proxy(tokenListState)

export const initializeTokenList = (chainId?: number) => {

  // remove in production
  saveInitialCustomTokens()
  
  const chosenChainId = chainId || DEFAULT_CHAIN_ID
  stateOfTokenList.chainId = chosenChainId;
  stateOfTokenList.defaultTokenList = tokenMap[chosenChainId] || [];
  stateOfTokenList.customTokenList = getCustomTokensList(chosenChainId);
}

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
			customTokens[data.chainId] = customTokens[data.chainId].filter(t => t.address !== data.address).concat([data])
		} else {
			customTokens[data.chainId] = [data]
		}
    stateOfTokenList.customTokenList = customTokens[data.chainId];
		localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
	} else {
		const customTokens: Record<string, TokenData[]> = {
			[data.chainId]: [data]
		}
    stateOfTokenList.customTokenList = customTokens[data.chainId];
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
      const updatedList = customTokens[chainId].filter(token => token.address !== address)
      console.log(updatedList)
      console.log(address)
			const updatedTokens = {
        ...customTokens,
        [chainId]: updatedList
      }
      console.log(updatedTokens)
      stateOfTokenList.customTokenList = updatedList
			localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens))
		}
	}
}

const saveInitialCustomTokens = () => {
  const customTokens: Record<string, TokenData[]> = {
    [DEFAULT_CHAIN_ID]: DEMO_CUSTOM_TOKENS_BSC_MAINNET
  }
  localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens))
}