import React from 'react'
import ReactDOM from 'react-dom'
import AuthenticateAnonUsers from 'lib/components/ViralOnboarding/AuthenticateAnonUsers'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'
import AuthProvider from 'lib/hooks/useAuth/AuthProvider'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('authenticate-anon-users')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <AuthProvider>
            <AuthenticateAnonUsers />
          </AuthProvider>
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
