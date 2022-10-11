import { Address } from '@wormgraph/helpers'
import { NATIVE_ADDRESS } from '../constants'
import { getERC20Decimal, getERC20Symbol } from '../useContract'
import { getTokenFromList } from '../useTokenList'

export interface DepositFragment {
  tokenAddress: Address
  tokenAmount: string
  isRedeemed: boolean
}

export interface Deposit extends DepositFragment {
  tokenSymbol: string
  decimal: string
}

export const convertDepositFragmentToDeposit = async (fragment: DepositFragment): Promise<Deposit> => {
  const nativeToken = getTokenFromList(NATIVE_ADDRESS)

  let symbol: string
  let decimal: string
  if (fragment.tokenAddress === NATIVE_ADDRESS) {
    symbol = nativeToken?.symbol || NATIVE_ADDRESS
    decimal = '18'
  } else {
    try {
      symbol = await getERC20Symbol(fragment.tokenAddress)
    } catch (err) {
      symbol = fragment.tokenAddress?.slice(0, 4) + '...' || ''
    }
    try {
      decimal = await getERC20Decimal(fragment.tokenAddress)
    } catch (err) {
      decimal = '18'
    }
  }
  return {
    tokenSymbol: symbol,
    tokenAmount: fragment.tokenAmount,
    tokenAddress: fragment.tokenAddress,
    isRedeemed: fragment.isRedeemed,
    decimal: decimal,
  }
}
