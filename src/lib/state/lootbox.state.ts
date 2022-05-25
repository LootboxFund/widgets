import { ContractAddress, ILootboxMetadata } from '@wormgraph/helpers'
import { proxy, subscribe } from 'valtio'
import { readLootboxMetadata, readTicketMetadata } from 'lib/api/storage'
import { getLootboxData } from 'lib/hooks/useContract'

export interface OnChainLootbox {
    name: string
    symbol: string
    sharePriceWei: string
    sharesSoldCount: string
    sharesSoldMax: string
    sharesSoldTarget: string
    ticketIdCounter: string
    shareDecimals: string
    variant: string
    ticketPurchaseFee: string
}

export interface Lootbox {
    onChain?: OnChainLootbox
    metadata?: ILootboxMetadata
}

export interface LootboxState {
    [key: ContractAddress]: Lootbox
}
const lootboxSnapshot: LootboxState = {}

export const lootboxState = proxy(lootboxSnapshot)

export const loadLootbox = async (lootboxAddress: ContractAddress): Promise<Lootbox | undefined> => {

    await loadLootboxMetadata(lootboxAddress)
    await loadLootboxOnChainData(lootboxAddress)

    return lootboxState[lootboxAddress]
}

export const loadLootboxMetadata = async (lootboxAddress: ContractAddress): Promise<ILootboxMetadata | undefined> => {

    if (lootboxState[lootboxAddress]?.metadata) {
        // Metadata already loaded
        return lootboxState[lootboxAddress].metadata
    }

    const metadata = await readLootboxMetadata(lootboxAddress)
    
    lootboxState[lootboxAddress] = {...lootboxState[lootboxAddress], metadata}

    return metadata
}

export const loadLootboxOnChainData = async (lootboxAddress: ContractAddress): Promise<OnChainLootbox | undefined> => {
    
    let metadata: ILootboxMetadata | undefined = lootboxState[lootboxAddress]?.metadata
    if (!lootboxState[lootboxAddress]?.metadata) {
        try {
            metadata = await loadLootboxMetadata(lootboxAddress)
        } catch (err) {
            console.error('Could not load lootbox metadata!', metadata)
        }
    }

    const onChainData: OnChainLootbox  = await getLootboxData(lootboxAddress, metadata?.lootboxCustomSchema?.chain?.chainIdHex)

    lootboxState[lootboxAddress] = {...lootboxState[lootboxAddress], onChain: {...onChainData}}

    return onChainData
}