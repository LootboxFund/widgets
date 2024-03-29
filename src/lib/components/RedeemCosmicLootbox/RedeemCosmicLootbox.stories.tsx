import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import RedeemCosmicLootbox from './index'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../LocalizationWrapper'
import AuthProvider from 'lib/hooks/useAuth/AuthProvider'
import BeforeAirdropAdProvider from 'lib/hooks/useBeforeAirdropAd'

export default {
  title: 'RedeemCosmicLootbox',
  component: RedeemCosmicLootbox,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
    }
    load()
  }, [])

  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <AuthProvider>
          <BeforeAirdropAdProvider>
            <$CardViewport width="100%" maxWidth="920px" margin="0 auto">
              <RedeemCosmicLootbox />
              <br />
              <br />
            </$CardViewport>
          </BeforeAirdropAdProvider>
        </AuthProvider>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
