import {
  AdServed,
  Placement,
  QueryDecisionAdApiBetaV2Args,
  // QueryDecisionAdApiBetaArgs,
  QueryReferralArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { useState, createContext, useContext, PropsWithChildren, useEffect } from 'react'
import { ClaimFE } from 'lib/components/BeforeAirdropAd/api.gql'
import { useLazyQuery, useQuery } from '@apollo/client'
import useWords from '../useWords'
import { GET_AIRDROP_AD_BETA_V2 } from './api.gql'
import { ErrorCard, LoadingCard } from 'lib/components/BeforeAirdropAd/components/GenericCard'
import { v4 as uuid } from 'uuid'
import { SessionID, ReferralSlug, QuestionAnswerID, QuestionFieldType } from '@wormgraph/helpers'
import { useAuth } from '../useAuth'
import {
  AdOfferQuestion,
  DecisionAdAirdropV1Response,
  QueryDecisionAdAirdropV1Args,
} from '../../api/graphql/generated/types'

// Session Id should be unique within an ad but the same for ad events from the same user
const sessionId = uuid() as SessionID

interface BeforeAirdropAdContextType {
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
}

const BeforeAirdropAdContext = createContext<BeforeAirdropAdContextType | null>(null)

export const useBeforeAirdropAd = () => {
  const context = useContext(BeforeAirdropAdContext)
  if (context === null) {
    throw new Error('useBeforeAirdropAd can only be used inside a DeliveryFormProvider')
  }

  return context
}

interface BeforeAirdropAdProviderProps {
  referralSlug: ReferralSlug
}

const BeforeAirdropAdProvider = ({ referralSlug, children }: PropsWithChildren<BeforeAirdropAdProviderProps>) => {
  const { user } = useAuth()

  const [ad, setAd] = useState<AdServed>()
  const [adQuestions, setAdQuestions] = useState<AdOfferQuestion[]>([])

  const [getAirdropAdBetaV2] = useLazyQuery<
    { decisionAdAirdropV1: DecisionAdAirdropV1Response },
    QueryDecisionAdAirdropV1Args
  >(GET_AIRDROP_AD_BETA_V2)

  return (
    <BeforeAirdropAdContext.Provider
      value={{
        sessionId,
        ad,
        adQuestions,
      }}
    >
      {children}
    </BeforeAirdropAdContext.Provider>
  )
}

export default BeforeAirdropAdProvider
