import { gql } from '@apollo/client'
import { Address, ChainIDHex } from '@wormgraph/helpers'
import { PartyBasketStatus } from 'lib/api/graphql/generated/types'
import { PartyBasketID, UserID } from 'lib/types'

export interface PartyBasketFE {
  __typename: 'PartyBasketResponseSuccess'
  partyBasket: {
    id: PartyBasketID
    creatorId: UserID
    address: Address
    name?: string
    chainIdHex?: ChainIDHex
    nftBountyValue?: string
    joinCommunityUrl?: string
    status: PartyBasketStatus
    maxClaimsAllowed?: number
    lootboxSnapshot: {
      name?: string
      address: Address
      stampImage?: string
    }
  }
}

export const GET_PARTY_BASKET = gql`
  query GetPartyBasket($partyBasketAddress: ID!) {
    getPartyBasket(address: $partyBasketAddress) {
      ... on GetPartyBasketResponseSuccess {
        partyBasket {
          id
          creatorId
          address
          name
          chainIdHex
          nftBountyValue
          joinCommunityUrl
          status
          maxClaimsAllowed
          lootboxSnapshot {
            name
            address
            stampImage
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

export interface EditPartyBasketResponseFE {
  __typename: 'EditPartyBasketResponseSuccess'
  partyBasket: {
    id: PartyBasketID
  }
}

export const EDIT_PARTY_BASKET = gql`
  mutation EditPartyBasket($payload: EditPartyBasketPayload!) {
    editPartyBasket(payload: $payload) {
      ... on EditPartyBasketResponseSuccess {
        partyBasket {
          id
          # address
          # factory
          # creatorId
          # creatorAddress
          # lootboxAddress
          # name
          # chainIdHex
          # nftBountyValue
          # joinCommunityUrl
          # status
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
