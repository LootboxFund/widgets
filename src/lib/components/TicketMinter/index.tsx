import react, { useEffect } from 'react'
import TicketMinter from './TicketMinter'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ticketMinterState } from './state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from '../TicketCard/state'

const TicketMinterWidget = () => {
  useEffect(() => {
    window.onload = async () => {
      const [lootboxAddress] = parseUrlParams(['fundraisers'])
      try {
        await initDApp()
      } catch (err) {
        console.error(err)
      }
      if (lootboxAddress) {
        ticketCardState.lootboxAddress = lootboxAddress
        ticketMinterState.lootboxAddress = lootboxAddress
        let ticketID = undefined
        try {
          ticketID = await getLootboxTicketId(lootboxAddress)
        } catch (err) {
          console.error(err)
          ticketID = '0'
        }
        ticketMinterState.ticketID = ticketID
        loadTicketData(ticketID).catch((err) => console.error(err))
      }
    }
  }, [])

  return <TicketMinter></TicketMinter>
}

export default TicketMinterWidget
