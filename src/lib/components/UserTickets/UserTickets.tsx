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
    <$Horizontal justifyContent="space-between" height="100%" spacing={3}>
      {tickets.map((ticketID, idx) => (
        <$ParentCard key={`${snap.lootboxAddress}-ticket-${ticketID}-${idx}`}>
          <TicketCard ticketID={ticketID} isRedeemEnabled={true}></TicketCard>
        </$ParentCard>
      ))}
    </$Horizontal>
  )
}

const $ParentCard = styled.div`
  width: 100%;
  height: 100%;
`

export default UserTickets
