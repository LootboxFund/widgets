import gql from 'graphql-tag'

export const GET_VOUCHER_DEPOSIT_FOR_FAN = gql`
  query GetVoucherOfDepositForFan($payload: GetVoucherOfDepositForFanPayload!) {
    getVoucherOfDepositForFan(payload: $payload) {
      ... on ResponseError {
        error {
          code
          message
        }
      }
      ... on GetVoucherOfDepositForFanResponseSuccess {
        voucher {
          id
          title
          code
          url
          isRedeemed
        }
      }
    }
  }
`
