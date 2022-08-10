import { gql } from '@apollo/client'

export const CREATE_REFERRAL = gql`
  mutation Mutation($payload: CreateReferralPayload!) {
    createReferral(payload: $payload) {
      ... on CreateReferralResponseSuccess {
        referral {
          id
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
          message
          code
        }
      }
    }
  }
`
