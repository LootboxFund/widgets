import react from 'react'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'

export interface TicketCardProps {
  ticketID: string | undefined
}

const TicketCard = ({ ticketID }: TicketCardProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID = ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress, ticketID)
  const ticket = stateID && snap.tickets[stateID]

  console.log('found ticket', ticket)

  return <>hello</>
}

export default TicketCard
