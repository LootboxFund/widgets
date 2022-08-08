import React from 'react'
import { $ViralOnboardingCard } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import Profile from './index'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../LocalizationWrapper'
import ViralOnboarding from './index'

export default {
  title: 'ViralOnboarding',
  component: ViralOnboarding,
}

const Template = () => {
  //   useEffect(() => {
  //     const load = async () => {
  //       try {
  //         await initDApp()
  //       } catch (err) {
  //         console.error('Error initializing DApp', err)
  //       }
  //     }
  //     load()
  //   }, [])

  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <$ViralOnboardingCard>
          <ViralOnboarding />
          <br />
          <br />
        </$ViralOnboardingCard>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
