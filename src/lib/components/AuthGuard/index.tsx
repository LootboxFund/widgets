import Authentication from '../Authentication'
import { useAuth } from 'lib/hooks/useAuth'

const AuthGuard = ({ children, loginTitle }: { children: JSX.Element; loginTitle?: string }): JSX.Element => {
  const { user } = useAuth()
  if (!user) {
    return <Authentication initialMode="login-password" loginTitle={loginTitle} />
  } else {
    return children
  }
}

export default AuthGuard
