import React from 'react'
import ReactDOM from 'react-dom'

import BadgeFactoryBCS from 'lib/components/BadgeFactory'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('badge-factory')
  ReactDOM.render(
    <React.StrictMode>
      <BadgeFactoryBCS />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
