import { TicketID } from '@wormgraph/helpers'
import {
  $Divider,
  $LogoContainer,
  $TagText,
  $TicketCardContainer,
  $TicketIDText,
  $TicketLogo,
  $TicketTag,
} from './TicketCard'

interface TicketCardUIProps {
  backgroundImage: string
  logoImage: string
  backgroundColor: string
  name: string
  ticketId: TicketID
  onClick?: () => void
}

const TicketCardUI = (props: TicketCardUIProps) => {
  return (
    <$TicketCardContainer backgroundImage={props.backgroundImage}>
      <$LogoContainer>
        <$TicketLogo
          backgroundImage={props.logoImage}
          backgroundShadowColor={props.backgroundColor}
          size={'170px'}
        ></$TicketLogo>
      </$LogoContainer>

      <$TicketTag>
        <$TagText>{props.name}</$TagText>
        {/* <$Divider />
        <$TicketIDText>{props.ticketId}</$TicketIDText> */}
      </$TicketTag>
    </$TicketCardContainer>
  )
}

export default TicketCardUI
