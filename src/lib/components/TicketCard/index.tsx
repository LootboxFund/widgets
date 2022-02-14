import react, { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import TicketCard from 'lib/components/TicketCard/TicketCard'
import ViewPayout from 'lib/components/TicketCard/ViewPayout'
import { useSnapshot } from 'valtio'
import { ticketCardState, initializeLootbox, loadTicketData } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import RedeemButton from 'lib/components/TicketCard/RedeemButton'
import styled from 'styled-components'
import { generateStateID } from './state'

export interface TicketCardWidgetProps {
  ticketID: string | undefined
  isRedeemEnabled?: boolean
}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID = snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID]

  useEffect(() => {
    window.onload = () => {
      const [lootboxAddress] = parseUrlParams(['fundraisers'])
      initDApp()
        .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
        .then(() => (props.ticketID ? loadTicketData(props.ticketID) : undefined))
        .catch((err) => console.error(err))
    }
  }, [])

  useEffect(() => {
    if (props.ticketID) {
      loadTicketData(props.ticketID).catch((err) => console.error(err))
    }
  }, [props.ticketID])

  return (
    <$RootContainer>
      {ticket && ticket.route === '/payout' ? (
        <ViewPayout ticketID={props.ticketID} />
      ) : (
        <TicketCard ticketID={props.ticketID} />
      )}
      {props.ticketID && props.isRedeemEnabled && <RedeemButton ticketID={props.ticketID} />}
    </$RootContainer>
  )
}

export const $RootContainer = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 512px;
`

export default TicketCardWidget
