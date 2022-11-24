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
import {
  ClaimStatus,
  ClaimType,
  PartyBasketStatus,
  LootboxStatus,
  LootboxTournamentStatus,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { LootboxReferralFE } from 'lib/hooks/useViralOnboarding/api.gql'

export type CompleteClaimResponseSuccessFE = {
  completeClaim:
    | {
        __typename: 'CompleteClaimResponseSuccess'
        claim: {
          id: ClaimID
        }
      }
    | {
        __typename: 'ResponseError'
        error: ResponseError
      }
}

export const COMPLETE_CLAIM = gql`
  mutation Mutation($payload: CompleteClaimPayload!) {
    completeClaim(payload: $payload) {
      ... on CompleteClaimResponseSuccess {
        claim {
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
  status: LootboxTournamentStatus
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
          lootboxSnapshots(status: active) {
            lootboxID
            address
            stampImage
            status
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

export interface GetAnonTokenResponseSuccessFE {
  getAnonToken: {
    __typename: 'GetAnonTokenResponseSuccess'
    token: string
    email: string
  }
}

export const GET_ANON_TOKEN = gql`
  query GetAnonToken($idToken: ID!) {
    getAnonToken(idToken: $idToken) {
      ... on GetAnonTokenResponseSuccess {
        token
        email
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

export interface GetAnonTokenV2ResponseSuccessFE {
  getAnonTokenV2: {
    __typename: 'GetAnonTokenResponseSuccess'
    token: string
    email: string
  }
}

export const GET_ANON_TOKEN_V2 = gql`
  query GetAnonTokenV2($userID: ID!) {
    getAnonTokenV2(userID: $userID) {
      ... on GetAnonTokenResponseSuccess {
        token
        email
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

export type CheckPhoneEnabledResponseFE = {
  checkPhoneEnabled:
    | {
        __typename: 'CheckPhoneEnabledResponseSuccess'
        isEnabled: boolean
      }
    | ResponseError
}
export const CHECK_PHONE_AUTH = gql`
  query Query($email: String!) {
    checkPhoneEnabled(email: $email) {
      ... on CheckPhoneEnabledResponseSuccess {
        isEnabled
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

export interface ClaimByIDResponse {
  claimByID:
    | {
        __typename: 'ClaimByIDResponseSuccess'
        claim: ClaimFE
      }
    | {
        __typename: 'ResponseError'
        error: ResponseError
      }
}

export const CLAIM_BY_ID = gql`
  query GetClaimByID($claimID: ID!) {
    claimByID(claimID: $claimID) {
      ... on ClaimByIDResponseSuccess {
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

export interface GetLootboxViralOnboardingResponse {
  getLootboxByID:
    | {
        __typename: 'LootboxResponseSuccess'
        lootbox: LootboxReferralFE
      }
    | {
        __typename: 'ResponseError'
        error: {
          code: string
          message: string
        }
      }
}

export const GET_LOOTBOX_VIRAL_ONBOARDING = gql`
  query GetLootboxByID($id: ID!) {
    getLootboxByID(id: $id) {
      ... on LootboxResponseSuccess {
        lootbox {
          id
          nftBountyValue
          address
          stampImage
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

export type SyncProviderUserResponseFE = {
  syncProviderUser:
    | {
        __typename: 'SyncProviderUserResponseSuccess'
        user: {
          phoneNumber: string | null
          email: string | null
          id: UserID
        }
      }
    | ResponseError
}

export const SYNC_PROVIDER_USER = gql`
  mutation syncProviderUser {
    syncProviderUser {
      ... on SyncProviderUserResponseSuccess {
        user {
          phoneNumber
          email
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

export interface TruncatedEmailByPhoneResponseFE {
  truncatedEmailByPhone:
    | {
        __typename: 'TruncatedEmailByPhoneResponseSuccess'
        email: string
      }
    | ResponseError
}

export const TRUNCATED_EMAIL_BY_PHONE = gql`
  query TruncatedEmailByPhone($phoneNumber: String!) {
    truncatedEmailByPhone(phoneNumber: $phoneNumber) {
      ... on TruncatedEmailByPhoneResponseSuccess {
        email
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
