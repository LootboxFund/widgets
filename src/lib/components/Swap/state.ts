
import { TokenData } from 'lib/hooks/constants'
import { CUSTOM_TOKEN_STORAGE_KEY } from 'lib/state/localStorage'
import { proxy, subscribe } from 'valtio'

export type SwapRoute = '/swap' | '/search' | '/add' | '/customs' | '/settings'
export type TokenPickerTarget = 'inputToken' | 'outputToken' | null
export interface SwapState {
	route: SwapRoute
	targetToken: TokenPickerTarget
	inputToken: {
		data: TokenData | undefined;
		quantity: number | undefined;
	}
	outputToken: {
		data: TokenData | undefined;
		quantity: number | undefined;
	}
}
const swapSnapshot: SwapState = {
	route: '/swap',
	targetToken: null,
	inputToken: {
		data: undefined,
		quantity: undefined,
	},
	outputToken: {
		data: undefined,
		quantity: undefined,
	}
}
export const stateOfSwap = proxy(swapSnapshot)

subscribe(stateOfSwap.inputToken, () => {
	updateOutputTokenValues()
})
subscribe(stateOfSwap.outputToken, () => {
	updateOutputTokenValues()
})
const updateOutputTokenValues = () => {
	if (stateOfSwap.outputToken.data && stateOfSwap.inputToken.data && stateOfSwap.inputToken.quantity !== undefined) {
		const inputTokenPrice = stateOfSwap.inputToken.data.usdPrice || 1
		const outputTokenPrice = stateOfSwap.outputToken.data.usdPrice || 1
		stateOfSwap.outputToken.quantity = stateOfSwap.inputToken.quantity * inputTokenPrice / outputTokenPrice
	}
}
