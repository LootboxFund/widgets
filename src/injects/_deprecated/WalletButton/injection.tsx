import React from 'react'
import ReactDOM from 'react-dom'

import WalletButton from 'lib/components/WalletButton'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('wallet-button')
  ReactDOM.render(
    <React.StrictMode>
      <WalletButton />
    </React.StrictMode>,
    targetInjectionPoint
  )
}