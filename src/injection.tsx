import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './components/demo/Counter'

export const injectCounter = () => {
  const targetInjectionPoint = document.getElementById('app')
  ReactDOM.render(
    <React.StrictMode>
      <Counter />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
