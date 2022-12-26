import {
  AdServed,
  Placement,
  QueryDecisionAdApiBetaV2Args,
  // QueryDecisionAdApiBetaArgs,
  QueryReferralArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { useState, createContext, useContext, PropsWithChildren, useEffect } from 'react'

import { useLazyQuery, useQuery } from '@apollo/client'
import useWords from '../useWords'
import { GET_AIRDROP_AD_BETA_V2 } from './api.gql'

import { v4 as uuid } from 'uuid'
import { SessionID, ReferralSlug, QuestionAnswerID, QuestionFieldType, LootboxID } from '@wormgraph/helpers'
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
  retrieveAirdropAd: (lootboxID: LootboxID) => void
  ad?: AdServed
  adQuestions?: AdOfferQuestion[]
}

const BeforeAirdropAdContext = createContext<BeforeAirdropAdContextType | null>(null)

export const useBeforeAirdropAd = () => {
  const context = useContext(BeforeAirdropAdContext)
  if (context === null) {
    throw new Error('useBeforeAirdropAd can only be used inside a BeforeAirdropAdProvider')
  }

  return context
}

interface BeforeAirdropAdProviderProps {}

const BeforeAirdropAdProvider = ({ children }: PropsWithChildren<BeforeAirdropAdProviderProps>) => {
  const [ad, setAd] = useState<AdServed>()
  const [adQuestions, setAdQuestions] = useState<AdOfferQuestion[]>([])

  const [getAirdropAdBetaV2] = useLazyQuery<
    { decisionAdAirdropV1: DecisionAdAirdropV1Response },
    QueryDecisionAdAirdropV1Args
  >(GET_AIRDROP_AD_BETA_V2)

  const retrieveAirdropAd = async (lootboxID: LootboxID) => {
    const { data } = await getAirdropAdBetaV2({
      variables: {
        payload: {
          lootboxID,
          placement: Placement.Airdrop,
          sessionID: sessionId,
        },
      },
    })

    if (data?.decisionAdAirdropV1?.__typename === 'DecisionAdAirdropV1ResponseSuccess') {
      setAd(data.decisionAdAirdropV1.ad)
      setAdQuestions(data.decisionAdAirdropV1.questions)
    }
  }

  return (
    <BeforeAirdropAdContext.Provider
      value={{
        sessionId,
        ad,
        adQuestions,
        retrieveAirdropAd,
      }}
    >
      {children}
    </BeforeAirdropAdContext.Provider>
  )
}

export default BeforeAirdropAdProvider
