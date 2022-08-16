import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import SignOut from './index'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'SignOut',
  component: SignOut,
}

const Template = () => {
  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <$CardViewport width="100%" maxWidth="720px" margin="0 auto">
          <SignOut />
          <br />
          <br />
        </$CardViewport>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}