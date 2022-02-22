import React from 'react'
import ReactDOM from 'react-dom'

import Swap from 'lib/components/_deprecated/Swap'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('crowdsale')
  ReactDOM.render(
    <React.StrictMode>
      <Swap />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
