import { $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'

interface Props {
  onNext: () => void
  onBack: () => void
}
const ChooseLottery = (props: Props) => {
  return (
    <$ViralOnboardingCard>
      <$ViralOnboardingSafeArea>choose lottery</$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default ChooseLottery
