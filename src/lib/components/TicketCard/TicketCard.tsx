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
  if (!ticket || !ticket.metadata?.backgroundImage || !ticket.metadata?.image || !ticket.metadata?.backgroundColor) {
    return <>LOADING</>
  }
  return (
    <$TicketCardContainer backgroundImage={ticket.metadata?.backgroundImage}>
      <$TicketLogo
        backgroundImage={ticket.metadata?.image}
        backgroundShadowColor={ticket.metadata?.backgroundColor}
      ></$TicketLogo>
      <$TicketTag>
        <$TagText>{ticket.metadata?.name}</$TagText>
        <$Divider />
        <$TicketIDText>#{ticket.id}</$TicketIDText>
      </$TicketTag>
    </$TicketCardContainer>
  )
}

export const $TicketCardContainer = styled.section<{ backgroundImage: string }>`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  min-height: 512px;
  background: ${(props) => `url("${props.backgroundImage}")`};
  background-size: cover;
`

export const $TicketLogo = styled.div<{ backgroundImage: string; backgroundShadowColor: string }>`
  width: 100%;
  height: 100%;
  max-width: 256px;
  max-height: 256px;
  border: 0px solid transparent;
  border-radius: 50%;
  margin: auto auto 0px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  background: ${(props) => `url("${props.backgroundImage}")`};
  filter: drop-shadow(0px 0px 40px ${(props) => props.backgroundShadowColor});
  background-size: cover;
`

export const $TicketTag = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin: auto 0px 20px;
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
  border: 5px solid rgba(255, 255, 255, 0.33);
  transform: rotate(0deg);
`

export default TicketCard
