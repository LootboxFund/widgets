import { $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'

interface Props {
  onNext: () => void
  onBack: () => void
}
const CompleteOnboarding = (props: Props) => {
  return (
    <$ViralOnboardingCard>
      <$ViralOnboardingSafeArea> complete</$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default CompleteOnboarding
