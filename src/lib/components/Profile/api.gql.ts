import { gql } from '@apollo/client'

export const GET_MY_PROFILE = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          email
          wallets {
            address
            createdAt
            lootboxSnapshots {
              stampImage
              name
              address
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
