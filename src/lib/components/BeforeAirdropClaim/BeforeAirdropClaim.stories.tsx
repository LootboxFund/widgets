import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import BeforeAirdropClaim from './index'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'BeforeAirdropClaim',
  component: BeforeAirdropClaim,
}

const Template = () => {
  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <$CardViewport width="100%" maxWidth="1200px" margin="0 auto">
          <BeforeAirdropClaim />
        </$CardViewport>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
