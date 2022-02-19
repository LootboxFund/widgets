import React from 'react'
import ReactDOM from 'react-dom'

import WalletStatus from 'lib/components/WalletStatus'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('wallet-status')
  ReactDOM.render(
    <React.StrictMode>
      <WalletStatus />
    </React.StrictMode>,
    targetInjectionPoint
  )
}