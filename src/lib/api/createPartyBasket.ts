import { ethers as ethersObj } from 'ethers'
import { SubmitStatus } from 'lib/components/CreateLootbox/StepTermsConditions'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { manifest } from '../../manifest'
import { v4 as uuidv4 } from 'uuid'
import { uploadLootboxLogo, uploadLootboxCover, uploadLootboxBadge } from 'lib/api/firebase/storage'
import { Address, ChainIDHex, ContractAddress } from '@wormgraph/helpers'
import { decodeEVMLog } from 'lib/api/evm'
import LogRocket from 'logrocket'
import LOOTBOX_INSTANT_FACTORY_ABI from 'lib/abi/LootboxInstantFactory.json'
import LOOTBOX_ESCROW_FACTORY_ABI from 'lib/abi/LootboxEscrowFactory.json'
import PARTY_BASKET_FACTORY_ABI from 'lib/abi/PartyBasketFactory.json'
import { TournamentID } from 'lib/types'
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
      console.log('hit log', log)
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
      console.log('decodedlog', decodedLog)

      const { partyBasket, issuer, name, lootboxAddress } = decodedLog as any

      if (issuer === args.admin) {
        console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created a Party Basket!
          Party Basket Address: ${partyBasket}
  
          ---------------
          
          `)
        console.log('calling callback')
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
