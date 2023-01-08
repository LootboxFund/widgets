import { gql } from '@apollo/client'
import {
  Address,
  AffiliateID,
  LootboxID,
  LootboxType,
  ReferralID,
  ReferralSlug,
  TournamentID,
  TournamentPrivacyScope,
} from '@wormgraph/helpers'
import { AdOfferQuestion, AdServed, LootboxStatus, LootboxTournamentStatus } from '../../api/graphql/generated/types'

export interface LootboxReferralFE {
  id: LootboxID
  nftBountyValue?: string
  address: Address | null
  stampImage: string
}

export interface LootboxReferralSnapshotFE {
  status: LootboxTournamentStatus
  lootbox: {
    id: LootboxID
    name?: string
    description?: string
    nftBountyValue?: string
    status?: LootboxStatus
    stampImage?: string
    address?: Address | null
    type: LootboxType
    safetyFeatures?: {
      isExclusiveLootbox?: boolean
    }
  }
}

export interface OnboardingTournamentFE {
  id: TournamentID
  title?: string
  description?: string
  tournamentDate?: number
  promoterId?: AffiliateID
  isPostCosmic?: boolean
  runningCompletedClaims: number
  privacyScope: TournamentPrivacyScope[]
  lootboxSnapshots: LootboxReferralSnapshotFE[]
}

export interface ReferralFE {
  id: ReferralID
  slug: ReferralSlug
  referrerId: string
  promoterId?: AffiliateID
  nConversions?: number
  campaignName?: string
  tournamentId: TournamentID
  tournament: OnboardingTournamentFE
  seedLootboxID?: LootboxID
}

export interface ReferralResponseFE {
  __typename: 'ReferralResponseSuccess'
  referral: ReferralFE
}

export const GET_REFERRAL = gql`
  query Query($slug: ID!) {
    referral(slug: $slug) {
      ... on ReferralResponseSuccess {
        referral {
          id
          slug
          referrerId
          promoterId
          seedLootboxID
          nConversions
          campaignName
          tournamentId
          # seedLootbox {
          #   id
          #   nftBountyValue
          #   address
          #   stampImage
          # }
          tournament {
            title
            description
            isPostCosmic
            tournamentDate
            runningCompletedClaims
            privacyScope
            lootboxSnapshots(status: active) {
              status
              lootbox {
                id
                name
                description
                nftBountyValue
                status
                stampImage
                type
                safetyFeatures {
                  isExclusiveLootbox
                }
              }
            }
          }
        }
      }
      ... on ResponseError {
        error {
          code
          message
        }
      }
    }
  }
`

export interface GetAdFE {
  __typename: 'DecisionAdApiBetaV2ResponseSuccess'
  ad: AdServed
  questions: AdOfferQuestion[]
}

export const GET_AD_BETA_V2 = gql`
  query DecisionAdApiBetaV2($payload: DecisionAdApiBetaV2Payload!) {
    decisionAdApiBetaV2(payload: $payload) {
      ... on DecisionAdApiBetaV2ResponseSuccess {
        ad {
          adID
          adSetID
          advertiserID
          advertiserName
          offerID
          creative {
            adID
            advertiserID
            creativeType
            creativeLinks
            callToAction
            thumbnail
            infographicLink
            aspectRatio
            themeColor
          }
          flightID
          placement
          pixelUrl
          clickDestination
        }
        questions {
          id
          batch
          order
          question
          type
          mandatory
          options
        }
      }
      ... on ResponseError {
        error {
          code
          message
        }
      }
    }
  }
`
