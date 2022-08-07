import { Claim, Referral } from 'lib/api/graphql/generated/types'
import { PartyBasketID } from 'lib/types'
import { useState, createContext, useContext, PropsWithChildren } from 'react'

interface ViralOnboardingContextType {
  referral?: Referral
  claim?: Claim
  setClaim: (claim: Claim | undefined) => void
  chosenPartyBasketId?: PartyBasketID
  setChosenPartyBasketId: (partyBasketId: PartyBasketID | undefined) => void
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
  referral: Referral
}

const ViralOnboardingProvider = ({ referral, children }: PropsWithChildren<ViralOnboardingProviderProps>) => {
  const [claim, setClaim] = useState<Claim>()
  const [chosenPartyBasketId, setChosenPartyBasketId] = useState<PartyBasketID>()
  return (
    <ViralOnboardingContext.Provider
      value={{
        referral,
        claim,
        setClaim,
        chosenPartyBasketId,
        setChosenPartyBasketId,
      }}
    >
      {children}
    </ViralOnboardingContext.Provider>
  )
}

export default ViralOnboardingProvider
