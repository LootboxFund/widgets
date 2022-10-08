import { functions } from './app'
import { httpsCallable } from 'firebase/functions'
import { EnqueueLootboxOnMintCallableRequest } from '@wormgraph/helpers'

export const startLootboxOnMintListener = httpsCallable<EnqueueLootboxOnMintCallableRequest, void>(
  functions,
  'enqueueLootboxOnMint'
)
