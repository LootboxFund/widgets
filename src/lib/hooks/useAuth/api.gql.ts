import { gql } from '@apollo/client'

export const SIGN_UP_WITH_PASSWORD = gql`
  mutation Mutation($payload: CreateUserWithPasswordPayload!) {
    createUserWithPassword(payload: $payload) {
      ... on CreateUserResponseSuccess {
        user {
          id
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

export const SIGN_UP_WITH_WALLET = gql`
  mutation Mutation($payload: CreateUserWithWalletPayload!) {
    createUserWithWallet(payload: $payload) {
      ... on CreateUserResponseSuccess {
        user {
          id
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
export const GET_WALLET_LOGIN_TOKEN = gql`
  mutation Mutation($payload: AuthenticateWalletPayload!) {
    authenticateWallet(payload: $payload) {
      ... on AuthenticateWalletResponseSuccess {
        token
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

export const GET_MY_PROFILE = gql`
  query GetMyProfileSuccess {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          id
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
