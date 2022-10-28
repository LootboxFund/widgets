import { gql } from '@apollo/client'
import { Address, LootboxID, ReferralID, ReferralSlug, TournamentID } from '@wormgraph/helpers'

export interface CreateReferralFE {
  id: ReferralID
  slug: ReferralSlug
  seedLootboxID: LootboxID
  nConversions: number
  campaignName?: string
  tournamentId: TournamentID
  tournament?: {
    title: string
    description?: string
    tournamentDate?: string | number
    lootboxSnapshots?: {
      lootboxID: LootboxID
      address: Address | null
      stampImage: string
    }[]
  }
}

export interface CreateReferralResponseFE {
  __typename: 'CreateReferralResponseSuccess'
  referral?: CreateReferralFE
}

export const CREATE_REFERRAL = gql`
  mutation Mutation($payload: CreateReferralPayload!) {
    createReferral(payload: $payload) {
      ... on CreateReferralResponseSuccess {
        referral {
          id
          slug
          seedLootboxID
          nConversions
          campaignName
          tournamentId
          tournament {
            title
            description
            tournamentDate
            lootboxSnapshots {
              lootboxID
              address
              stampImage
            }
          }
        }
      }
      ... on ResponseError {
        error {
          message
          code
        }
      }
    }
  }
`
