import react, { useEffect } from 'react'
import UserTickets from './UserTickets'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { loadUserTickets } from './state'
import { initializeLootbox } from 'lib/components/TicketCard/state'

const UserTicketsWidget = () => {
  useEffect(() => {
    window.onload = () => {
      const [lootboxAddress] = parseUrlParams(['fundraisers'])
      initDApp()
        .then(() => (lootboxAddress ? loadUserTickets(lootboxAddress) : undefined))
        .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
        .catch((err) => console.error(err))
    }
  }, [])

  return <UserTickets />
}

export default UserTicketsWidget
