import React from 'react'
import ReactDOM from 'react-dom'
import BattleFeed from 'lib/components/BattleFeed'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('battle-feed')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BattleFeed />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
