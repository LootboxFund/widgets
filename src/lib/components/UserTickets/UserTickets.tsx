import react from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import styled from 'styled-components'

const TICKET_PAGINATION = 4

const UserTickets = () => {
  const snap = useSnapshot(userTicketState)

  const tickets: (string | undefined)[] = [...snap.userTickets]
  if (tickets.length < TICKET_PAGINATION) {
    for (let i = 0; i < TICKET_PAGINATION - snap.userTickets.length; i++) {
      tickets.push(undefined)
    }
  }
  return (
    <$Horizontal wrap overflow justifyContent="center" height="100%" spacing={3}>
      {tickets.map((ticketID, idx) => (
        <TicketCard
          key={`${snap.lootboxAddress}-ticket-${ticketID}-${idx}`}
          ticketID={ticketID}
          isRedeemEnabled={true}
        ></TicketCard>
      ))}
    </$Horizontal>
  )
}

export default UserTickets
