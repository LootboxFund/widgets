import React from 'react'
import ReactDOM from 'react-dom'

import TicketMinter from 'lib/components/TicketMinter'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('ticket-minter')
  ReactDOM.render(
    <React.StrictMode>
      <TicketMinter />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
