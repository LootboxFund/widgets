import { manifest } from 'manifest'
import LootboxCosmicABI from '@wormgraph/helpers/lib/abi/LootboxCosmic.json'
import {
  Address,
  AdEventNonce,
  ChainIDHex,
  ChainInfo,
  convertDecimalToHex,
  LootboxMintSignatureNonce,
  LootboxTicketDigest,
  LootboxTicketID_Web3,
} from '@wormgraph/helpers'
import { Contract, ContractTransaction, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CHAIN_ID_HEX, NATIVE_ADDRESS } from 'lib/hooks/constants'
import { useProvider, useReadOnlyProvider } from '../useWeb3Api'
import { startLootboxOnMintListener } from 'lib/api/firebase/functions'

interface useLootboxFactoryResult {
  lootbox: Contract | null
  provider: providers.JsonRpcProvider | null
  loading: boolean
  proratedDeposits: TicketToDepositMapping
  deposits: DepositFragment[]
  loadProratedDeposits: (ticketID: LootboxTicketID_Web3) => void
  getLootboxDeposits: () => Promise<DepositFragment[]>
  mintTicket: (
    signature: string,
    nonce: LootboxMintSignatureNonce,
    digest: LootboxTicketDigest
  ) => Promise<ContractTransaction>
}

interface UseLootboxParams {
  chainIDHex: ChainIDHex
  lootboxAddress: Address
}

export interface DepositFragment {
  tokenAddress: Address
  tokenAmount: Address
  isRedeemed: boolean
}

export interface TicketToDepositMapping {
  [key: LootboxTicketID_Web3]: DepositFragment[]
}

export const useLootbox = ({ lootboxAddress, chainIDHex }: UseLootboxParams): useLootboxFactoryResult => {
  const [loading, setLoading] = useState(false)
  const [injectedProvider] = useProvider()
  const { provider } = useReadOnlyProvider({ chainIDHex })
  const [deposits, setDeposits] = useState<DepositFragment[]>([])
  const [proratedDeposits, setProratedDeposits] = useState<TicketToDepositMapping>({})

  useEffect(() => {
    console.log('Lootbox Address change', lootboxAddress)
    // Reset the state
    // setProratedDeposits({})
    if (!!lootboxAddress) {
      getLootboxDeposits()
        .then((deposits) => {
          console.log('(callback) loaded ALL DEPOSITS', deposits)
          setDeposits([...deposits])
        })
        .catch((err) => console.error('Error loading deposits', err))
    }
  }, [lootboxAddress])

  const lootbox = useMemo(() => {
    if (!provider || !lootboxAddress) {
      return null
    }

    return new Contract(lootboxAddress, LootboxCosmicABI, provider)
  }, [provider, lootboxAddress])

  const getLootboxDeposits = async (): Promise<DepositFragment[]> => {
    console.log('loading all deposits', 'lootbox: ', lootbox?.address)

    if (!lootbox) {
      return []
    }

    setLoading(true)
    try {
      const deposits = await lootbox.viewAllDeposits()

      const res: DepositFragment[] = []
      for (let deposit of deposits) {
        if (deposit?.nativeTokenAmount && deposit?.nativeTokenAmount?.gt('0')) {
          res.push({
            tokenAddress: NATIVE_ADDRESS,
            tokenAmount: deposit.nativeTokenAmount.toString(),
            isRedeemed: deposit.redeemed,
          })
        }
        if (deposit?.erc20TokenAmount && deposit?.erc20TokenAmount?.gt('0')) {
          res.push({
            tokenAddress: deposit.erc20Token,
            tokenAmount: deposit.erc20TokenAmount.toString(),
            isRedeemed: deposit.redeemed,
          })
        }
      }
      console.log('loaded all deposits', res)
      return res
    } catch (err) {
      console.error('Error loading deposits', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  const loadProratedDeposits = (ticketID: LootboxTicketID_Web3) => {
    console.log('loading prorated deposits', ticketID, lootboxAddress)
    if (!lootbox) {
      return
    }

    setLoading(true)
    lootbox
      .viewProratedDepositsForTicket(ticketID)
      .then((deposits: any) => {
        const res: DepositFragment[] = []
        for (let deposit of deposits) {
          if (deposit?.nativeTokenAmount && deposit?.nativeTokenAmount?.gt('0')) {
            res.push({
              tokenAddress: NATIVE_ADDRESS,
              tokenAmount: deposit.nativeTokenAmount.toString(),
              isRedeemed: deposit.redeemed,
            })
          }
          if (deposit?.erc20TokenAmount && deposit?.erc20TokenAmount?.gt('0')) {
            res.push({
              tokenAddress: deposit.erc20Token,
              tokenAmount: deposit.erc20TokenAmount.toString(),
              isRedeemed: deposit.redeemed,
            })
          }
        }
        console.log('retrieved prorated deposits', ticketID, res)
        setProratedDeposits((prev) => {
          return {
            ...prev,
            [ticketID]: prev[ticketID] ? [...prev[ticketID], ...res] : [...res],
          }
        })
      })
      .catch((err: any) => {
        console.error('Err reading deposits', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * Mint a lootbox ticket given a whitelisted signature & nonce
   * This will throw if shit is fucked
   */
  const mintTicket = async (
    signature: string,
    nonce: LootboxMintSignatureNonce,
    digest: LootboxTicketDigest
  ): Promise<ContractTransaction> => {
    if (!lootbox || !injectedProvider) {
      throw new Error('No lootbox or signer provider')
    }

    const signer = injectedProvider.getSigner()

    // if (!provider) {
    //   throw new Error('No provider. Please login with MetaMask.')
    // }
    // const signer = provider.getSigner()
    const currentAccount = signer ? await signer.getAddress() : undefined

    if (!signer || !currentAccount) {
      throw new Error('Please login with MetaMask.')
    }

    console.log('minting...')
    setLoading(true)
    try {
      const blockNum = await injectedProvider.getBlockNumber()
      console.log(`
      
      Submitting mint transaction...

      Digest: ${digest}
      Nonce: ${nonce}
      Block Number: ${blockNum}
      Account: ${currentAccount}
      Lootbox: ${lootbox.address}

      
      `)
      const tx = (await lootbox.connect(signer).mint(signature, nonce)) as ContractTransaction
      console.log('Call backend... TODO...')
      // Call mint ticket enqueued task
      console.log('enqueing on mint: ', {
        fromBlock: blockNum,
        lootboxAddress: lootboxAddress,
        nonce: nonce,
        chainIDHex: chainIDHex,
      })
      startLootboxOnMintListener({
        fromBlock: blockNum,
        lootboxAddress: lootboxAddress,
        nonce: nonce,
        chainIDHex: chainIDHex,
        digest: digest,
      })

      console.log('awaiting...')
      await tx.wait()
      return tx
    } catch (err) {
      // THROW THE ERROR
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    lootbox,
    provider,
    loading,
    proratedDeposits,
    deposits,
    mintTicket,
    loadProratedDeposits,
    getLootboxDeposits,
  }
}
