import React from 'react'
import ReactDOM from 'react-dom'
import Authentication from 'lib/components/Authentication'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('authentication')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <Authentication />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
