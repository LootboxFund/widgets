import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import Authentication from './index'
import { manifest } from 'manifest'
import LocalizationWrapper from '../Internationalization/LocalizationWrapper'

export default {
  title: 'Authentication',
  component: <Authentication />,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for Authentication Widget', err)
      }
    }
    load().catch((err) => console.error('Error loading Authentication Widget', err))
  }, [])

  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <$CardViewport width="100%" maxWidth="900px" height="auto" margin="0 auto">
          <Authentication onSignupSuccess={() => window.open(manifest.microfrontends.webflow.myProfilePage, '_self')} />
        </$CardViewport>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
