import { Address, LootboxTicketID_Web3 } from '@wormgraph/helpers'
import { ethers, ethers as ethersObj } from 'ethers'
import PARTY_BASKET_ABI from 'lib/abi/PartyBasket.json'
import { decodeEVMLog } from './evm'
import LOOTBOX_COSMIC_ABI from '@wormgraph/helpers/lib/abi/LootboxCosmic.json'
import { getProvider } from 'lib/hooks/useWeb3Api'

interface RedeemNFTPayload {
  provider?: ethersObj.providers.Web3Provider
  args: {
    partyBasketAddress: Address
    signature: string
    nonce: string
  }
  //   onSuccessCallback: (data: any) => Promise<void>
}
/** @deprecated */
export const redeemNFT = async ({ args, provider }: RedeemNFTPayload): Promise<string> => {
  if (!provider) {
    throw new Error('No provider. Please login with MetaMask.')
  }
  const signer = provider.getSigner()
  const currentAccount = signer ? await signer.getAddress() : undefined

  if (!signer || !currentAccount) {
    throw new Error('Please login with MetaMask.')
  }

  const blockNum = await provider.getBlockNumber()

  console.log(`

    Submitting redeemNFT transaction...

    partyBasketAddress: ${args.partyBasketAddress}
    nonce: ${args.nonce}

    currentAccount: ${currentAccount}

    blockNum: ${blockNum}

  `)

  const partyBasket = new ethers.Contract(args.partyBasketAddress, PARTY_BASKET_ABI, signer)

  const tx = await partyBasket.redeemBounty(args.signature, args.nonce)

  console.log('transaction', tx)
  console.log('waiting....')

  await tx.wait()

  return tx.hash
}

interface WithdrawCosmicNFTPayload {
  lootboxAddress: Address
  ticketID: LootboxTicketID_Web3
}
export const withdrawCosmic = async ({ lootboxAddress, ticketID }: WithdrawCosmicNFTPayload): Promise<string> => {
  const { provider } = await getProvider()
  if (!provider) {
    throw new Error('No provider. Please login with MetaMask.')
  }
  const signer = provider.getSigner()
  const currentAccount = signer ? await signer.getAddress() : undefined

  if (!signer || !currentAccount) {
    throw new Error('Please login with MetaMask.')
  }

  console.log(`

    Submitting redeemNFT transaction...

    lootboxAddress: ${lootboxAddress}
    ticketID: ${ticketID}
    currentAccount: ${currentAccount}

  `)

  const lootbox = new ethers.Contract(lootboxAddress, LOOTBOX_COSMIC_ABI, signer)

  const tx = await lootbox.connect(signer).withdrawEarnings(ticketID)

  console.log('transaction', tx)
  console.log('waiting....')

  await tx.wait()

  return tx.hash
}
