import React from 'react'
import ReactDOM from 'react-dom'

import WalletStatus from 'lib/components/WalletStatus'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('wallet-status')
  ReactDOM.render(
    <React.StrictMode>
      <LocalizationWrapper>
        <WalletStatus />
      </LocalizationWrapper>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
