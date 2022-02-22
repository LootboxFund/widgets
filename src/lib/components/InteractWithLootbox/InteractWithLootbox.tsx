import react, { useRef } from 'react'
import { $Vertical } from '../Generics'
import TicketMinter from '../TicketMinter/TicketMinter'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'

const InteractWithLootbox = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <$Vertical spacing={5}>
      <$TicketContainer>
        <UserTickets
          onScrollToMint={() => {
            ref.current?.scrollIntoView()
          }}
        />
      </$TicketContainer>
      <$MinterContainer>
        <TicketMinter ref={ref} />
      </$MinterContainer>
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{}>`
  height: 400px;
`

const $MinterContainer = styled.section<{}>`
  height: 512px;
`

export default InteractWithLootbox
