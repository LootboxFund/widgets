import { gql } from '@apollo/client'

export interface UpdateUserAuthResponseFE {
  __typename: 'UpdateUserResponseSuccess'
  user: {
    email: string
  }
}

export const UPDATE_MY_AUTH = gql`
  mutation Mutation($payload: UpdateUserAuthPayload!) {
    updateUserAuth(payload: $payload) {
      ... on UpdateUserResponseSuccess {
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
