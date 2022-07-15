import React from 'react'
import ReactDOM from 'react-dom'

import CreateLootbox from 'lib/components/CreateLootbox'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('create-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <LocalizationWrapper>
        <CreateLootbox />
      </LocalizationWrapper>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
