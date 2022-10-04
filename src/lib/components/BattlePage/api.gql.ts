import { gql } from '@apollo/client'
import { Address, LootboxID, PartyBasketID, StreamID, TournamentID, UserID } from '@wormgraph/helpers'
import {
  LootboxStatus,
  LootboxTournamentStatus,
  PartyBasketStatus,
  StreamType,
  Tournament,
} from 'lib/api/graphql/generated/types'

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
  lootboxID: LootboxID
  stampImage?: string
  status?: LootboxTournamentStatus
  lootbox: {
    name?: string
    description?: string
    status?: LootboxStatus
    nftBountyValue?: string
    joinCommunityUrl?: string
  }
  // socials: {
  //   twitter?: string
  //   instagram?: string
  //   tiktok?: string
  //   facebook?: string
  //   discord?: string
  //   youtube?: string
  //   snapchat?: string
  //   twitch?: string
  //   web?: string
  // }
  partyBaskets: PartyBasketFE[]
}

export interface TournamentStreamsFE {
  id: StreamID
  creatorId: UserID
  type: StreamType
  url: string
  name?: string
}

export interface LootboxTournamentSnapshotFE {
  address: Address
  lootboxID: LootboxID
  stampImage: string
  status: LootboxTournamentStatus
  name: string
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
  isPostCosmic?: boolean
  streams: TournamentStreamsFE[]
  lootboxSnapshots: BattlePageLootboxSnapshotFE[]
  // paginateLootboxSnapshots: {
  //   edges: {
  //     node: LootboxTournamentSnapshotFE
  //     cursor: LootboxTournamentSnapshotID
  //   }[]
  //   pageInfo: {
  //     hasNextPage: boolean
  //   }
  // }
}

export interface BattlePageResponseSuccessFE {
  __typename: 'TournamentResponseSuccess'
  tournament: TournamentFE
}

export const GET_TOURNAMENT_BATTLE_PAGE = gql`
  # query Query($id: ID!, $first: Int = 30, $after: ID) {
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
          isPostCosmic
          streams {
            id
            creatorId
            type
            url
            name
          }
          # paginateLootboxSnapshots(first: $first, after: $after) {
          #   edges {
          #     node {
          #       address
          #       lootboxID
          #       stampImage
          #       status
          #       name
          #     }
          #     cursor
          #   }
          #   pageInfo {
          #     hasNextPage
          #   }
          # }
          lootboxSnapshots {
            address
            stampImage
            status
            lootboxID
            lootbox {
              name
              status
              description
              nftBountyValue
              joinCommunityUrl
            }
            # socials {
            #   twitter
            #   instagram
            #   tiktok
            #   facebook
            #   discord
            #   youtube
            #   snapchat
            #   twitch
            #   web
            # }
            # deprecated
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
