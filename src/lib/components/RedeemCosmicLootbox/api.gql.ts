import { gql } from '@apollo/client'
import {
  Address,
  ChainIDHex,
  ClaimID,
  LootboxID,
  LootboxMintSignatureNonce,
  LootboxMintWhitelistID,
  LootboxTicketDigest,
  LootboxTicketID,
  LootboxTicketID_Web3,
  TournamentID,
} from '@wormgraph/helpers'
import { LootboxAirdropMetadata, LootboxStatus, ResponseError } from 'lib/api/graphql/generated/types'
import { LootboxAirdropMetadataQuestion } from '../../api/graphql/generated/types'

export interface UserClaimFE {
  id: ClaimID
  tournamentId: TournamentID
  timestamps: {
    createdAt: number
  }
  /** Only if claim whitelisted */
  whitelist?: {
    isRedeemed: boolean
    nonce: LootboxMintSignatureNonce
    lootboxTicketID: LootboxTicketID
    whitelistedAddress: Address
    digest: LootboxTicketDigest
    signature: string
    /** Only if user has minted */
    lootboxTicket?: {
      ticketID: LootboxTicketID_Web3
      stampImage: string
      metadataURL: string
      nonce: LootboxMintSignatureNonce
      digest: string
      minterAddress: Address
    }
  }
}

export interface LootboxRedemptionFE {
  id: LootboxID
  address: Address | null
  chainIdHex: ChainIDHex | null
  description: string
  status: LootboxStatus
  nftBountyValue?: string
  joinCommunityUrl?: string
  maxTickets: number
  stampImage: string
  runningCompletedClaims: number
  name: string
  symbol: string | null
  themeColor: string
  airdropMetadata?: LootboxAirdropMetadata
  airdropQuestions?: LootboxAirdropMetadataQuestion[]
}

export interface LootboxRedemptionClaimsFE {
  userClaims: {
    pageInfo: {
      endCursor: number | null
      hasNextPage: boolean
    }
    edges: {
      node: UserClaimFE
      cursor: number
    }[]
  }
}

export interface GetLootboxRedeemPageResponseFESuccess {
  __typename: 'LootboxResponseSuccess'
  lootbox: LootboxRedemptionFE
}

export interface GetLootboxRedemptionClaimsFESuccess {
  __typename: 'LootboxResponseSuccess'
  lootbox: LootboxRedemptionClaimsFE
}

export type GetLootboxRedeemPageResponseFE = { getLootboxByID: GetLootboxRedeemPageResponseFESuccess | ResponseError }

export type GetLootboxRedemptionClaimsFE = { getLootboxByID: GetLootboxRedemptionClaimsFESuccess | ResponseError }

export interface GetUserClaimCountFESuccess {
  __typename: 'LootboxResponseSuccess'
  lootbox: {
    userClaims: {
      totalCount: number | null
    }
  }
}

export type GetUserClaimCountFE = { getLootboxByID: GetUserClaimCountFESuccess | ResponseError }

export const GET_USER_CLAIM_COUNT = gql`
  query GetLootboxByID($id: ID!, $first: Int!) {
    getLootboxByID(id: $id) {
      ... on LootboxResponseSuccess {
        lootbox {
          userClaims(first: $first) {
            totalCount
          }
        }
      }
    }
  }
`

export const GET_LOOTBOX_REDEEM_PAGE = gql`
  query GetLootboxByID($id: ID!) {
    getLootboxByID(id: $id) {
      ... on LootboxResponseSuccess {
        lootbox {
          id
          address
          chainIdHex
          description
          status
          nftBountyValue
          joinCommunityUrl
          maxTickets
          stampImage
          runningCompletedClaims
          name
          symbol
          themeColor
          airdropMetadata {
            title
            oneLiner
            value
            instructionsLink
            instructionsCallToAction
            callToActionLink
            tournamentID
            organizerID
            advertiserName
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

export const GET_LOOTBOX_CLAIMS_TO_REDEEM = gql`
  query GetLootboxByID($id: ID!, $first: Int!, $cursor: UserClaimsCursor) {
    getLootboxByID(id: $id) {
      ... on LootboxResponseSuccess {
        lootbox {
          userClaims(first: $first, cursor: $cursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              node {
                id
                tournamentId
                timestamps {
                  createdAt
                }
                whitelist {
                  isRedeemed
                  nonce
                  lootboxTicketID
                  whitelistedAddress
                  signature
                  digest
                  lootboxTicket {
                    ticketID
                    stampImage
                    metadataURL
                    nonce
                    digest
                    minterAddress
                  }
                }
              }
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

export type WhitelistLootboxClaimsResponseFE = {
  whitelistMyLootboxClaims:
    | ResponseError
    | { __typename: 'WhitelistMyLootboxClaimsResponseSuccess'; signatures: [{ id: LootboxMintWhitelistID }] }
}

export const WHITELIST_ALL_LOOTBOX_CLAIMS = gql`
  mutation WhitelistMyLootboxClaims($payload: WhitelistMyLootboxClaimsPayload!) {
    whitelistMyLootboxClaims(payload: $payload) {
      ... on WhitelistMyLootboxClaimsResponseSuccess {
        signatures {
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

export const UPDATE_CLAIM_REDEMPTION_STATUS = gql`
  mutation UpdateClaimRedemptionStatus($payload: UpdateClaimRedemptionStatusPayload!) {
    updateClaimRedemptionStatus(payload: $payload) {
      ... on UpdateClaimRedemptionStatusResponseSuccess {
        claimID
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

export const CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS = gql`
  query CheckIfUserAnsweredAirdropQuestions($lootboxID: ID!) {
    checkIfUserAnsweredAirdropQuestions(lootboxID: $lootboxID) {
      ... on CheckIfUserAnsweredAirdropQuestionsResponseSuccess {
        status
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
