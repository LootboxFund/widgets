import { Claim, PartyBasket, Referral } from 'lib/api/graphql/generated/types'
import { PartyBasketID } from 'lib/types'
import { useState, createContext, useContext, PropsWithChildren } from 'react'
import { ClaimFE, PartyBasketFE, ReferralFE } from 'lib/components/ViralOnboarding/api.gql'

interface ViralOnboardingContextType {
  referral?: ReferralFE
  claim?: ClaimFE
  setClaim: (claim: ClaimFE | undefined) => void
  chosenPartyBasket?: PartyBasketFE
  setChosenPartyBasket: (partyBasket: PartyBasketFE | undefined) => void
}

const ViralOnboardingContext = createContext<ViralOnboardingContextType | null>(null)

export const useViralOnboarding = () => {
  const context = useContext(ViralOnboardingContext)
  if (context === null) {
    throw new Error('useViralOnboarding can only be used inside a DeliveryFormProvider')
  }

  return context
}

interface ViralOnboardingProviderProps {
  referral: ReferralFE
}

const ViralOnboardingProvider = ({ referral, children }: PropsWithChildren<ViralOnboardingProviderProps>) => {
  const [claim, setClaim] = useState<ClaimFE>()
  const [chosenPartyBasket, setChosenPartyBasket] = useState<PartyBasketFE>()
  return (
    <ViralOnboardingContext.Provider
      value={{
        referral,
        claim,
        setClaim,
        chosenPartyBasket,
        setChosenPartyBasket,
      }}
    >
      {children}
    </ViralOnboardingContext.Provider>
  )
}

export default ViralOnboardingProvider
