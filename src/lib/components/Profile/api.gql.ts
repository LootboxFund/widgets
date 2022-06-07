import { gql } from '@apollo/client'

export const GET_MY_PROFILE = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          email
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
