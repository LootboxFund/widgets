import react from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal } from '../Generics'
import TicketCard from 'lib/components/TicketCard'

const UserTickets = () => {
  const snap = useSnapshot(userTicketState)

  return (
    <$Horizontal>
      {snap.userTickets &&
        snap.userTickets.map((ticketID) => (
          <TicketCard key={`${snap.lootboxAddress}-ticket-${ticketID}`} ticketID={ticketID}></TicketCard>
        ))}
    </$Horizontal>
  )
}

export default UserTickets
