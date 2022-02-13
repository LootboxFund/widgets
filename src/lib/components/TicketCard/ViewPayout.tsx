import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'
import { $TicketRedeemContainer } from './TicketCard'

export interface TicketCardProps {
  ticketID: string | undefined
}

const ViewPayout = () => {
  return <$TicketRedeemContainer>Payouts</$TicketRedeemContainer>
}

export default ViewPayout
