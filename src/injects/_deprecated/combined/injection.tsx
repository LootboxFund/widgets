import React from 'react'
import ReactDOM from 'react-dom'

import CrowdSale from 'lib/components/_deprecated/CrowdSale'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('crowdsale')
  ReactDOM.render(
    <React.StrictMode>
      <CrowdSale />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
