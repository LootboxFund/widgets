import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import MyTickets from './index'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../LocalizationWrapper'
import AuthProvider from 'lib/hooks/useAuth/AuthProvider'

export default {
  title: 'PublicProfileRedirect',
  component: MyTickets,
}

const Template = () => {
  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <AuthProvider>
          <$CardViewport width="100%" maxWidth="720px" margin="0 auto">
            <MyTickets />
            <br />
            <br />
          </$CardViewport>
        </AuthProvider>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
