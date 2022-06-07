import React from 'react'
import ReactDOM from 'react-dom'
// import Authentication from 'lib/components/Authentication'
import AuthenticationPage from 'lib/components/Authentication/Authentication.page'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('authentication')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <AuthenticationPage />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
