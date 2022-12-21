import { Address } from '@wormgraph/helpers'

export const generateAuthSignatureMessage = (message: string, address: Address, nonce: string) => {
  // return `Welcome! Sign this message to login to Lootbox. This doesn't cost you anything and is free of any gas fees.\nAddress: ${address}\nNonce: ${nonce}\n`
  return `${message}\nAddress: ${address}\nNonce: ${nonce}\n`
}
