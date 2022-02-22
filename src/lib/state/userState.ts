import { ChainInfo } from 'lib/hooks/constants'
import { proxy } from 'valtio'
import { Address, Url } from '@lootboxfund/helpers';

interface UserState {
  accounts: Address[]
  currentAccount: Address | undefined
  network: {
    currentNetworkIdHex: string | undefined
    currentNetworkIdDecimal: string | undefined
    currentNetworkName: string | undefined
    currentNetworkDisplayName: string | undefined
    currentNetworkLogo: Url | undefined
  }
}
const initialUserState: UserState = {
  accounts: [],
  currentAccount: undefined,
  network: {
    currentNetworkIdHex: undefined,
    currentNetworkIdDecimal: undefined,
    currentNetworkName: undefined,
    currentNetworkDisplayName: undefined,
    currentNetworkLogo: undefined,
  },
}
export const userState = proxy(initialUserState)
