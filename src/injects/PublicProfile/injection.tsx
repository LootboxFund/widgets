import React from 'react'
import ReactDOM from 'react-dom'
import PublicProfile from 'lib/components/PublicProfile'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'
import AuthProvider from 'lib/hooks/useAuth/AuthProvider'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('public-profile')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <AuthProvider>
            <PublicProfile />
          </AuthProvider>
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
