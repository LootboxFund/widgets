import React from 'react'
import ReactDOM from 'react-dom'
import RedeemCosmicLootbox from 'lib/components/RedeemCosmicLootbox'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'
import AuthProvider from 'lib/hooks/useAuth/AuthProvider'
import BeforeAirdropAdProvider from 'lib/hooks/useBeforeAirdropAd'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('redeem-cosmic-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LocalizationWrapper>
          <AuthProvider>
            <BeforeAirdropAdProvider>
              <RedeemCosmicLootbox />
            </BeforeAirdropAdProvider>
          </AuthProvider>
        </LocalizationWrapper>
      </ApolloProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
