import { gql } from '@apollo/client'

export interface BulkCreateReferralResponseFE {
  __typename: 'BulkCreateReferralResponseSuccess'
  csv: string
}
export const BULK_CREATE_REFERRAL = gql`
  mutation Mutation($payload: BulkCreateReferralPayload!) {
    bulkCreateReferral(payload: $payload) {
      ... on BulkCreateReferralResponseSuccess {
        csv
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
