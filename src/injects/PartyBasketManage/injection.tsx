import React from 'react'
import ReactDOM from 'react-dom'

import ManagePartyBasket from 'lib/components/PartyBasket/ManagePartyBasket'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('party-basket-manage')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ManagePartyBasket />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
