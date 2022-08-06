import { gql } from '@apollo/client'

export const GET_TOURNAMENT_BATTLE_PAGE = gql`
  query Query($id: ID!) {
    tournament(id: $id) {
      ... on TournamentResponseSuccess {
        tournament {
          title
          description
          tournamentLink
          magicLink
          coverPhoto
          prize
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
            description
            socials {
              twitter
              instagram
              tiktok
              facebook
              discord
              youtube
              snapchat
              twitch
              web
            }
            partyBaskets {
              id
              name
              nftBountyValue
              address
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
