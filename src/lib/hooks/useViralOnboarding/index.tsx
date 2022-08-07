import { Claim, PartyBasket, Referral } from 'lib/api/graphql/generated/types'
import { PartyBasketID } from 'lib/types'
import { useState, createContext, useContext, PropsWithChildren } from 'react'

interface ViralOnboardingContextType {
  referral?: Referral
  claim?: Claim
  setClaim: (claim: Claim | undefined) => void
  chosenPartyBasket?: PartyBasket
  setChosenPartyBasket: (partyBasket: PartyBasket | undefined) => void
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
  const [chosenPartyBasket, setChosenPartyBasket] = useState<PartyBasket>()
  console.log('chosenPartyBasket', chosenPartyBasket)
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
