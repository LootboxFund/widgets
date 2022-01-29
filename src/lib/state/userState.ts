import { ChainInfo } from 'lib/hooks/constants'
import { Address, URL } from 'lib/types/baseTypes'
import { proxy } from 'valtio'

interface UserState {
  accounts: string[]
  currentAccount: Address | undefined
  currentNetworkIdHex: string | undefined
  currentNetworkIdDecimal: string | undefined
  currentNetworkName: string | undefined
  currentNetworkDisplayName: string | undefined
  currentNetworkLogo: URL | undefined
}
const initialUserState: UserState = {
  accounts: [],
  currentAccount: undefined,
  currentNetworkIdHex: undefined,
  currentNetworkIdDecimal: undefined,
  currentNetworkName: undefined,
  currentNetworkDisplayName: undefined,
  currentNetworkLogo: undefined,
}
export const userState = proxy(initialUserState)
