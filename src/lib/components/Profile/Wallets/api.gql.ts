import { gql } from '@apollo/client'

export const GET_MY_WALLETS = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          wallets {
            id
            address
            createdAt
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
export const REMOVE_WALLET = gql`
  mutation Mutation($payload: RemoveWalletPayload!) {
    removeWallet(payload: $payload) {
      ... on RemoveWalletResponseSuccess {
        id
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
