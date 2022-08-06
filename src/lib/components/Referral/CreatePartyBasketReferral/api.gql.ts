import { gql } from '@apollo/client'

export const CREATE_REFERRAL = gql`
  mutation Mutation($payload: CreateReferralPayload!) {
    createReferral(payload: $payload) {
      ... on CreateReferralResponseSuccess {
        referral {
          id
          referrerId
          creatorId
          slug
          tournamentId
          seedPartyBasketId
          campaignName
          nConversions
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
