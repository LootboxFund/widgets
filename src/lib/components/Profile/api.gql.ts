import { gql } from '@apollo/client'
import { UserSocials } from 'lib/api/graphql/generated/types'

export interface MySocialsFE {
  twitter: string | null
  instagram: string | null
  tiktok: string | null
  facebook: string | null
  discord: string | null
  snapchat: string | null
  twitch: string | null
  web: string | null
}

export interface MyProfileFE {
  __typename: 'GetMyProfileSuccess'
  user: {
    username?: string
    avatar?: string
    biography?: string
    headshot?: [string]
    socials: MySocialsFE
  }
}

export const GET_MY_PROFILE = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          username
          avatar
          biography
          headshot
          socials {
            twitter
            instagram
            tiktok
            facebook
            discord
            snapchat
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
