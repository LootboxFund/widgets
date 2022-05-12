import React from 'react'
import ReactDOM from 'react-dom'

import BadgeMinterBCS from 'lib/components/BadgeMinter'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('badge-minter')
  ReactDOM.render(
    <React.StrictMode>
      <BadgeMinterBCS />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
