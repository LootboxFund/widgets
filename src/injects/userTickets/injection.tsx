import React from 'react'
import ReactDOM from 'react-dom'

import UserTickets from 'lib/components/UserTickets'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('user-tickets')
  ReactDOM.render(
    <React.StrictMode>
      <LocalizationWrapper>
        <UserTickets />
      </LocalizationWrapper>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
