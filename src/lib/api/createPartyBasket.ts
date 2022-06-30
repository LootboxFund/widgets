import { ethers as ethersObj } from 'ethers'
import { manifest } from '../../manifest'
import { Address, ChainIDHex, ContractAddress } from '@wormgraph/helpers'
import { decodeEVMLog } from 'lib/api/evm'
import PARTY_BASKET_FACTORY_ABI from 'lib/abi/PartyBasketFactory.json'
import { CreatePartyBasketPayload, LootboxMetadata, MutationCreatePartyBasketArgs } from './graphql/generated/types'

interface PartyBasketArgs {
  name: string
  lootboxAddress: Address
  admin: Address
}

export const createPartyBasket = async (
  provider: ethersObj.providers.Web3Provider | undefined,
  args: PartyBasketArgs,
  onSuccessCallback: (data: CreatePartyBasketPayload) => Promise<void>,
  chainIdHex: ChainIDHex
) => {
  const chain = manifest.chains.find((chainRaw) => chainRaw.chainIdHex === chainIdHex)
  if (!chain) {
    throw new Error(`Chain not found for chainIdHex: ${chainIdHex}`)
  }

  const FACTORY_ADDRESS = manifest.lootbox.contracts[chainIdHex]?.PartyBasketFactory
    ?.address as unknown as ContractAddress

  if (!FACTORY_ADDRESS) {
    throw new Error('Could not find factory address')
  }

  if (!provider) {
    throw new Error('No provider')
  }

  const blockNum = await provider.getBlockNumber()

  const ethers = ethersObj
  const signer = await provider.getSigner()
  const partyBasketFactory = new ethers.Contract(FACTORY_ADDRESS, PARTY_BASKET_FACTORY_ABI, signer)

  console.log(`

        name: ${args.name}
        lootboxAddress: ${args.lootboxAddress}
        admin: ${args.admin}

    `)

  const tx = await partyBasketFactory.createPartyBasket(args.name, args.lootboxAddress, args.admin)

  console.log(`Submitted party basket creation!`)

  const filter = {
    fromBlock: blockNum,
    address: partyBasketFactory.address,
    topics: [ethers.utils.solidityKeccak256(['string'], ['PartyBasketCreated(address,address,string,address)'])],
  }
  provider.on(filter, async (log) => {
    if (log !== undefined) {
      const decodedLog = decodeEVMLog({
        eventName: 'PartyBasketCreated',
        log: log,
        abi: `
          event PartyBasketCreated(
            address indexed partyBasket,
            address indexed issuer,
            string name,
            address lootboxAddress
          )`,
        // TODO: lootboxAddress is indexed
        //   abi: `
        //   event PartyBasketCreated(
        //     address indexed partyBasket,
        //     address indexed issuer,
        //     string name,
        //     address indexed lootboxAddress
        //   )`,
        keys: ['partyBasket', 'issuer', 'name', 'lootboxAddress'],
      })

      const { partyBasket, issuer, name, lootboxAddress } = decodedLog as any

      if (issuer === args.admin) {
        console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created a Party Basket!
          Party Basket Address: ${partyBasket}
  
          ---------------
          
          `)
        await onSuccessCallback({
          name: name,
          address: partyBasket,
          factory: FACTORY_ADDRESS,
          chainIdHex: chainIdHex,
          lootboxAddress: lootboxAddress,
          creatorAddress: issuer,
        })
        provider.removeAllListeners(filter)
      }
    }
  })
  await tx.wait()
}
