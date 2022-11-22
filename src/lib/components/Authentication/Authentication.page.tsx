import Authentication from '.'
import { manifest } from 'manifest'

const AuthenticationPage = () => {
  return (
    <Authentication
      initialMode="signup-email"
      onSignupSuccess={() => window.open(manifest.microfrontends.webflow.myProfilePage, '_self')}
    />
  )
}

export default AuthenticationPage
