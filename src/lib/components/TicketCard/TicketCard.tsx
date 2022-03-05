import react from 'react'
import { COLORS } from 'lib/theme'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'
import { ContractAddress } from '@lootboxfund/helpers'

export interface TicketCardProps {
  ticketID: string | undefined
  onScrollToMint?: () => void
}

const TicketCard = ({ ticketID, onScrollToMint }: TicketCardProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID = ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress as ContractAddress, ticketID)
  const ticket = stateID && snap.tickets[stateID] ? snap.tickets[stateID] : undefined
  return (
    <$TicketCardContainer
      backgroundImage={ticket?.data?.metadata?.backgroundImage}
      onClick={() => {
        onScrollToMint && onScrollToMint()
      }}
    >
      <$TicketLogo
        backgroundImage={ticket?.data?.metadata?.image}
        backgroundShadowColor={ticket?.data?.metadata?.backgroundColor}
        size={!ticket ? '100px' : undefined}
        margin={ticket ? 'auto auto 0' : 'auto'}
      >
        {!ticket ? <$Icon>+</$Icon> : null}
      </$TicketLogo>
      {ticket ? (
        <$TicketTag>
          <$TagText>{ticket?.data?.metadata?.name}</$TagText>
          <$Divider />
          <$TicketIDText>{ticket?.data?.id ? `#${ticket.data?.id}` : ''}</$TicketIDText>
        </$TicketTag>
      ) : null}
    </$TicketCardContainer>
  )
}

interface TicketCardCandyWrapperProps {
  backgroundImage: string
  logoImage: string
  themeColor: string
  name: string
}
export const TicketCardCandyWrapper = (props: TicketCardCandyWrapperProps) => {
  return (
    <$TicketCardContainer
      // id used to set background image in "components/CreateLootbox/StepCustomize/index.ts"
      id="ticket-candy-container"
      backgroundImage={props.backgroundImage}
      onClick={() => {
        console.log('click')
      }}
    >
      <$TicketLogo
        // id used to set logo image in "components/CreateLootbox/StepCustomize/index.ts"
        id="ticket-candy-logo"
        backgroundImage={props.logoImage}
        backgroundShadowColor={props.themeColor}
        margin="auto auto 0"
      ></$TicketLogo>

      <$TicketTag>
        <$TagText>{props.name || 'Lootbox Ticket'}</$TagText>
        <$Divider />
        <$TicketIDText>{`#0`}</$TicketIDText>
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
  background: ${(props) => (props.backgroundColor ? props.backgroundColor : `${COLORS.surpressedBackground}15`)};
  ${(props) => (props.backgroundImage ? `background: url("${props.backgroundImage}");` : '')}
  background-size: cover;
  cursor: pointer;
  background-position: center;
`

export const $TicketRedeemContainer = styled.section`
  ${BASE_CONTAINER}
  padding: 20px 20px 0px;
`

export const $TicketLogo = styled.div<{
  backgroundImage?: string
  backgroundShadowColor?: string
  size?: string
  margin?: string
}>`
  ${(props) => (props.size ? `width: ${props.size};\nheight: ${props.size};` : `width: 75%;\npadding-top: 75%;`)}
  border: 0px solid transparent;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  ${(props) => props.backgroundImage && `background: url("${props.backgroundImage}");`}
  box-shadow: ${(props) =>
    props.backgroundShadowColor
      ? `0px 0px 40px 10px ${props.backgroundShadowColor}`
      : `0px 10px 10px rgba(0, 0, 0, 0.2)`};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${(props) => (props.margin && `margin: ${props.margin};`) || 'auto'}
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
  padding: 5px;
  word-break: break-word;
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

export const $Icon = styled.div<{ size?: string }>`
  font-family: open-sans;
  font-weight: bold;
  font-size: ${(props) => props.size || '84px'};
  line-height: 100px;
  text-align: center;
  color: ${COLORS.surpressedFontColor}aa;
`

export default TicketCard
