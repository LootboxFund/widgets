import { gql } from '@apollo/client'
import { Address, StreamID, TournamentID, UserID } from '@wormgraph/helpers'
import { StreamType } from 'lib/api/graphql/generated/types'

export const DELETE_STREAM = gql`
  mutation deleteStream($id: ID!) {
    deleteStream(id: $id) {
      ... on DeleteStreamResponseSuccess {
        stream {
          id
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

export const ADD_STREAM = gql`
  mutation Mutation($payload: AddStreamPayload!) {
    addStream(payload: $payload) {
      ... on AddStreamResponseSuccess {
        stream {
          id
          tournamentId
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

export const EDIT_STREAM = gql`
  mutation Mutation($payload: EditStreamPayload!) {
    editStream(payload: $payload) {
      ... on EditStreamResponseSuccess {
        stream {
          id
          tournamentId
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

export interface EditTournamentResponseFE {
  __typename: 'EditTournamentResponseSuccess'
  tournament: {
    id: TournamentID
    title: string
    description: string
    tournamentLink?: string
    magicLink?: string
    tournamentDate?: string
    prize?: string
    coverPhoto?: string
    communityURL?: string
  }
}

export const EDIT_TOURNAMENT = gql`
  mutation Mutation($payload: EditTournamentPayload!) {
    editTournament(payload: $payload) {
      ... on EditTournamentResponseSuccess {
        tournament {
          id
          title
          description
          tournamentLink
          magicLink
          tournamentDate
          prize
          coverPhoto
          communityURL
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

export interface MyTournamentLootboxSnapshot {
  address: Address
  name: string
  stampImage?: string
}

export interface MyTournamentStreamsFE {
  id: StreamID
  creatorId: UserID
  type: StreamType
  url: string
  name: string
}

export interface MyTournamentFE {
  __typename: 'MyTournamentResponseSuccess'
  tournament: {
    id?: TournamentID
    title?: string
    description?: string
    tournamentLink?: string
    magicLink?: string
    tournamentDate?: number
    prize?: string
    coverPhoto?: string
    communityURL?: string
    streams: MyTournamentStreamsFE[]
    lootboxSnapshots: MyTournamentLootboxSnapshot[]
  }
}

export const GET_MY_TOURNAMENT = gql`
  query Query($id: ID!) {
    myTournament(id: $id) {
      ... on MyTournamentResponseSuccess {
        tournament {
          id
          title
          description
          tournamentLink
          magicLink
          tournamentDate
          prize
          coverPhoto
          communityURL
          streams {
            id
            creatorId
            type
            url
            name
          }
          lootboxSnapshots {
            address
            name
            stampImage
            status
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

export interface GenerateClaimsCsvFE {
  csv: string
  __typename: 'GenerateClaimsCsvResponseSuccess'
}
export const GET_CLAIMS_CSV = gql`
  mutation Mutation($payload: GenerateClaimsCsvPayload!) {
    generateClaimsCsv(payload: $payload) {
      ... on GenerateClaimsCsvResponseSuccess {
        csv
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
