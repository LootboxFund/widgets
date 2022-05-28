import { gql } from '@apollo/client'

export const GET_LOOTBOX = gql`
  query GetLootboxByAddress($address: ID!) {
    getLootboxByAddress(address: $address) {
      ... on LootboxResponseSuccess {
        lootbox {
          address
          id
        }
      }
    }
  }
`
