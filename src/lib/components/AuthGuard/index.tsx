import Authentication from '../Authentication'
import { useAuth } from 'lib/hooks/useAuth'

type AuthGuardProps = { children: JSX.Element }

const AuthGuard = ({ children, ...props }: AuthGuardProps & any): JSX.Element => {
  const { user } = useAuth()
  if (!user) {
    return <Authentication initialMode="login-password" {...props} />
  } else {
    return children
  }
}

export default AuthGuard
