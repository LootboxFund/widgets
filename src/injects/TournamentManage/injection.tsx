import React from 'react'
import ReactDOM from 'react-dom'
import TournamentManage from 'lib/components/Tournament/ManageTournament'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('authentication')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <TournamentManage />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
