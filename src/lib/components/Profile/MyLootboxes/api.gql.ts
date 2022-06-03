import { gql } from '@apollo/client'

export const GET_MY_WALLET_LOOTBOXES = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          wallets {
            lootboxSnapshots {
              address
              name
              stampImage
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
