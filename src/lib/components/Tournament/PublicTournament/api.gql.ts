import { gql } from '@apollo/client'

export const GET_TOURNAMENT = gql`
  query Query($id: ID!) {
    tournament(id: $id) {
      ... on TournamentResponseSuccess {
        tournament {
          title
          description
          tournamentLink
          lootboxSnapshots {
            address
            name
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
