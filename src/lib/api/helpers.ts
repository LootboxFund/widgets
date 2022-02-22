import { Address } from '@lootboxfund/helpers'

export const truncateAddress = (address: Address, decorator?: { prefixLength: number; suffixLength: number }) => {
  const prefixLength = decorator?.prefixLength || 4
  const suffixLength = decorator?.suffixLength || 5
  return `${address.slice(0, prefixLength)}...${address.slice(address.length - suffixLength, address.length)}`
}
