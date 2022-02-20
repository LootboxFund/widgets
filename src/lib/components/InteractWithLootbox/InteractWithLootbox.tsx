import react from 'react'
import { useSnapshot } from 'valtio'
import { buySharesState } from '../BuyShares/state'
import { userTicketState } from '../UserTickets/state'
import { $Vertical } from '../Generics'
import TicketMinter from '../TicketMinter/TicketMinter'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'

const InteractWithLootbox = () => {
  const snap1 = useSnapshot(buySharesState)
  const snap2 = useSnapshot(userTicketState)
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
