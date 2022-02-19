import React from 'react'
import ReactDOM from 'react-dom'

import UserTickets from 'lib/components/UserTickets'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('user-tickets')
  ReactDOM.render(
    <React.StrictMode>
      <UserTickets />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
