import React from 'react'
import ReactDOM from 'react-dom'
import BattlePage from 'lib/components/BattlePage'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('battle-page')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <BattlePage />
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
