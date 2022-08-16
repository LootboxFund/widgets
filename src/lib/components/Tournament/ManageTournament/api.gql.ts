import { gql } from '@apollo/client'

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
