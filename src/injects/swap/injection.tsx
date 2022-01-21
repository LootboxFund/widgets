import React from 'react'
import ReactDOM from 'react-dom'

import Swap from 'lib/components/Swap'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('app')
  ReactDOM.render(
    <React.StrictMode>
      <Swap />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
