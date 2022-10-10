import { gql } from '@apollo/client'
import {
  Address,
  ClaimID,
  ReferralID,
  PartyBasketID,
  ReferralSlug,
  TournamentID,
  UserID,
  LootboxID,
  AffiliateID,
} from '@wormgraph/helpers'
import { CreativeType, ClaimStatus, ClaimType, PartyBasketStatus, LootboxStatus } from 'lib/api/graphql/generated/types'

export const COMPLETE_CLAIM = gql`
  mutation Mutation($payload: CompleteClaimPayload!) {
    completeClaim(payload: $payload) {
      ... on CompleteClaimResponseSuccess {
        claim {
          id
          referralId
          referralSlug
          promoterId
          tournamentId
          referrerId
          chosenPartyBasketId
          chosenPartyBasketAddress
          lootboxAddress
          rewardFromClaim
          claimerUserId
          status
          type
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

/** @deprecated */
export interface PartyBasketFE {
  id: PartyBasketID
  name?: string
  nftBountyValue?: string
  address: Address
  lootboxAddress?: Address
  status?: PartyBasketStatus
}

export interface LootboxReferralSnapshot {
  lootboxID?: LootboxID
  address: Address
  stampImage: string
  lootbox: {
    id: LootboxID
    name?: string
    description?: string
    nftBountyValue?: string
    status?: LootboxStatus
  }
}

/** @deprecated use LootboxReferralSnapshot */
export interface LootboxSnapshotFE {
  address: Address
  name?: string
  stampImage?: string
  description?: string
  /** @deprecated */
  partyBaskets: PartyBasketFE[]
}
/** @deprecated use LotteryListingV2FE */
export interface LotteryListingFE {
  __typename: 'TournamentResponseSuccess'
  tournament: {
    lootboxSnapshots: LootboxSnapshotFE[]
  }
}

export interface LotteryListingV2FE {
  __typename: 'TournamentResponseSuccess'
  tournament: {
    lootboxSnapshots: LootboxReferralSnapshot[]
  }
}

export const GET_LOTTERY_LISTINGS_V2 = gql`
  query Query($id: ID!) {
    tournament(id: $id) {
      ... on TournamentResponseSuccess {
        tournament {
          lootboxSnapshots {
            lootboxID
            address
            stampImage
            lootbox {
              id
              name
              description
              nftBountyValue
              status
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

/** @deprecated this uses party baskets */
export const GET_LOTTERY_LISTINGS = gql`
  query Query($id: ID!) {
    tournament(id: $id) {
      ... on TournamentResponseSuccess {
        tournament {
          lootboxSnapshots {
            address
            name
            stampImage
            description
            partyBaskets {
              id
              name
              nftBountyValue
              address
              lootboxAddress
              status
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

export interface ClaimFE {
  id: ClaimID
  referralId: ReferralID
  promoterId?: AffiliateID
  referralSlug: ReferralSlug
  tournamentId: TournamentID
  referrerId?: UserID
  chosenPartyBasketId?: PartyBasketID
  chosenPartyBasketAddress?: Address
  lootboxAddress?: Address
  rewardFromClaim?: string
  claimerUserId?: UserID
  status?: ClaimStatus
  type?: ClaimType
}

export interface CreateClaimResponseFE {
  __typename: 'CreateClaimResponseSuccess'
  claim: ClaimFE
}

export const CREATE_CLAIM = gql`
  mutation Mutation($payload: CreateClaimPayload!) {
    createClaim(payload: $payload) {
      ... on CreateClaimResponseSuccess {
        claim {
          id
          referralId
          promoterId
          referralSlug
          tournamentId
          referrerId
          chosenPartyBasketId
          chosenPartyBasketAddress
          lootboxAddress
          rewardFromClaim
          claimerUserId
          status
          type
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
