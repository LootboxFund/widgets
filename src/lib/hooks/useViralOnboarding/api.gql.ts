import { gql } from '@apollo/client'
import {
  Address,
  AdID,
  AdSetID,
  AdvertiserID,
  AffiliateID,
  CreativeID,
  FlightID,
  LootboxID,
  OfferID,
  PartyBasketID,
  ReferralSlug,
  TournamentID,
} from '@wormgraph/helpers'
import { AdServed, Placement } from '../../api/graphql/generated/types'
import {
  // AdType,
  CreativeType,
} from 'lib/api/graphql/generated/types'

export interface LootboxReferralFE {
  id: LootboxID
  nftBountyValue?: string
  address: Address
  stampImage: string
}

export interface OnboardingTournamentFE {
  id: TournamentID
  title?: string
  description?: string
  tournamentDate?: number
  promoterId?: AffiliateID
  isPostCosmic?: boolean
  lootboxSnapshots: {
    address: Address
    stampImage?: string
  }[]
}

export interface ReferralFE {
  slug: ReferralSlug
  referrerId: string
  promoterId?: AffiliateID
  nConversions?: number
  campaignName?: string
  tournamentId: TournamentID
  tournament: OnboardingTournamentFE
  seedLootboxID?: LootboxID
  seedLootbox?: LootboxReferralFE

  /** @deprecated */
  seedPartyBasketId?: PartyBasketID
  /** @deprecated */
  seedPartyBasket: {
    nftBountyValue?: string
    lootboxAddress: Address
  }
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
          slug
          referrerId
          promoterId
          seedPartyBasketId
          seedLootboxID
          nConversions
          campaignName
          tournamentId
          seedLootbox {
            id
            nftBountyValue
            address
            stampImage
          }
          tournament {
            title
            description
            isPostCosmic
            tournamentDate
            lootboxSnapshots {
              address
              stampImage
            }
          }
          # DEPRECATED
          seedPartyBasket {
            nftBountyValue
            lootboxAddress
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
