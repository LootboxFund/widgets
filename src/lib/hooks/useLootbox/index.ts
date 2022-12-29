import LootboxCosmicABI from '@wormgraph/helpers/lib/abi/LootboxCosmic.json'
import {
  Address,
  ChainIDHex,
  ClaimID,
  LootboxID,
  LootboxMintSignatureNonce,
  LootboxTicketDigest,
  LootboxTicketID,
  LootboxTicketID_Web3,
} from '@wormgraph/helpers'
import { Contract, ContractTransaction, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { NATIVE_ADDRESS } from 'lib/hooks/constants'
import { useProvider, useReadOnlyProvider } from '../useWeb3Api'
import { startLootboxOnMintListener } from 'lib/api/firebase/functions'
import { promiseChainDelay } from 'lib/utils/promise'
import {
  Web3DepositFragment,
  Deposit,
  convertWeb3DepositFragmentToDeposit,
  Web3Deposit,
  convertVoucherBatchToDeposit,
} from './utils'
import { useLazyQuery, useMutation, LazyQueryExecFunction } from '@apollo/client'
import { UPDATE_CLAIM_REDEMPTION_STATUS } from 'lib/components/RedeemCosmicLootbox/api.gql'
import {
  ClaimRedemptionStatus,
  GetLootboxDepositsResponse,
  MutationUpdateClaimRedemptionStatusArgs,
  QueryGetLootboxDepositsArgs,
  ResponseError,
  UpdateClaimRedemptionStatusResponse,
} from 'lib/api/graphql/generated/types'
import { GET_VOUCHER_DEPOSITS } from './api.gql'

interface UseLootboxResult {
  lootbox: Contract | null
  provider: providers.JsonRpcProvider | null
  status: UseLootboxStatus
  proratedDeposits: TicketToDepositMapping
  deposits: Deposit[]
  lastTx?: ContractTransaction
  loadProratedDepositsIntoState: (
    w2TicketID: LootboxTicketID,
    w3TicketID: LootboxTicketID_Web3,
    lootboxID: LootboxID
  ) => void
  loadAllDepositsIntoState: () => Promise<void>
  mintTicket: (
    signature: string,
    nonce: LootboxMintSignatureNonce,
    digest: LootboxTicketDigest,
    lootboxTicketID?: LootboxTicketID
  ) => Promise<ContractTransaction>
  withdrawCosmic: (ticketID: LootboxTicketID_Web3, claimID: ClaimID) => Promise<ContractTransaction>
}

interface UseLootboxParams {
  chainIDHex?: ChainIDHex
  lootboxAddress?: Address
  lootboxID?: LootboxID
}

export interface TicketToDepositMapping {
  [key: LootboxTicketID_Web3]: Deposit[]
}
type UseLootboxStatus = 'loading' | 'pending-wallet' | 'ready'
export const useLootbox = ({ lootboxAddress, chainIDHex, lootboxID }: UseLootboxParams): UseLootboxResult => {
  const [injectedProvider] = useProvider()
  const { provider } = useReadOnlyProvider({ chainIDHex })
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [proratedDeposits, setProratedDeposits] = useState<TicketToDepositMapping>({})
  const [status, setStatus] = useState<UseLootboxStatus>('ready')
  const [lastTx, setLastTx] = useState<ContractTransaction>()
  const [getVoucherDeposits] = useLazyQuery<
    { getLootboxDeposits: ResponseError | GetLootboxDepositsResponse },
    QueryGetLootboxDepositsArgs
  >(GET_VOUCHER_DEPOSITS)
  const [updateClaimRedemptionStatus] = useMutation<
    { updateClaimRedemptionStatus: ResponseError | UpdateClaimRedemptionStatusResponse },
    MutationUpdateClaimRedemptionStatusArgs
  >(UPDATE_CLAIM_REDEMPTION_STATUS)

  const lootbox = useMemo(() => {
    if (!provider || !lootboxAddress) {
      return null
    }

    return new Contract(lootboxAddress, LootboxCosmicABI, provider)
  }, [provider, lootboxAddress])

  const getLootboxWeb3Deposits = async (): Promise<Deposit[]> => {
    if (!lootbox) {
      return []
    }

    setStatus('loading')
    try {
      const deposits = await lootbox.viewAllDeposits()

      const res: Web3DepositFragment[] = []
      for (let deposit of deposits) {
        if (deposit?.nativeTokenAmount && deposit?.nativeTokenAmount?.gt('0')) {
          res.push({
            tokenAddress: NATIVE_ADDRESS,
            tokenAmount: deposit.nativeTokenAmount.toString(),
            isRedeemed: deposit.redeemed,
            network: deposit.network,
          })
        }
        if (deposit?.erc20TokenAmount && deposit?.erc20TokenAmount?.gt('0')) {
          res.push({
            tokenAddress: deposit.erc20Token,
            tokenAmount: deposit.erc20TokenAmount.toString(),
            isRedeemed: deposit.redeemed,
            network: deposit.network,
          })
        }
      }
      const fullDeposits = await promiseChainDelay(res.map(convertWeb3DepositFragmentToDeposit))
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

      const frags: Web3DepositFragment[] = []
      for (let deposit of _deposits) {
        if (deposit?.nativeTokenAmount && deposit?.nativeTokenAmount?.gt('0')) {
          frags.push({
            tokenAddress: NATIVE_ADDRESS,
            tokenAmount: deposit.nativeTokenAmount.toString(),
            isRedeemed: deposit.redeemed,
            network: deposit.network,
          })
        }
        if (deposit?.erc20TokenAmount && deposit?.erc20TokenAmount?.gt('0')) {
          frags.push({
            tokenAddress: deposit.erc20Token,
            tokenAmount: deposit.erc20TokenAmount.toString(),
            isRedeemed: deposit.redeemed,
            network: deposit.network,
          })
        }
      }

      const fullDeposits: Deposit[] = await promiseChainDelay(frags.map(convertWeb3DepositFragmentToDeposit))

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

  const loadProratedDepositsIntoState = async (
    w2TicketID: LootboxTicketID,
    w3TicketID: LootboxTicketID_Web3,
    lootboxID: LootboxID
  ): Promise<void> => {
    // handle web3 deposits
    const web3Deposits = await loadProratedDeposits(w3TicketID)
    // handle web2 deposits
    const { data } = await getVoucherDeposits({ variables: { lootboxID: lootboxID } })
    const web2ProratedVouchers: Deposit[] = []
    if (data?.getLootboxDeposits.__typename === 'GetLootboxDepositsResponseSuccess') {
      const { getLootboxDeposits } = data
      const vouchers = getLootboxDeposits.deposits
      web2ProratedVouchers.push(...vouchers.map((v) => convertVoucherBatchToDeposit(v)))
    }
    //
    const deposits = [...web3Deposits, ...web2ProratedVouchers]
    setProratedDeposits({ ...proratedDeposits, [w3TicketID]: deposits })
  }

  const loadAllDepositsIntoState = async (): Promise<void> => {
    const allDeposits: Deposit[] = []
    const web3Deposits = await getLootboxWeb3Deposits()
    allDeposits.push(...web3Deposits)
    if (lootboxID) {
      const { data } = await getVoucherDeposits({ variables: { lootboxID: lootboxID } })

      if (data?.getLootboxDeposits.__typename === 'GetLootboxDepositsResponseSuccess') {
        const { getLootboxDeposits } = data
        const vouchers = getLootboxDeposits.deposits
        allDeposits.push(...vouchers.map((v) => convertVoucherBatchToDeposit(v)))
      }
    }
    setDeposits(allDeposits)
  }

  /**
   * Mint a lootbox ticket given a whitelisted signature & nonce
   * This will throw if shit is fucked
   */
  const mintTicket = async (
    signature: string,
    nonce: LootboxMintSignatureNonce,
    digest: LootboxTicketDigest,
    lootboxTicketID?: LootboxTicketID
  ): Promise<ContractTransaction> => {
    if (!lootbox || !injectedProvider || !lootboxAddress || !chainIDHex) {
      throw new Error('No lootbox or signer provider')
    }

    const signer = injectedProvider.getSigner()
    const currentAccount = signer ? await signer.getAddress() : undefined

    if (!signer || !currentAccount) {
      throw new Error('Please login with MetaMask.')
    }

    setStatus('pending-wallet')

    try {
      setStatus('loading')
      const blockNum = await injectedProvider.getBlockNumber()
      // Call mint ticket enqueued task
      console.log('enqueing on mint: ', {
        fromBlock: blockNum,
        lootboxAddress: lootboxAddress,
        nonce: nonce,
        chainIDHex: chainIDHex,
      })
      await startLootboxOnMintListener({
        fromBlock: blockNum,
        lootboxAddress: lootboxAddress,
        nonce: nonce,
        chainIDHex: chainIDHex,
        digest: digest,
        ticketID: lootboxTicketID,
      })
      console.log('Calling blockchain on mint')
      const tx = (await lootbox.connect(signer).mint(signature, nonce)) as ContractTransaction
      setLastTx(tx)
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

  const withdrawCosmic = async (ticketID: LootboxTicketID_Web3, claimID: ClaimID): Promise<ContractTransaction> => {
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
      await updateClaimRedemptionStatus({ variables: { payload: { claimID, status: ClaimRedemptionStatus.Rewarded } } })
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
    loadAllDepositsIntoState,
    withdrawCosmic,
  }
}
