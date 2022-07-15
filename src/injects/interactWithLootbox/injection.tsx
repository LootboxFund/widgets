import React from 'react'
import ReactDOM from 'react-dom'

import InteractWithLootbox from 'lib/components/InteractWithLootbox'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('interact-with-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <LocalizationWrapper>
        <InteractWithLootbox />
      </LocalizationWrapper>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
