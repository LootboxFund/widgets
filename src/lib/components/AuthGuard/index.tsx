import Authentication from '../Authentication'
import { useAuth } from 'lib/hooks/useAuth'

const AuthGuard = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { user } = useAuth()
  if (!user) {
    return <Authentication />
  } else {
    return children
  }
}

export default AuthGuard
