
import { proxy } from 'valtio'

export const state = proxy({ count: 0, text: 'hello' })

export const DEFAULT_CHAIN_ID = 56