import react, { useEffect } from 'react'
import UserTickets from './UserTickets'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { loadUserTickets, userTicketState } from './state'
import { ticketCardState } from 'lib/components/TicketCard/state'

const UserTicketsWidget = () => {
  useEffect(() => {
    window.onload = async () => {
      const lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
      if (lootboxAddress) {
        userTicketState.lootboxAddress = lootboxAddress
        ticketCardState.lootboxAddress = lootboxAddress
        try {
          await loadUserTickets()
        } catch (err) {
          console.error('Error loading user tickets', err)
        }
      }
    }
  }, [])

  return <UserTickets />
}

export default UserTicketsWidget
