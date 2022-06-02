import PublicTournament from './index'
import { $CardViewport } from '../../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'

export default {
  title: 'PublicTournament',
  component: PublicTournament,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp in PublicTournament stories', err)
      }
    }
    load().catch((err) => console.error('Error loading ticket data', err))
  }, [])

  return (
    <ApolloProvider client={client}>
      <$CardViewport width="100%" maxWidth="720px" margin="0 auto">
        <PublicTournament />
      </$CardViewport>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}