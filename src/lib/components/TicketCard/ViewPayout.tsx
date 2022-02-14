import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'
import { $TicketRedeemContainer } from './TicketCard'
import { parseEth } from 'lib/utils/bnConversion'
import { $Horizontal } from 'lib/components/Generics'

export interface ViewPayoutProps {
  ticketID: string | undefined
}

const ViewPayout = (props: ViewPayoutProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID = snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID] && snap.tickets[stateID]
  const dividends = ticket && ticket.dividends
  const activeDividends = dividends && dividends.filter((dividend) => !dividend.isRedeemed)
  const title = activeDividends?.length ? 'COLLECT NEW DIVIDENDS' : 'NO NEW DIVIDENDS'

  const sendToCardView = () => {
    if (stateID && snap.tickets[stateID]) {
      ticketCardState.tickets[stateID].route = '/card'
    }
  }

  return (
    <$TicketRedeemContainer>
      <$Horizontal justifyContent="space-between">
        <$MinorHeading>{title}</$MinorHeading>
        <$XIcon onClick={() => sendToCardView()}>X</$XIcon>
      </$Horizontal>

      {dividends &&
        dividends.map((dividend, idx) => {
          return (
            <$DividendRow key={`${snap.lootboxAddress}-${props.ticketID}-${idx}`} isActive={!dividend.isRedeemed}>
              <$DividendOwed>{parseEth(dividend.tokenAmount)}</$DividendOwed>
              <$DividendTokenSymbol>{dividend.tokenSymbol}</$DividendTokenSymbol>
            </$DividendRow>
          )
        })}
    </$TicketRedeemContainer>
  )
}

export const $DividendRow = styled.section<{ isActive: boolean }>`
  height: 56px;
  background: #dff4ff;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
`

export const $DividendOwed = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 27px;
  color: #000000;
  margin: auto 0px;
`

export const $DividendTokenSymbol = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 22px;

  display: flex;
  align-items: center;
  text-align: right;

  color: #000000;
`

export const $MinorHeading = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 11px;
  /* identical to box height */

  display: flex;
  align-items: center;

  color: #000000;
  padding: 0px 0px 10px 20px;
`

const $XIcon = styled.span`
  font-family: sans-serif;
  padding: 0px 5px 0px 0px;
  cursor: pointer;
`

export default ViewPayout
