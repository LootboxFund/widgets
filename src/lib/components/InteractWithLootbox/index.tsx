import react, { useEffect } from 'react'
import InteractWithLootbox from './InteractWithLootbox'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ticketMinterState } from 'lib/components/TicketMinter/state'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { userTicketState, loadUserTickets } from 'lib/components/UserTickets/state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { initBuySharesState } from 'lib/components/BuyShares/state'
import { ContractAddress } from '@lootboxfund/helpers'
import { initLogging } from 'lib/api/logrocket'

export const onLoad = async (lootboxAddress: ContractAddress) => {
  ticketCardState.lootboxAddress = lootboxAddress
  ticketMinterState.lootboxAddress = lootboxAddress
  userTicketState.lootboxAddress = lootboxAddress

  let ticketID = undefined
  try {
    ;[ticketID] = await Promise.all([
      getLootboxTicketId(lootboxAddress),
      initBuySharesState(lootboxAddress),
      loadUserTickets(),
    ])
  } catch (err) {
    console.error('Error fetching ticket id', err)
    ticketID = '0'
  }
  ticketMinterState.ticketID = ticketID
  loadTicketData(ticketID).catch((err) => console.error('Error loading ticket data', err))
}

const InteractWithLootboxWidget = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
      const lootboxAddress = parseUrlParams('lootbox') as ContractAddress
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
      if (lootboxAddress) {
        onLoad(lootboxAddress)
      }
    }
    load()
  }, [])

  return <InteractWithLootbox />
}

export default InteractWithLootboxWidget
