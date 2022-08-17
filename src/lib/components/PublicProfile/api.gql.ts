import { gql } from '@apollo/client'
import { Address } from '@wormgraph/helpers'
import { UserSocials } from 'lib/api/graphql/generated/types'
import { ClaimID, PartyBasketID, TournamentID, UserID } from 'lib/types'

export type PublicUserGQLArgs = {
  publicUserId: UserID
}

export type PublicUserClaimsGQLArgs = {
  publicUserId: UserID
  first: number
  after?: string
}

export type PublicUserFEClaims = {
  id: ClaimID
  tournamentId: TournamentID
  chosenPartyBasket: {
    id: PartyBasketID
    address: Address
    name: string
    socialLink?: string
    lootboxSnapshot: {
      stampImage?: string
      name?: string
    }
  }
}

export type PublicUserLotteriesFE = {
  __typename: 'PublicUserResponseSuccess'
  user: {
    claims: {
      pageInfo: {
        hasNextPage?: boolean
        endCursor?: string | null
      }
      edges: {
        node: PublicUserFEClaims
      }[]
    }
  }
}

export interface PublicUserFE {
  __typename: 'PublicUserResponseSuccess'
  user: {
    id: UserID
    username?: string
    avatar?: string
    socials?: Partial<UserSocials>
    // claims: {
    //   pageInfo: {
    //     hasNextPage?: boolean
    //     endCursor?: string | null
    //   }
    //   edges: {
    //     node: PublicUserFEClaims
    //   }[]
    // }
  }
}

export const PUBLIC_USER_CLAIMS = gql`
  query PublicUser($publicUserId: ID!, $first: Int!, $after: Timestamp) {
    publicUser(id: $publicUserId) {
      ... on PublicUserResponseSuccess {
        user {
          claims(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                tournamentId
                chosenPartyBasket {
                  id
                  address
                  name
                  socialLink
                  lootboxSnapshot {
                    stampImage
                    name
                  }
                }
              }
              cursor
            }
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

export const PUBLIC_USER = gql`
  query PublicUser($publicUserId: ID!) {
    publicUser(id: $publicUserId) {
      ... on PublicUserResponseSuccess {
        user {
          id
          username
          avatar
          socials {
            twitter
            instagram
            tiktok
            facebook
            discord
            snapchat
            twitch
            web
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
