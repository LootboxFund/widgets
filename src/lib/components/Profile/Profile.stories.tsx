import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import Profile from './index'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../Internationalization/LocalizationWrapper'

export default {
  title: 'Profile',
  component: Profile,
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
        <$CardViewport width="100%" maxWidth="720px" margin="0 auto">
          <Profile />
          <br />
          <br />
        </$CardViewport>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
