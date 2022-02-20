import react from 'react'
import { $Vertical } from '../Generics'
import TicketMinter from '../TicketMinter/TicketMinter'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'

const InteractWithLootbox = () => {
  return (
    <$Vertical spacing={5}>
      <$TicketContainer>
        <UserTickets />
      </$TicketContainer>
      <$MinterContainer>
        <TicketMinter />
      </$MinterContainer>
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{}>`
  height: 450px;
`

const $MinterContainer = styled.section<{}>`
  height: 512px;
`

export default InteractWithLootbox
