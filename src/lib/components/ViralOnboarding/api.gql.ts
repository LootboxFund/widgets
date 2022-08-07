import { gql } from '@apollo/client'

export const GET_REFERRAL = gql`
  query Query($slug: ID!) {
    referral(slug: $slug) {
      ... on ReferralResponseSuccess {
        referral {
          seedPartyBasketId
          nConversions
          campaignName
          tournament {
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
