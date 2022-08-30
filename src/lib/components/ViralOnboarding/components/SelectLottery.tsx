import { COLORS } from '@wormgraph/helpers'
import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { FormattedMessage } from 'react-intl'
import { background2, $Heading, $SubHeading, $SupressedParagraph, $NextButton } from '../contants'
import styled from 'styled-components'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

interface Props {
  onNext: () => void
  onBack: () => void
}
const SelectLottery = (props: Props) => {
  const { referral, chosenPartyBasket } = useViralOnboarding()
  const words = useWords()

  const formattedDate: string = referral?.tournament?.tournamentDate
    ? new Date(referral.tournament.tournamentDate).toDateString()
    : words.tournament
  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string = _lb?.stampImage ? convertFilenameToThumbnail(_lb.stampImage, 'sm') : TEMPLATE_LOOTBOX_STAMP

  return (
    <$ViralOnboardingCard background={background2}>
      <$ViralOnboardingSafeArea>
        <$Vertical>
          <$PartyBasketImage src={image} />
          <$Heading>
            <FormattedMessage
              id="viralOnboarding.selectLottery.header"
              defaultMessage="Claim Lottery Ticket"
              description="Header for lottery claim"
            />
          </$Heading>
          <$SubHeading style={{ marginTop: '0px' }}>
            <FormattedMessage
              id="viralOnboarding.selectLottery.description"
              defaultMessage="Join {nPeople} other people who each earn {lotteryPrize} if this team wins the tournament."
              description="Description of the prize"
              values={{
                nPeople: referral?.nConversions || 0,
                lotteryPrize: chosenPartyBasket?.nftBountyValue || words.freeNFT,
              }}
            />
          </$SubHeading>
          <$Heading>
            <$NextButton
              onClick={props.onNext}
              color={COLORS.trustFontColor}
              backgroundColor={COLORS.trustBackground}
              style={{ width: '100%' }}
            >
              <FormattedMessage
                id="viralOnboarding.selectLottery.next"
                defaultMessage="Claim Ticket"
                description="Button to accept a gift"
              />
            </$NextButton>
          </$Heading>
          <$SupressedParagraph style={{ width: '80%', margin: '0 auto' }}>
            <FormattedMessage
              id="viralOnboarding.selectLottery.dateWinnerAnnounce"
              defaultMessage="Winners Announced {dateWin}"
              description="date when we announce the winners of the lottery"
              values={{
                dateWin: formattedDate,
              }}
            />
          </$SupressedParagraph>
        </$Vertical>
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

const $PartyBasketImage = styled.img`
  height: 200px;
  background-size: cover;
  object-fit: contain;
  margin: 20px auto;
  filter: drop-shadow(0px 0px 25px #ffffff);
`

export default SelectLottery
