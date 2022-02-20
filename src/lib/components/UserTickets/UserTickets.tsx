import react from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal, $ScrollHorizontal, $ScrollVertical } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import useWindowSize from 'lib/hooks/useScreenSize'

const TICKET_PAGINATION = 4

const UserTickets = () => {
  const snap = useSnapshot(userTicketState)
  const { screen } = useWindowSize()

  const tickets: (string | undefined)[] = [...snap.userTickets]
  if (tickets.length < TICKET_PAGINATION) {
    for (let i = 0; i < TICKET_PAGINATION - snap.userTickets.length; i++) {
      tickets.push(undefined)
    }
  }

  const Wrapper = ({ children }: { children: JSX.Element[] }) => {
    if (screen != 'desktop') {
      return <$ScrollHorizontal>{children}</$ScrollHorizontal>
    } else {
      return (
        <$Horizontal wrap overflow justifyContent="center" height="100%" spacing={3}>
          <></>
          {children}
        </$Horizontal>
      )
    }
  }

  return (
    <Wrapper>
      {tickets.map((ticketID, idx) => (
        <TicketCard
          key={`${snap.lootboxAddress}-ticket-${ticketID}-${idx}`}
          ticketID={ticketID}
          isRedeemEnabled={true}
        ></TicketCard>
      ))}
    </Wrapper>
  )
}

export default UserTickets
