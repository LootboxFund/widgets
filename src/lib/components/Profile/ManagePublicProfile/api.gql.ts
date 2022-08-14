import { gql } from '@apollo/client'

export interface UpdateUserResponseFE {
  __typename: 'UpdateUserResponseSuccess'
  user: {
    username: string
  }
}

export const UPDATE_USER = gql`
  mutation Mutation($payload: UpdateUserPayload!) {
    updateUser(payload: $payload) {
      ... on UpdateUserResponseSuccess {
        user {
          username
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
