import { Address, DepositID, VoucherRewardID } from '@wormgraph/helpers'
import { LootboxVoucherDeposits } from 'lib/api/graphql/generated/types'
import { parseEth } from 'lib/utils/bnConversion'
import { NATIVE_ADDRESS } from '../constants'
import { getERC20Decimal, getERC20Symbol } from '../useContract'
import { getTokenFromList } from '../useTokenList'

export interface Web3DepositFragment {
  tokenAddress: Address
  tokenAmount: string
  isRedeemed: boolean
  network: string
}

export interface Web3Deposit extends Web3DepositFragment {
  tokenSymbol: string
  decimal: string
}

export interface VoucherDeposit {
  title: string
  code: string
  link: string
  createdAt: string
}

export interface VoucherBatchDeposit {
  title: string
  createdAt: string
  hasReuseableVoucher: boolean
  id: DepositID
  oneTimeVouchersCount: number
}

export interface Deposit {
  id: DepositID
  title: string
  isRedeemed: boolean
  voucherMetadata?: VoucherBatchDeposit
  web3Metadata?: Web3Deposit
}

export const convertWeb3DepositFragmentToDeposit = async (fragment: Web3DepositFragment): Promise<Deposit> => {
  console.log(`fragment---> `, fragment)
  const nativeToken = getTokenFromList(NATIVE_ADDRESS)

  let symbol: string
  let decimal: string
  if (fragment.tokenAddress === NATIVE_ADDRESS) {
    symbol = nativeToken?.symbol || NATIVE_ADDRESS
    decimal = '18'
  } else {
    try {
      symbol = await getERC20Symbol(fragment.tokenAddress)
    } catch (err) {
      symbol = fragment.tokenAddress?.slice(0, 4) + '...' || ''
    }
    try {
      decimal = await getERC20Decimal(fragment.tokenAddress)
    } catch (err) {
      decimal = '18'
    }
  }
  const title = `${parseEth(fragment.tokenAmount, Number(decimal), 22)} ${symbol}`

  return {
    id: `${fragment.tokenAddress}+${fragment.tokenAmount}` as DepositID,
    title,
    isRedeemed: fragment.isRedeemed,
    web3Metadata: {
      tokenSymbol: symbol,
      tokenAmount: fragment.tokenAmount,
      tokenAddress: fragment.tokenAddress,
      decimal: decimal,
      isRedeemed: fragment.isRedeemed,
      network: fragment.network,
    },
  }
}

export const convertVoucherBatchToDeposit = (voucherBatch: LootboxVoucherDeposits): Deposit => {
  return {
    id: voucherBatch.id as DepositID,
    title: voucherBatch.title,
    isRedeemed: voucherBatch.isRedeemed || false,
    voucherMetadata: {
      title: voucherBatch.title,
      createdAt: voucherBatch.createdAt,
      hasReuseableVoucher: voucherBatch.hasReuseableVoucher,
      id: voucherBatch.id as DepositID,
      oneTimeVouchersCount: voucherBatch.oneTimeVouchersCount,
    },
  }
}
