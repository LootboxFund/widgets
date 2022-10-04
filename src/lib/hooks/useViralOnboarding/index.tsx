import {
  // QueryDecisionAdApiBetaArgs,
  QueryReferralArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { useState, createContext, useContext, PropsWithChildren, useEffect } from 'react'
import { ClaimFE, PartyBasketFE } from 'lib/components/ViralOnboarding/api.gql'
import { useLazyQuery, useQuery } from '@apollo/client'
import useWords from '../useWords'
import { GET_REFERRAL, ReferralResponseFE, ReferralFE, AdFE, GetAdFE, GET_AD, LootboxReferralFE } from './api.gql'
import { ErrorCard, LoadingCard } from 'lib/components/ViralOnboarding/components/GenericCard'
import { v4 as uuid } from 'uuid'
import { SessionID, ReferralSlug } from '@wormgraph/helpers'

// Session Id should be unique within an ad but the same for ad events from the same user
const sessionId = uuid() as SessionID

interface ViralOnboardingContextType {
  sessionId: SessionID
  referral: ReferralFE
  claim?: ClaimFE
  setClaim: (claim: ClaimFE | undefined) => void
  ad?: AdFE
  email?: string
  setEmail: (email: string) => void
  chosenLootbox?: LootboxReferralFE
  setChosenLootbox: (lootbox: LootboxReferralFE) => void
  /** @deprecated use chosenLootbox */
  chosenPartyBasket?: PartyBasketFE
  /** @deprecated use chosenLootbox */
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
  /** @deprecated */
  const [chosenPartyBasket, setChosenPartyBasket] = useState<PartyBasketFE>()
  const [chosenLootbox, setChosenLootbox] = useState<LootboxReferralFE>()
  const [email, setEmail] = useState<string>()
  const words = useWords()

  // TODO: UPDATE NEW AD

  // const [getAd] = useLazyQuery<{ decisionAdApiBeta: GetAdFE | ResponseError }, QueryDecisionAdApiBetaArgs>(GET_AD)

  // useEffect(() => {
  //   if (!data?.referral) {
  //     setAd(undefined)
  //   } else {
  //     if (data?.referral?.__typename === 'ReferralResponseSuccess') {
  //       const _referral = data?.referral?.referral
  //       getAd({ variables: { tournamentId: _referral.tournamentId } })
  //         .then((res) => {
  //           if (!res?.data?.decisionAdApiBeta || res.data.decisionAdApiBeta.__typename === 'ResponseError') {
  //             throw new Error('Error fetching ad')
  //           } else {
  //             const data = res.data.decisionAdApiBeta as GetAdFE
  //             setAd(data.ad || undefined)
  //           }
  //         })
  //         .catch((err) => console.error(err))
  //     }
  //   }
  // }, [data?.referral])

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
        sessionId,
        referral,
        claim,
        setClaim,
        ad,
        email,
        setEmail,
        chosenLootbox,
        setChosenLootbox,
        chosenPartyBasket,
        setChosenPartyBasket,
      }}
    >
      {children}
    </ViralOnboardingContext.Provider>
  )
}

export default ViralOnboardingProvider
