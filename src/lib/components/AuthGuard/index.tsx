import Authentication from '../Authentication'
import { useAuth } from 'lib/hooks/useAuth'
import Spinner from '../Generics/Spinner'
import { COLORS } from '@wormgraph/helpers'

type AuthGuardProps = { children: JSX.Element }

const AuthGuard = ({ children, ...props }: AuthGuardProps & any): JSX.Element => {
  const { user } = useAuth()
  if (user === undefined) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (!user) {
    return <Authentication initialMode="login-password" {...props} />
  } else {
    return children
  }
}

export default AuthGuard
