import { gql } from '@apollo/client'

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
          claimerIsNewUser
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
