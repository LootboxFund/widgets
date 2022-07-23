import { gql } from '@apollo/client'

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
