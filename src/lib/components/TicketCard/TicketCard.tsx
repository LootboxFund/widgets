import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'

export interface TicketCardProps {
  ticketID: string | undefined
}

const TicketCard = ({ ticketID }: TicketCardProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID = ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress, ticketID)
  const ticket = stateID && snap.tickets[stateID] ? snap.tickets[stateID] : undefined
  return (
    <$TicketCardContainer backgroundImage={ticket?.data?.metadata?.backgroundImage}>
      <$TicketLogo
        backgroundImage={ticket?.data?.metadata?.image}
        backgroundShadowColor={ticket?.data?.metadata?.backgroundColor}
      ></$TicketLogo>
      <$TicketTag>
        <$TagText>{ticket?.data?.metadata?.name}</$TagText>
        <$Divider />
        <$TicketIDText>{ticket?.data?.id ? `#${ticket.data?.id}` : ''}</$TicketIDText>
      </$TicketTag>
    </$TicketCardContainer>
  )
}

const BASE_CONTAINER = `
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const $TicketCardContainer = styled.section<{ backgroundColor?: string; backgroundImage?: string | undefined }>`
  ${BASE_CONTAINER}
  border: 0px solid transparent;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  background: ${(props) => (props.backgroundColor ? props.backgroundColor : '#f5f5f5')};
  ${(props) => (props.backgroundImage ? `background: url("${props.backgroundImage}");` : '')}
  background-size: cover;
`

export const $TicketRedeemContainer = styled.section`
  ${BASE_CONTAINER}
  padding: 20px 20px 0px;
`

export const $TicketLogo = styled.div<{ backgroundImage?: string; backgroundShadowColor?: string }>`
  width: 100%;
  height: 100%;
  max-width: ${(props) => (props.backgroundImage ? '256px' : '186px')};
  max-height: ${(props) => (props.backgroundImage ? '256px' : '186px')};
  border: 0px solid transparent;
  border-radius: 50%;
  margin: auto auto 0px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.05);
  ${(props) => (props.backgroundImage ? `background: url("${props.backgroundImage}");` : '')}
  filter: drop-shadow(0px 0px 22px ${(props) => props.backgroundShadowColor || '#000'});
  background-size: cover;
`

export const $TicketTag = styled.section`
  width: 85%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin: auto auto 20px;
`

export const $TagText = styled.p`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 22px;
  line-height: 30px;
  text-align: right;
  position: relative;
  color: #ffffff;
  width: 100%;
  max-width: 50%;
`
export const $TicketIDText = styled.p`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 42px;
  line-height: 42px;
  text-align: center;
  position: relative;
  color: #ffffff;
  width: 100%;
  max-width: 50%;
  margin: auto;
`

const $Divider = styled.div`
  margin: 10px;
  border: 3px solid rgba(255, 255, 255, 0.33);
  transform: rotate(0deg);
`

export default TicketCard
