import React from 'react'
import ReactDOM from 'react-dom'

import ManagementPage from 'lib/components/ManagementPage'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('manage-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ManagementPage />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
