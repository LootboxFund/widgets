import { gql } from '@apollo/client'
import { Address } from '@wormgraph/helpers'
import { ClaimStatus, ClaimType, PartyBasketStatus } from 'lib/api/graphql/generated/types'
import { ClaimID, ReferralID, PartyBasketID, ReferralSlug, TournamentID, UserID } from 'lib/types'

export const COMPLETE_CLAIM = gql`
  mutation Mutation($payload: CompleteClaimPayload!) {
    completeClaim(payload: $payload) {
      ... on CompleteClaimResponseSuccess {
        claim {
          id
          referralId
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

export interface OnboardingTournamentFE {
  title?: string
  description?: string
  tournamentDate?: number
  lootboxSnapshots: {
    address: Address
    stampImage?: string
  }[]
}

export interface ReferralFE {
  slug: ReferralSlug
  seedPartyBasketId?: PartyBasketID
  nConversions?: number
  campaignName?: string
  tournamentId: TournamentID
  tournament: OnboardingTournamentFE
  seedPartyBasket: {
    nftBountyValue?: string
    lootboxAddress: Address
  }
}

export interface ReferralResponseFE {
  __typename: 'ReferralResponseSuccess'
  referral: ReferralFE
}

export const GET_REFERRAL = gql`
  query Query($slug: ID!) {
    referral(slug: $slug) {
      ... on ReferralResponseSuccess {
        referral {
          slug
          seedPartyBasketId
          nConversions
          campaignName
          tournamentId
          tournament {
            title
            description
            tournamentDate
            lootboxSnapshots {
              address
              stampImage
            }
          }
          seedPartyBasket {
            nftBountyValue
            lootboxAddress
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

export interface PartyBasketFE {
  id: PartyBasketID
  name?: string
  nftBountyValue?: string
  address: Address
  lootboxAddress?: Address
  status?: PartyBasketStatus
}

export interface LootboxSnapshotFE {
  address: Address
  name?: string
  stampImage?: string
  description?: string
  partyBaskets: PartyBasketFE[]
}
export interface LotteryListingFE {
  __typename: 'LotteryListingResponseSuccess'
  tournament: {
    lootboxSnapshots: LootboxSnapshotFE[]
  }
}

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
