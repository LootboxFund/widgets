import { gql } from '@apollo/client'

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
