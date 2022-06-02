import { gql } from '@apollo/client'

export const CREATE_TOURNAMENT = gql`
  mutation createTournament($payload: CreateTournamentPayload!) {
    createTournament(payload: $payload) {
      ... on CreateTournamentResponseSuccess {
        tournament {
          id
          title
          description
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
