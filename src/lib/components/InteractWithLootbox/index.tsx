import react, { useEffect } from 'react'
import InteractWithLootbox from './InteractWithLootbox'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ticketMinterState } from 'lib/components/TicketMinter/state'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { userTicketState, loadUserTickets } from 'lib/components/UserTickets/state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { fetchLootboxData } from 'lib/components/BuyShares/state'

export const onLoad = async (lootboxAddress: string) => {
  ticketCardState.lootboxAddress = lootboxAddress
  ticketMinterState.lootboxAddress = lootboxAddress
  userTicketState.lootboxAddress = lootboxAddress

  let ticketID = undefined
  try {
    ;[ticketID] = await Promise.all([
      getLootboxTicketId(lootboxAddress),
      fetchLootboxData(lootboxAddress),
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
      const lootboxAddress = parseUrlParams('lootbox')
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
