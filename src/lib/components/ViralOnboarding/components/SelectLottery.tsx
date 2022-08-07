import { $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'

interface Props {
  onNext: () => void
  onBack: () => void
}
const SelectLottery = (props: Props) => {
  return (
    <$ViralOnboardingCard>
      <$ViralOnboardingSafeArea>select lottery</$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default SelectLottery
