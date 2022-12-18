import {
  AdServed,
  Placement,
  QueryDecisionAdApiBetaV2Args,
  // QueryDecisionAdApiBetaArgs,
  QueryReferralArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { useState, createContext, useContext, PropsWithChildren, useEffect } from 'react'
import { ClaimFE, PartyBasketFE } from 'lib/components/ViralOnboarding/api.gql'
import { useLazyQuery, useQuery } from '@apollo/client'
import useWords from '../useWords'
import { GET_REFERRAL, ReferralResponseFE, ReferralFE, GetAdFE, LootboxReferralFE, GET_AD_BETA_V2 } from './api.gql'
import { ErrorCard, LoadingCard } from 'lib/components/ViralOnboarding/components/GenericCard'
import { v4 as uuid } from 'uuid'
import { SessionID, ReferralSlug } from '@wormgraph/helpers'
import { useAuth } from '../useAuth'
import { AdOfferQuestion } from '../../api/graphql/generated/types'

// Session Id should be unique within an ad but the same for ad events from the same user
const sessionId = uuid() as SessionID

interface ViralOnboardingContextType {
  sessionId: SessionID
  referral: ReferralFE
  claim?: ClaimFE
  setClaim: (claim: ClaimFE | undefined) => void
  ad?: AdServed
  adQuestions?: AdOfferQuestion[]
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
  const { user } = useAuth()
  const { data, loading, error } = useQuery<{ referral: ReferralResponseFE | ResponseError }, QueryReferralArgs>(
    GET_REFERRAL,
    {
      variables: {
        slug: referralSlug,
      },
    }
  )
  const [ad, setAd] = useState<AdServed>()
  const [adQuestions, setAdQuestions] = useState<AdOfferQuestion[]>([])
  const [claim, setClaim] = useState<ClaimFE>()
  /** @deprecated */
  const [chosenPartyBasket, setChosenPartyBasket] = useState<PartyBasketFE>()
  const [chosenLootbox, setChosenLootbox] = useState<LootboxReferralFE>()
  const [email, setEmail] = useState<string>()
  const words = useWords()

  const [getAdBetaV2] = useLazyQuery<{ decisionAdApiBetaV2: GetAdFE | ResponseError }, QueryDecisionAdApiBetaV2Args>(
    GET_AD_BETA_V2
  )

  console.log(`adQuestions`, adQuestions)

  // new ad v2
  useEffect(() => {
    if (data?.referral?.__typename === 'ReferralResponseSuccess' && claim && claim.id && user && user.id && !ad) {
      // uncomment me for dev without auth
      // if (data?.referral?.__typename === 'ReferralResponseSuccess' && claim && claim.id && !ad) {
      const _referral = data?.referral?.referral
      getAdBetaV2({
        variables: {
          payload: {
            claimID: claim.id,
            placement: Placement.AfterTicketClaim,
            promoterID: _referral.promoterId,
            sessionID: sessionId,
            tournamentID: _referral.tournamentId,
            userID: user.id,
          },
        },
      })
        .then((res) => {
          if (!res?.data?.decisionAdApiBetaV2 || res.data.decisionAdApiBetaV2.__typename === 'ResponseError') {
            throw new Error('Error fetching ad')
          } else {
            const data = res.data.decisionAdApiBetaV2 as GetAdFE
            setAd(data.ad || undefined)
            setAdQuestions(data.questions || [])
          }
        })
        .catch((err) => console.error(err))
    }
  }, [data?.referral, claim?.id, user?.id])

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
        adQuestions,
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
