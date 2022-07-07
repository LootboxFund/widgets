import React from 'react'
import ReactDOM from 'react-dom'
import LootboxFeed from 'lib/components/LootboxFeed'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('lootbox-feed')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LootboxFeed />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
