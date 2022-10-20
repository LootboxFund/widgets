import LootboxCosmicABI from '@wormgraph/helpers/lib/abi/LootboxCosmic.json'
import {
  Address,
  ChainIDHex,
  LootboxMintSignatureNonce,
  LootboxTicketDigest,
  LootboxTicketID_Web3,
} from '@wormgraph/helpers'
import { Contract, ContractTransaction, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { NATIVE_ADDRESS } from 'lib/hooks/constants'
import { useProvider, useReadOnlyProvider } from '../useWeb3Api'
import { startLootboxOnMintListener } from 'lib/api/firebase/functions'
import { promiseChainDelay } from 'lib/utils/promise'
import { DepositFragment, Deposit, convertDepositFragmentToDeposit } from './utils'

interface UseLootboxResult {
  lootbox: Contract | null
  provider: providers.JsonRpcProvider | null
  status: UseLootboxStatus
  proratedDeposits: TicketToDepositMapping
  deposits: Deposit[]
  lastTx?: ContractTransaction
  loadProratedDepositsIntoState: (ticketID: LootboxTicketID_Web3) => void
  getLootboxDeposits: () => Promise<Deposit[]>
  loadAllDepositsIntoState: () => Promise<void>
  mintTicket: (
    signature: string,
    nonce: LootboxMintSignatureNonce,
    digest: LootboxTicketDigest
  ) => Promise<ContractTransaction>
  withdrawCosmic: (ticketID: LootboxTicketID_Web3) => Promise<ContractTransaction>
}

interface UseLootboxParams {
  chainIDHex: ChainIDHex
  lootboxAddress: Address
}

export interface TicketToDepositMapping {
  [key: LootboxTicketID_Web3]: Deposit[]
}
type UseLootboxStatus = 'loading' | 'pending-wallet' | 'ready'
export const useLootbox = ({ lootboxAddress, chainIDHex }: UseLootboxParams): UseLootboxResult => {
  const [injectedProvider] = useProvider()
  const { provider } = useReadOnlyProvider({ chainIDHex })
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [proratedDeposits, setProratedDeposits] = useState<TicketToDepositMapping>({})
  const [status, setStatus] = useState<UseLootboxStatus>('ready')
  const [lastTx, setLastTx] = useState<ContractTransaction>()

  const lootbox = useMemo(() => {
    if (!provider || !lootboxAddress) {
      return null
    }

    return new Contract(lootboxAddress, LootboxCosmicABI, provider)
  }, [provider, lootboxAddress])

  const getLootboxDeposits = async (): Promise<Deposit[]> => {
    if (!lootbox) {
      return []
    }

    setStatus('loading')
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
      const fullDeposits = await promiseChainDelay(res.map(convertDepositFragmentToDeposit))
      return fullDeposits
    } catch (err) {
      console.error('Error loading deposits', err)
      return []
    } finally {
      setStatus('ready')
    }
  }

  const loadProratedDeposits = async (ticketID: LootboxTicketID_Web3): Promise<Deposit[]> => {
    if (!lootbox) {
      return []
    }

    setStatus('loading')
    try {
      const _deposits = (await lootbox.viewProratedDepositsForTicket(ticketID)) || []

      const frags: DepositFragment[] = []
      for (let deposit of _deposits) {
        if (deposit?.nativeTokenAmount && deposit?.nativeTokenAmount?.gt('0')) {
          frags.push({
            tokenAddress: NATIVE_ADDRESS,
            tokenAmount: deposit.nativeTokenAmount.toString(),
            isRedeemed: deposit.redeemed,
          })
        }
        if (deposit?.erc20TokenAmount && deposit?.erc20TokenAmount?.gt('0')) {
          frags.push({
            tokenAddress: deposit.erc20Token,
            tokenAmount: deposit.erc20TokenAmount.toString(),
            isRedeemed: deposit.redeemed,
          })
        }
      }

      const fullDeposits: Deposit[] = await promiseChainDelay(frags.map(convertDepositFragmentToDeposit))

      fullDeposits.sort((a, b) => {
        if (a.isRedeemed && b.isRedeemed) {
          return 0
        } else {
          return a.isRedeemed ? 1 : -1
        }
      })

      return fullDeposits
    } catch (err: any) {
      console.error('Err reading deposits', err)
      return []
    } finally {
      setStatus('ready')
    }
  }

  const loadProratedDepositsIntoState = async (ticketID: LootboxTicketID_Web3): Promise<void> => {
    const deposits = await loadProratedDeposits(ticketID)
    setProratedDeposits({ ...proratedDeposits, [ticketID]: deposits })
  }

  const loadAllDepositsIntoState = async (): Promise<void> => {
    const deposits = await getLootboxDeposits()
    setDeposits(deposits)
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
    const currentAccount = signer ? await signer.getAddress() : undefined

    if (!signer || !currentAccount) {
      throw new Error('Please login with MetaMask.')
    }

    setStatus('pending-wallet')
    try {
      const blockNum = await injectedProvider.getBlockNumber()
      const tx = (await lootbox.connect(signer).mint(signature, nonce)) as ContractTransaction
      setLastTx(tx)
      setStatus('loading')
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
      setStatus('ready')
    }
  }

  const withdrawCosmic = async (ticketID: LootboxTicketID_Web3): Promise<ContractTransaction> => {
    if (!lootbox || !injectedProvider) {
      throw new Error('No lootbox or signer provider')
    }

    const signer = injectedProvider.getSigner()
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
    setStatus('pending-wallet')
    try {
      const tx = await lootbox.connect(signer).withdrawEarnings(ticketID)
      setLastTx(tx)
      setStatus('loading')

      await tx.wait()

      return tx
    } catch (err) {
      throw err
    } finally {
      setStatus('ready')
    }
  }

  return {
    lootbox,
    provider,
    status,
    proratedDeposits,
    deposits,
    lastTx,
    mintTicket,
    loadProratedDepositsIntoState,
    getLootboxDeposits,
    loadAllDepositsIntoState,
    withdrawCosmic,
  }
}
