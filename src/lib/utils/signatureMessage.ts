import { Address } from '@wormgraph/helpers'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'

export const generateAuthSignatureMessage = (message: string, address: Address, nonce: string) => {
  // return `Welcome! Sign this message to login to Lootbox. This doesn't cost you anything and is free of any gas fees.\nAddress: ${address}\nNonce: ${nonce}\n`
  return `${message}\nAddress: ${address}\nNonce: ${nonce}\n`
}

export const generateWhitelistQueryMessage = (
  message: string,
  address: Address,
  partyBasketAddress: Address,
  nonce: string
) => {
  return `${message}\nAddress: ${address}\nParty Basket: ${partyBasketAddress}\nNonce: ${nonce}\n`
}
