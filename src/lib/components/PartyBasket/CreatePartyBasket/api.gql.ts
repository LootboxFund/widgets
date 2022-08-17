import { gql } from '@apollo/client'
import { Address } from '@wormgraph/helpers'
import { PartyBasketID } from 'lib/types'

export interface CreatePartyBasketFE { 
  __typename: 'CreatePartyBasketResponseSuccess',
  partyBasket: {
    id: PartyBasketID
    address: Address
    name: string
  }
}

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
