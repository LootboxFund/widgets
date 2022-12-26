import { gql } from '@apollo/client'

export const GET_AIRDROP_AD_BETA_V2 = gql`
  query DecisionAdAirdropV1($payload: DecisionAdAirdropV1Payload!) {
    decisionAdAirdropV1(payload: $payload) {
      ... on DecisionAdAirdropV1ResponseSuccess {
        ad {
          adID
          adSetID
          advertiserID
          advertiserName
          offerID
          creative {
            adID
            advertiserID
            creativeType
            creativeLinks
            callToAction
            thumbnail
            infographicLink
            aspectRatio
            themeColor
          }
          flightID
          placement
          pixelUrl
          clickDestination
          inheritedClaim {
            claimID
            promoterID
            referrerID
            tournamentID
          }
        }
        questions {
          id
          batch
          order
          question
          type
          mandatory
          options
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
