import React from 'react'
import ReactDOM from 'react-dom'

import SearchBar from 'lib/components/SearchBar'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('searchbar-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <LocalizationWrapper>
        <SearchBar />
      </LocalizationWrapper>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
