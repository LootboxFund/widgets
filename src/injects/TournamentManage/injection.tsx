import React from 'react'
import ReactDOM from 'react-dom'
import TournamentManage from 'lib/components/Tournament/ManageTournament'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('tournament-manage')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <TournamentManage />
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
