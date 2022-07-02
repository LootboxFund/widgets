import { Address } from '@wormgraph/helpers'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'

export const generateAuthSignatureMessage = (address: Address, nonce: string) => {
  return `Welcome! Sign this message to login to Lootbox. This doesn't cost you anything and is free of any gas fees.\nAddress: ${address}\nNonce: ${nonce}\n`
}

export const generateWhitelistQueryMessage = (address: Address, partyBasketAddress: Address, nonce: string) => {
  return `Sign this message to see if you can redeem a FREE NFT from Lootbox! This doesn't cost you anything and is free of any gas fees.\nAddress: ${address}\nParty Basket: ${partyBasketAddress}\nNonce: ${nonce}\n`
}

export const getAuthSignature = async (
  currentAccount: Address,
  metamask: any
): Promise<{ signature: string; message: string }> => {
  if (!currentAccount) {
    throw new Error('Please connect your wallet with MetaMask')
  }
  if (!metamask) {
    throw new Error(`Please install MetaMask`)
  }

  const checksumAddress = ethers.utils.getAddress(currentAccount as unknown as string)
  const message = generateAuthSignatureMessage(checksumAddress as Address, uuidv4())
  // @ts-ignore metamask is not typed...
  const result = await metamask.request({
    method: 'personal_sign',
    params: [message, currentAccount],
  })
  return { signature: result, message }
}

interface GetPartyBasketWhitelistSignatureArgs {
  partyBasketAddress: Address
  currentAccount: Address
  metamask: any
}
export const getWhitelistQuerySignature = async ({
  partyBasketAddress,
  currentAccount,
  metamask,
}: GetPartyBasketWhitelistSignatureArgs): Promise<{ signature: string; message: string }> => {
  if (!currentAccount) {
    throw new Error('Please connect your wallet with MetaMask')
  }
  if (!metamask) {
    throw new Error(`Please install MetaMask`)
  }

  const checksumAddress = ethers.utils.getAddress(currentAccount as unknown as string)
  const message = generateWhitelistQueryMessage(checksumAddress as Address, partyBasketAddress, uuidv4())
  // @ts-ignore metamask is not typed...
  const result = await metamask.request({
    method: 'personal_sign',
    params: [message, currentAccount],
  })
  return { signature: result, message }
}
