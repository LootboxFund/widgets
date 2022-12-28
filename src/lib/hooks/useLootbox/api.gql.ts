import gql from 'graphql-tag'

export const GET_VOUCHER_DEPOSITS = gql`
  query GetLootboxDeposits($lootboxID: ID!) {
    getLootboxDeposits(lootboxID: $lootboxID) {
      ... on GetLootboxDepositsResponseSuccess {
        deposits {
          id
          title
          createdAt
          oneTimeVouchersCount
          hasReuseableVoucher
          # isRedeemed
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
