import { gql } from '@apollo/client'
import { Address } from '@wormgraph/helpers'
import { PartyBasketStatus, StreamType, Tournament } from 'lib/api/graphql/generated/types'
import { PartyBasketID, StreamID, TournamentID, UserID } from 'lib/types'

export interface PartyBasketFE {
  id: PartyBasketID
  name?: string
  nftBountyValue?: string
  address: Address
  status?: PartyBasketStatus
  joinCommunityUrl?: string
}

export interface BattlePageLootboxSnapshotFE {
  address: Address
  name?: string
  stampImage?: string
  description?: string
  socials: {
    twitter?: string
    instagram?: string
    tiktok?: string
    facebook?: string
    discord?: string
    youtube?: string
    snapchat?: string
    twitch?: string
    web?: string
  }
  partyBaskets: PartyBasketFE[]
}

export interface TournamentStreamsFE {
  id: StreamID
  creatorId: UserID
  type: StreamType
  url: string
  name?: string
}

export interface TournamentFE {
  id: TournamentID
  title?: string
  description?: string
  tournamentLink?: string
  magicLink?: string
  // tournamentDate?: number
  prize?: string
  coverPhoto?: string
  communityURL?: string
  streams: TournamentStreamsFE[]
  lootboxSnapshots: BattlePageLootboxSnapshotFE[]
}

export interface BattlePageResponseSuccessFE {
  __typename: 'BattlePageResponseSuccess'
  tournament: TournamentFE
}

export const GET_TOURNAMENT_BATTLE_PAGE = gql`
  query Query($id: ID!) {
    tournament(id: $id) {
      ... on TournamentResponseSuccess {
        tournament {
          id
          title
          description
          tournamentLink
          magicLink
          coverPhoto
          prize
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
              status
              joinCommunityUrl
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
