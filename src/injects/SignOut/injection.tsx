import React from 'react'
import ReactDOM from 'react-dom'
import SignOut from 'lib/components/SignOut'

export const inject = () => {
  const targetInjectionPoint = document.getElementById('sign-out')
  ReactDOM.render(
    <React.StrictMode>
      <SignOut />
    </React.StrictMode>,
    targetInjectionPoint
  )
}
