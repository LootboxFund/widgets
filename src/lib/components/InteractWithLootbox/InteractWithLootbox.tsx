import react, { useRef } from 'react'
import { $Vertical } from '../Generics'
import TicketMinter from '../TicketMinter/TicketMinter'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'
import LogRocket from 'logrocket'

const InteractWithLootbox = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <$Vertical spacing={2}>
      <button onClick={() => console.error("Error Occcured")}>Console Error</button>
      <button onClick={() => {throw Error("We throwing ERR signs")}}>Throw Error</button>
      <button onClick={() => LogRocket.captureException(new Error("We got a LogRocket captureException"))}>LogRocket.captureException</button>
      <button onClick={() => LogRocket.captureMessage("We got a Message Captured")}>LogRocket.captureMessage</button>
      <TicketMinter ref={ref} />
      <$TicketContainer>
        <UserTickets
          onScrollToMint={() => {
            ref.current?.scrollIntoView()
          }}
        />
      </$TicketContainer>
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{}>`
  height: 400px;
`

export default InteractWithLootbox
