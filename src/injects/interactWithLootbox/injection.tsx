import React from 'react'
import ReactDOM from 'react-dom'

import InteractWithLootbox from 'lib/components/InteractWithLootbox'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('interact-with-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <InteractWithLootbox />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
