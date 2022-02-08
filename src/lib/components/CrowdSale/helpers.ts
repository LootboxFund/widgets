import BN from 'bignumber.js'

const DEFAULT_DECIMALS = 18

export const parseWei = (amount: string, decimals: number | undefined): string => {
  if (decimals == undefined) {
    decimals = DEFAULT_DECIMALS
  }
  return new BN(amount).multipliedBy(new BN(10).pow(decimals)).toFixed(0) // Zero decimal places
}
