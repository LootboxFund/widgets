import { gql } from '@apollo/client'

export const CREATE_PARTY_BASKET = gql`
  mutation CreatePartyBasket($payload: CreatePartyBasketPayload!) {
    createPartyBasket(payload: $payload) {
      ... on CreatePartyBasketResponseSuccess {
        partyBasket {
          id
          address
          name
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
