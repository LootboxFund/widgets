import React from 'react'
import ReactDOM from 'react-dom'
import Profile from 'lib/components/Profile'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('my-profile')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <Profile />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
