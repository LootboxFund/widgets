import { $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import {
  background2,
  $Heading,
  $GiantHeading,
  $SubHeading,
  $SupressedParagraph,
  $NextButton,
  $TournamentStampPreviewContainer,
  $TournamentStampPreviewImage,
} from '../contants'

interface Props {
  onNext: () => void
  onBack: () => void
}
const SelectLottery = (props: Props) => {
  const { referral, setChosenPartyBasketId, chosenPartyBasketId } = useViralOnboarding()
  return (
    // <$ViralOnboardingCard background={background2}>
    <$ViralOnboardingCard background={background2}>
      <$ViralOnboardingSafeArea>{chosenPartyBasketId}</$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default SelectLottery
