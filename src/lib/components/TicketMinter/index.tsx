import react, { useEffect } from 'react'
import TicketMinter from './TicketMinter'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ticketMinterState } from './state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { fetchLootboxData } from 'lib/components/BuyShares/state'

const TicketMinterWidget = () => {
  useEffect(() => {
    window.onload = async () => {
      const lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing dapp', err)
      }
      if (lootboxAddress) {
        ticketCardState.lootboxAddress = lootboxAddress
        ticketMinterState.lootboxAddress = lootboxAddress
        let ticketID = undefined
        try {
          ;[ticketID] = await Promise.all([getLootboxTicketId(lootboxAddress), fetchLootboxData(lootboxAddress)])
        } catch (err) {
          console.error('Error fetching ticket id', err)
          ticketID = '0'
        }
        ticketMinterState.ticketID = ticketID
        loadTicketData(ticketID).catch((err) => console.error('Error loading ticket data', err))
      }
    }
  }, [])

  return <TicketMinter></TicketMinter>
}

export default TicketMinterWidget
