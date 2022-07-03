import React from 'react'
import ReactDOM from 'react-dom'

import PartyBasketRedeem from 'lib/components/PartyBasket/RedeemBounty'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('party-basket-redeem')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <PartyBasketRedeem />
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
