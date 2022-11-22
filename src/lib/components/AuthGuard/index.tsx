import Authentication from '../Authentication'
import { useAuth } from 'lib/hooks/useAuth'
import Spinner from '../Generics/Spinner'
import { COLORS } from '@wormgraph/helpers'
import { PropsWithChildren, useState } from 'react'

/**
 * strict = forces login
 */
type AuthGuardProps = PropsWithChildren<{ strict?: boolean } & any>

const AuthGuard = ({ children, strict, ...props }: AuthGuardProps): JSX.Element => {
  const [hasLoggedIn, setHasLoggedIn] = useState(false)
  const { user } = useAuth()

  if (user === undefined) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (!user || (!!strict && !hasLoggedIn)) {
    return (
      <Authentication
        initialMode="login-email"
        {...props}
        onSignupSuccess={
          !!strict
            ? () => {
                setHasLoggedIn(true)
              }
            : undefined
        }
      />
    )
  } else {
    return children
  }
}

export default AuthGuard
