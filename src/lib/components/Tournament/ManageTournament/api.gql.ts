import { gql } from '@apollo/client'

export const EDIT_TOURNAMENT = gql`
  mutation Mutation($payload: EditTournamentPayload!) {
    editTournament(payload: $payload) {
      ... on EditTournamentResponseSuccess {
        tournament {
          id
          title
          description
          tournamentLink
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
