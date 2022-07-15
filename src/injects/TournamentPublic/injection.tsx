import React from 'react'
import ReactDOM from 'react-dom'
import TournamentPublic from 'lib/components/Tournament/PublicTournament'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('tournament-public')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <TournamentPublic />
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
