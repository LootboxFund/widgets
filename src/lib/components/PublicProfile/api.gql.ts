import { gql } from '@apollo/client'

export const GET_USER_CLAIMS = gql`
  query UserClaims($userId: ID!, $first: Int!, $after: Timestamp) {
    userClaims(userId: $userId, first: $first, after: $after) {
      ... on UserClaimsResponseSuccess {
        totalCount
        edges {
          cursor
          node {
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
            timestamps {
              createdAt
              updatedAt
              deletedAt
            }
            chosenPartyBasket {
              id
              address
              factory
              creatorId
              creatorAddress
              lootboxAddress
              name
              chainIdHex
              lootboxSnapshot {
                address
                issuer
                description
                name
                stampImage
                image
                backgroundColor
                backgroundImage
                metadataDownloadUrl
              }
              nftBountyValue
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
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
