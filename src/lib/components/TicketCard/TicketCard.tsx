import react from 'react'
import { COLORS } from 'lib/theme'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID, ITicketFE, TicketCardState } from './state'
import { ContractAddress } from '@wormgraph/helpers'
import { ScreenSize } from 'lib/hooks/useScreenSize'

export interface TicketCardProps {
  ticketID: string | undefined
  onScrollToMint?: () => void
}

const TicketCard = ({ ticketID, onScrollToMint }: TicketCardProps) => {
  const snap = useSnapshot(ticketCardState) as TicketCardState
  const stateID = ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress as ContractAddress, ticketID)
  const ticket: ITicketFE | undefined =
    stateID && snap.tickets[stateID] ? (snap.tickets[stateID] as ITicketFE) : undefined
  return (
    <$TicketCardContainer
      backgroundImage={ticket?.data.metadata?.backgroundImage}
      onClick={() => {
        !ticket && onScrollToMint && onScrollToMint()
      }}
    >
      <$LogoContainer>
        <$TicketLogo
          backgroundImage={ticket?.data?.metadata?.image}
          backgroundShadowColor={ticket?.data?.metadata?.backgroundColor}
          size={!ticket ? '100px' : undefined}
        >
          {!ticket ? <$Icon>+</$Icon> : null}
        </$TicketLogo>
      </$LogoContainer>

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
  badgeImage?: string
  themeColor: string
  name: string
  screen: ScreenSize
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
      <$LogoContainer>
        {props.badgeImage && (
          <$BadgeImage
            // id used to set logo image in "components/CreateLootbox/StepCustomize/index.ts"
            id="ticket-candy-badge"
            image={props.badgeImage}
            backgroundShadowColor={props.themeColor}
            // margin="auto auto 0"
          />
        )}

        <$TicketLogo
          // id used to set logo image in "components/CreateLootbox/StepCustomize/index.ts"
          id="ticket-candy-logo"
          backgroundImage={props.logoImage}
          backgroundShadowColor={props.themeColor}
          // margin="auto auto 0"
        />
      </$LogoContainer>

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
  padding: 1.5rem;
`

const $LogoContainer = styled.div`
  flex: 1;
  padding: 2.2rem 2.2rem 1.5rem;
  display: relative;
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
  position: relative;
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
  width: 100%;
  padding-top: 100%;
  ${(props) =>
    props.size
      ? `width: ${props.size};\nheight: ${props.size};padding-top: unset; margin-top: 30% !important;`
      : `width: calc(min(100%, 220px));\npadding-top: calc(min(100%, 220px));`}
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
  ${(props) => (props.margin && `margin: ${props.margin};`) || 'margin: auto;'}
`

export const $BadgeImage = styled.div<{
  image: string
  backgroundShadowColor?: string
  screen?: ScreenSize
}>`
  width: 100px;
  height: 100px;
  border: 0px solid transparent;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  ${(props) => props.image && `background: url("${props.image}");`}
  background-size: cover;
  background-position: center;
  box-shadow: ${(props) =>
    props.backgroundShadowColor
      ? `0px 0px 20px 10px ${props.backgroundShadowColor}9A`
      : `0px 10px 10px rgba(0, 0, 0, 0.2)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  margin-left: ${(props) => (props.screen === 'desktop' ? '40%' : '45%')};
`

export const $TicketTag = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px 10px;
  box-sizing: border-box;
`

export const $TagText = styled.p`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.4rem;
  text-align: center;
  position: relative;
  color: #ffffff;
  width: 100%;
  padding: 5px;
  margin: auto;
`
export const $TicketIDText = styled.p`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 1.8rem;
  line-height: 2rem;
  text-align: center;
  position: relative;
  color: #ffffff;
  width: 100%;
  margin: auto;
`

const $Divider = styled.div`
  margin: 0px 10px;
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
