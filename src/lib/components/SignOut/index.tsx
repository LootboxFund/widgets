import { useAuth } from 'lib/hooks/useAuth'
import { manifest } from 'manifest'
import { useEffect } from 'react'
import { $p } from '../Generics'

const SignOut = () => {
  const { logout } = useAuth()

  useEffect(() => {
    logout().then(() => {
      setTimeout(() => {
        window.location.href = `${manifest.microfrontends.webflow.myProfilePage}`
      }, 3000)
    })
  })

  return (
    <div style={{ marginTop: '10vh' }}>
      <$p>
        Logged out
        <br />
        Navigating home... 👽
      </$p>
    </div>
  )
}

export default SignOut
