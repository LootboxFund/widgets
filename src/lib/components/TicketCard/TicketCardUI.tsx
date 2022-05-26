import { TicketID } from '@wormgraph/helpers'
import useWindowSize from 'lib/hooks/useScreenSize'
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
  const { screen } = useWindowSize()
  return (
    <$TicketCardContainer backgroundImage={props.backgroundImage}>
      <$LogoContainer>
        <$TicketLogo
          backgroundImage={props.logoImage}
          backgroundShadowColor={props.backgroundColor}
          // size={screen === 'desktop' ? '170px' : '100px'}
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
