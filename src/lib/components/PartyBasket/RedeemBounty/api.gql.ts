import { gql } from '@apollo/client'

export const MUTATION_GET_WHITELIST_SIGNATURES = gql`
  mutation Mutation($payload: GetWhitelistSignaturesPayload!) {
    getWhitelistSignatures(payload: $payload) {
      ... on GetWhitelistSignaturesResponseSuccess {
        signatures {
          signature
          isRedeemed
          nonce
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

export const GET_PARTY_BASKET_FOR_REDEMPTION = gql`
  query GetPartyBasket($address: ID!) {
    getPartyBasket(address: $address) {
      ... on GetPartyBasketResponseSuccess {
        partyBasket {
          address
          name
          nftBountyValue
          lootboxSnapshot {
            name
            address
            stampImage
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
