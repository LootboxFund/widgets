
import { Address, URL } from 'lib/types/baseTypes'
import { proxy } from 'valtio'

interface UserState {
	accounts: string[],
	currentAccount: Address | undefined,
	currentNetworkId: number,
	currentNetworkName: string,
	currentNetworkLogo: URL,
	displayedBalance: string,
}
const initialUserState: UserState = {
	accounts: [],
	currentAccount: undefined,
	currentNetworkId: 56,
	currentNetworkName: "Binance Smart Chain",
	currentNetworkLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
	displayedBalance: "",
}
export const userState = proxy(initialUserState)