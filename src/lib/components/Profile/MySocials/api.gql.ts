import { gql } from '@apollo/client'
import { MySocialsFE } from '../api.gql'

export interface UpdateSocialsResponseFE {
  __typename: 'UpdateUserResponseSuccess'
  user: {
    socials: MySocialsFE
  }
}

export const UPDATE_USER_SOCIALS = gql`
  mutation Mutation($payload: UpdateUserPayload!) {
    updateUser(payload: $payload) {
      ... on UpdateUserResponseSuccess {
        user {
          socials {
            twitter
            instagram
            tiktok
            facebook
            snapchat
            discord
            twitch
            web
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
