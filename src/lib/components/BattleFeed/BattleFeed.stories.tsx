import React from 'react'
import BattleFeed from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ContractAddress } from '@wormgraph/helpers'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'

export default {
  title: 'BattleFeed',
  component: BattleFeed,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for Battle Feed', err)
      }
    }
    load().catch((err) => console.error('Error loading battle feed widget', err))
  }, [])

  return (
    <ApolloProvider client={client}>
      <$CardViewport width="100%" maxWidth="900px" height="auto" margin="0 auto">
        <BattleFeed />
      </$CardViewport>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
