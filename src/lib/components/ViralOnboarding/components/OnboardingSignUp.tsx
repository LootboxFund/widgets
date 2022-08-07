import { $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'

interface Props {
  onNext: () => void
  onBack: () => void
}
const OnboardingSignUp = (props: Props) => {
  return (
    <$ViralOnboardingCard>
      <$ViralOnboardingSafeArea>signup</$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default OnboardingSignUp
