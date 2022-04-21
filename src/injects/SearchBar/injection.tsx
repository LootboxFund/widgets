import React from 'react'
import ReactDOM from 'react-dom'

import SearchBar from 'lib/components/SearchBar'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('searchbar-lootbox')
  ReactDOM.render(
    <React.StrictMode>
      <SearchBar />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
