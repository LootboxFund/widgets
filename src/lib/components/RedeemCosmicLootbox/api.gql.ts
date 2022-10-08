import { gql } from '@apollo/client'
import {
  Address,
  ChainIDHex,
  LootboxID,
  LootboxMintSignatureNonce,
  LootboxTicketDigest,
  LootboxTicketID,
  LootboxTicketID_Web3,
  WhitelistSignatureID,
} from '@wormgraph/helpers'
import { LootboxStatus, ResponseError } from 'lib/api/graphql/generated/types'

export interface UserClaimFE {
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
  address: Address
  chainIdHex: ChainIDHex
  description: string
  status: LootboxStatus
  nftBountyValue?: string
  joinCommunityUrl?: string
  maxTickets: number
  stampImage: string
  runningCompletedClaims: number
  userClaims: UserClaimFE[]
  name: string
  symbol: string
  themeColor: string
}

export interface GetLootboxRedeemPageResponseFESuccess {
  __typename: 'LootboxResponseSuccess'
  lootbox: LootboxRedemptionFE
}

export type GetLootboxRedeemPageResponseFE = { getLootboxByID: GetLootboxRedeemPageResponseFESuccess | ResponseError }

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
          userClaims {
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
          #   mintWhitelistSignatures {
          #     id
          #     isRedeemed
          #     signature
          #     nonce
          #     lootboxTicketID
          #     lootboxTicket {
          #       lootboxAddress
          #       ticketID
          #       stampImage
          #       metadataURL
          #       lootboxID
          #     }
          #   }
          name
          symbol
          themeColor
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
