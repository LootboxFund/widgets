import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'
import { $TicketRedeemContainer } from './TicketCard'
import { parseEth } from '../../utils/bnConversion'

export interface ViewPayoutProps {
  ticketID: string | undefined
}

const ViewPayout = (props: ViewPayoutProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID = snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID] && snap.tickets[stateID]

  return (
    <$TicketRedeemContainer>
      Payouts
      {ticket &&
        ticket.dividends.map((dividend, idx) => {
          return (
            <$DividendRow key={`${snap.lootboxAddress}-${props.ticketID}-${idx}`} isActive={!dividend.isRedeemed}>
              <$DividendOwed>{dividend.tokenAmount}</$DividendOwed>
              <$DividendTokenSymbol>{dividend.tokenSymbol}</$DividendTokenSymbol>
            </$DividendRow>
          )
        })}
    </$TicketRedeemContainer>
  )
}

export const $DividendRow = styled.section<{ isActive: boolean }>`
  width: 100%;
  height: 56px;
  background: #dff4ff;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const $DividendOwed = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  line-height: 27px;
  color: #000000;
`

export const $DividendTokenSymbol = styled.span`
  font-family: Open Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;

  display: flex;
  align-items: center;
  text-align: right;

  color: #000000;
`

export default ViewPayout
