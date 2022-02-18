import react from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import styled from 'styled-components'

const UserTickets = () => {
  const snap = useSnapshot(userTicketState)

  return (
    <$Horizontal justifyContent="space-between" height="100%" spacing={3}>
      {snap.userTickets &&
        snap.userTickets.map((ticketID) => (
          <$ParentCard>
            <TicketCard
              key={`${snap.lootboxAddress}-ticket-${ticketID}`}
              ticketID={ticketID}
              isRedeemEnabled={true}
            ></TicketCard>
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
