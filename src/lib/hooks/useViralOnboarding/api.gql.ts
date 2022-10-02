import { gql } from '@apollo/client'
import { Address, AdID, CreativeID, PartyBasketID, ReferralSlug, TournamentID } from '@wormgraph/helpers'
import {
  // AdType,
  CreativeType,
} from 'lib/api/graphql/generated/types'

export interface OnboardingTournamentFE {
  title?: string
  description?: string
  tournamentDate?: number
  lootboxSnapshots: {
    address: Address
    stampImage?: string
  }[]
}

export interface ReferralFE {
  slug: ReferralSlug
  seedPartyBasketId?: PartyBasketID
  nConversions?: number
  campaignName?: string
  tournamentId: TournamentID
  tournament: OnboardingTournamentFE
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
          seedPartyBasketId
          nConversions
          campaignName
          tournamentId
          tournament {
            title
            description
            tournamentDate
            lootboxSnapshots {
              address
              stampImage
            }
          }
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

export interface CreativeFE {
  creativeType: CreativeType
  creativeLinks: string[]
  callToActionText: string | null
  url: string
  clickUrl: string
  thumbnail?: string
  infographicLink: string | null
  creativeAspectRatio: string
  themeColor?: string
}

export interface AdFE {
  id: AdID
  name: string | null
  // adType: AdType
  adType: string
  creativeId: CreativeID
  creative: CreativeFE
}

export interface GetAdFE {
  __typename: 'DecisionAdApiBetaResponseSuccess'
  ad: AdFE
}

export const GET_AD = gql`
  query DecisionAdApiBeta($tournamentId: ID!) {
    decisionAdApiBeta(tournamentId: $tournamentId) {
      ... on DecisionAdApiBetaResponseSuccess {
        ad {
          id
          name
          creativeId
          type
          creative {
            creativeType
            creativeLinks
            callToActionText
            url
            clickUrl
            thumbnail
            infographicLink
            creativeAspectRatio
            themeColor
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
