import { gql } from '@apollo/client'

export const GET_MY_PARTY_BASKETS = gql`
  query Query($address: ID!) {
    getLootboxByAddress(address: $address) {
      ... on LootboxResponseSuccess {
        lootbox {
          partyBaskets {
            id
            address
            name
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
