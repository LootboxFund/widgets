import React from 'react'
import ReactDOM from 'react-dom'

import ManagementPage from 'lib/components/ManagementPage'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('manage-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <ManagementPage />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
