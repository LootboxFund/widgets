import BN from 'bignumber.js'

const DEFAULT_DECIMALS = 18

export const parseWei = (amount: string, decimals?: number | undefined): string => {
  if (decimals == undefined) {
    decimals = DEFAULT_DECIMALS
  }
  return new BN(amount).multipliedBy(new BN(10).pow(decimals)).toFixed(0) // Zero decimal places
}

export const parseEth = (amount: string, decimals?: number | undefined, maxLen?: number): string => {
  if (decimals == undefined) {
    decimals = DEFAULT_DECIMALS
  }
  const valueBN = new BN(amount).dividedBy(new BN(10).pow(decimals)).decimalPlaces(6)

  if (!maxLen) {
    return valueBN.toString()
  }

  const res = valueBN.toString()?.length > maxLen ? valueBN.toExponential(6) : valueBN.toString()

  return res
}
