import React from 'react'
import ProfileSocials, { ProfileSocialsProps } from 'lib/components/ProfileSocials'
import LocalizationWrapper from '../LocalizationWrapper'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'

export default {
  title: 'ProfileSocials',
  component: ProfileSocials,
}

const Demo = (args: ProfileSocialsProps) => (
  <ApolloProvider client={client}>
    <LocalizationWrapper>
      <ProfileSocials {...args} />
    </LocalizationWrapper>
  </ApolloProvider>
)

export const Basic = Demo.bind({})
Basic.args = {}
