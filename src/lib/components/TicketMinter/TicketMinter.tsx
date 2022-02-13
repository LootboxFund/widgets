import react from 'react'
import BuyShares from '../BuyShares'
import TicketCard from '../TicketCard'
import styled from 'styled-components'

export const $TicketMinterContainer = styled.section`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  min-height: 600px;
`

const $Row = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const $Col = styled.section<{ width: string }>`
  width: ${(props) => props.width};
  display: flex;
`

const TicketMinter = ({ ticketID }: { ticketID: string | undefined }) => {
  return (
    <$TicketMinterContainer>
      <$Row>
        <BuyShares></BuyShares>
        <TicketCard ticketID={ticketID}></TicketCard>
      </$Row>
    </$TicketMinterContainer>
  )
}

export default TicketMinter
