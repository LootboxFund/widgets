import { Address } from '@wormgraph/helpers'
import { ethers, ethers as ethersObj } from 'ethers'
import PARTY_BASKET_ABI from 'lib/abi/PartyBasket.json'
import { decodeEVMLog } from './evm'

interface RedeemNFTPayload {
  provider?: ethersObj.providers.Web3Provider
  args: {
    partyBasketAddress: Address
    signature: string
    nonce: string
  }
  onSuccessCallback: (data: any) => Promise<void>
}
export const redeemNFT = async ({ args, provider, onSuccessCallback }: RedeemNFTPayload) => {
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

    partyBasketAddress: ${args.partyBasketAddress}
    nonce: ${args.nonce}

    currentAccount: ${currentAccount}

  `)

  const partyBasket = new ethers.Contract(args.partyBasketAddress, PARTY_BASKET_ABI, signer)

  const tx = await partyBasket.redeemBounty(args.signature, args.nonce)

  const blockNum = await provider.getBlockNumber()

  const filter = {
    fromBlock: blockNum,
    address: partyBasket.address,
    topics: [ethers.utils.solidityKeccak256(['string'], ['BountyRedeemed(address,address,address,uint256'])],
  }

  //   event BountyRedeemed(address bountyHolder, address indexed bountyReceiver, address indexed lootboxAddress, uint256 ticket);

  provider.on(filter, async (log) => {
    if (log !== undefined) {
      const decodedLog = decodeEVMLog({
        eventName: 'BountyRedeemed',
        log: log,
        abi: `
            event BountyRedeemed(
              address bountyHolder,
              address indexed bountyReceiver,
              address indexed lootboxAddress,
              uint256 ticket
            )`,
        keys: ['bountyHolder', 'bountyReceiver', 'lootboxAddress', 'ticket'],
      })

      const { bountyHolder, bountyReceiver, lootboxAddress, ticket } = decodedLog as any

      if (bountyHolder === args.partyBasketAddress && bountyReceiver === currentAccount) {
        console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've redeemed your NFT!

          Ticket: ${ticket}
          Lootbox: ${lootboxAddress}
          Party Basket Address: ${bountyHolder}
  
          ---------------
          
          `)
        await onSuccessCallback({})
        provider.removeAllListeners(filter)
      }
    }
  })
  await tx.wait()
}
