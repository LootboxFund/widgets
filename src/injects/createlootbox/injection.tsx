import React from 'react'
import ReactDOM from 'react-dom'

import CreateLootbox from 'lib/components/CreateLootbox'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('create-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <CreateLootbox />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
