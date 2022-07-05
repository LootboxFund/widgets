import { gql } from '@apollo/client'

export const GET_PARTY_BASKET = gql`
  query GetPartyBasket($partyBasketAddress: ID!) {
    getPartyBasket(address: $partyBasketAddress) {
      ... on GetPartyBasketResponseSuccess {
        partyBasket {
          address
          name
          lootboxSnapshot {
            name
            address
          }
          chainIdHex
          creatorId
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

export const BULK_WHITELIST_MUTATION = gql`
  mutation Mutation($payload: BulkWhitelistPayload!) {
    bulkWhitelist(payload: $payload) {
      ... on BulkWhitelistResponseSuccess {
        signatures
        errors
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
