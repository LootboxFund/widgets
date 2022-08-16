import React from 'react'
import ReactDOM from 'react-dom'
import SignOut from 'lib/components/SignOut'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('sign-out')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <SignOut />
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
