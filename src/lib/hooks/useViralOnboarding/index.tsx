import { QueryDecisionAdApiBetaArgs, QueryReferralArgs, ResponseError } from 'lib/api/graphql/generated/types'
import { ReferralSlug } from 'lib/types'
import { useState, createContext, useContext, PropsWithChildren, useEffect } from 'react'
import { ClaimFE, PartyBasketFE } from 'lib/components/ViralOnboarding/api.gql'
import { useLazyQuery, useQuery } from '@apollo/client'
import useWords from '../useWords'
import { GET_REFERRAL, ReferralResponseFE, ReferralFE, AdFE, GetAdFE, GET_AD } from './api.gql'
import { ErrorCard, LoadingCard } from 'lib/components/ViralOnboarding/components/GenericCard'

interface ViralOnboardingContextType {
  referral: ReferralFE
  claim?: ClaimFE
  setClaim: (claim: ClaimFE | undefined) => void
  chosenPartyBasket?: PartyBasketFE
  setChosenPartyBasket: (partyBasket: PartyBasketFE | undefined) => void
  ad?: AdFE
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
  referralSlug: ReferralSlug
}

const ViralOnboardingProvider = ({ referralSlug, children }: PropsWithChildren<ViralOnboardingProviderProps>) => {
  const { data, loading, error } = useQuery<{ referral: ReferralResponseFE | ResponseError }, QueryReferralArgs>(
    GET_REFERRAL,
    {
      variables: {
        slug: referralSlug,
      },
    }
  )
  const [ad, setAd] = useState<AdFE>()
  const [claim, setClaim] = useState<ClaimFE>()
  const [chosenPartyBasket, setChosenPartyBasket] = useState<PartyBasketFE>()
  const [getAd] = useLazyQuery<{ decisionAdApiBeta: GetAdFE | ResponseError }, QueryDecisionAdApiBetaArgs>(GET_AD)
  const words = useWords()

  useEffect(() => {
    if (!data?.referral) {
      setAd(undefined)
    } else {
      if (data?.referral?.__typename === 'ReferralResponseSuccess') {
        const _referral = data?.referral?.referral
        getAd({ variables: { tournamentId: _referral.tournamentId } })
          .then((res) => {
            if (!res?.data?.decisionAdApiBeta || res.data.decisionAdApiBeta.__typename === 'ResponseError') {
              throw new Error('Error fetching ad')
            } else {
              const data = res.data.decisionAdApiBeta as GetAdFE
              setAd(data.ad || undefined)
            }
          })
          .catch((err) => console.error(err))
      }
    }
  }, [data?.referral])

  if (loading) {
    return <LoadingCard />
  } else if (error || !data) {
    return <ErrorCard message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.referral?.__typename === 'ResponseError') {
    return <ErrorCard message={data?.referral?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const referral: ReferralFE = (data.referral as ReferralResponseFE).referral

  return (
    <ViralOnboardingContext.Provider
      value={{
        referral,
        claim,
        setClaim,
        chosenPartyBasket,
        setChosenPartyBasket,
        ad,
      }}
    >
      {children}
    </ViralOnboardingContext.Provider>
  )
}

export default ViralOnboardingProvider
