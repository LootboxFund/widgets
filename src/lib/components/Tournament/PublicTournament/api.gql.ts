import { gql } from '@apollo/client'
import { Address } from '@wormgraph/helpers'
import { StreamType } from 'lib/api/graphql/generated/types'
import { StreamID, UserID } from 'lib/types'

export interface TournamentLootboxSnapshot {
  address: Address
  name: string
  stampImage?: string
}

export interface TournamentStreamsFE {
  id: StreamID
  creatorId: UserID
  type: StreamType
  url: string
  name: string
}

export interface TournamentFE {
  __typename: 'TournamentResponseSuccess'
  tournament: {
    title?: string
    description?: string
    tournamentLink?: string
    magicLink?: string
    tournamentDate?: number
    prize?: string
    coverPhoto?: string
    streams: TournamentStreamsFE[]
    lootboxSnapshots: TournamentLootboxSnapshot[]
  }
}

export const GET_TOURNAMENT = gql`
  query Query($id: ID!) {
    tournament(id: $id) {
      ... on TournamentResponseSuccess {
        tournament {
          title
          description
          tournamentLink
          magicLink
          coverPhoto
          lootboxSnapshots {
            address
            name
            stampImage
          }
          streams {
            id
            creatorId
            type
            url
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
