import React from 'react'
import ReactDOM from 'react-dom'

import UserTickets from 'lib/components/UserTickets'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'
import AuthProvider from 'lib/hooks/useAuth/AuthProvider'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('user-tickets')
  ReactDOM.render(
    <React.StrictMode>
      <LocalizationWrapper>
        <AuthProvider>
          <UserTickets />
        </AuthProvider>
      </LocalizationWrapper>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
