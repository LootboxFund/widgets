import React from 'react'
import ReactDOM from 'react-dom'
import TournamentCreate from 'lib/components/Tournament/CreateTournament'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('tournament-create')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <TournamentCreate />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
