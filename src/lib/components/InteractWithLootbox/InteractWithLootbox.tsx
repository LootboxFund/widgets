import react, { useRef } from 'react'
import { $Vertical } from '../Generics'
import TicketMinter from '../TicketMinter/TicketMinter'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'

const InteractWithLootbox = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <$Vertical spacing={2}>
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
