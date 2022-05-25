import react, { useEffect } from 'react'
import InteractWithLootbox from './InteractWithLootbox'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { readLootboxMetadata } from 'lib/api/storage'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { userTicketState, loadUserTickets } from 'lib/components/UserTickets/state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { initBuySharesState } from 'lib/components/BuyShares/state'
import { ContractAddress, ILootboxMetadata } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import { loadLootboxMetadata } from 'lib/state/lootbox.state'
import LogRocket from 'logrocket'

export const onLoad = async (lootboxAddress: ContractAddress) => {
  ticketCardState.lootboxAddress = lootboxAddress
  userTicketState.lootboxAddress = lootboxAddress

  
  let metadata: ILootboxMetadata | undefined = undefined

  try {
    metadata = await loadLootboxMetadata(lootboxAddress)
  } catch (err) {
    console.error(err)
  }

  try {
    await initDApp(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
  } catch (err) {
    LogRocket.captureException(err)
  }

  initBuySharesState(lootboxAddress).catch((err) => LogRocket.captureException(err))
  
  loadUserTickets().catch((err) => LogRocket.captureException(err))

  let ticketID = undefined
  try {
    ticketID = await getLootboxTicketId(lootboxAddress)
  } catch (err) {
    console.error('Error fetching ticket id', err)
    LogRocket.captureException(err)
    ticketID = '0'
  }
  
  loadTicketData(ticketID).catch((err) => LogRocket.captureException(err))
}

const InteractWithLootboxWidget = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
      const lootboxAddress = parseUrlParams('lootbox') as ContractAddress
      if (lootboxAddress) {
        onLoad(lootboxAddress)
      }
    }
    load()
  }, [])

  return <InteractWithLootbox />
}

export default InteractWithLootboxWidget
