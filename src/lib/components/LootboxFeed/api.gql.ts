import { gql } from '@apollo/client'

export const QUERY_LOOTBOX_FEED = gql`
  query LootboxFeed($first: Int!, $after: ID) {
    lootboxFeed(first: $first, after: $after) {
      ... on LootboxFeedResponseSuccess {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            stampImage
            address
          }
          cursor
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
