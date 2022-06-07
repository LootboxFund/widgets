import { gql } from '@apollo/client'

export const GET_MY_TOURNAMENTS = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          tournaments {
            id
            title
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
