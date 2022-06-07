import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import LogRocket from 'logrocket'
import { $Vertical } from 'lib/components/Generics'
import { useState } from 'react'
import { $InputMedium, $ChangeMode, ModeOptions } from '../Shared'
import { $Header, $ErrorMessage } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'

interface LoginEmailProps {
  onChangeMode: (mode: ModeOptions) => void
  onSignupSuccess?: () => void
}
const LoginEmail = (props: LoginEmailProps) => {
  const { signInWithEmailAndPassword } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const changeToWalletLogin = () => {
    props.onChangeMode('login-wallet')
  }

  const handleLoginWithEmailAndPassword = async () => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(email, password)
      setErrorMessage('')
      props.onSignupSuccess && props.onSignupSuccess()
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <$Vertical spacing={4}>
      <$Header>Login</$Header>
      <$Vertical spacing={4}>
        <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder="email"></$InputMedium>
        <$InputMedium
          onChange={(e) => parsePassword(e.target.value)}
          value={password}
          placeholder="password"
          type="password"
        ></$InputMedium>
        <$Button
          screen={screen}
          onClick={handleLoginWithEmailAndPassword}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.regular,
            fontSize: TYPOGRAPHY.fontSize.large,
          }}
          disabled={loading}
        >
          <LoadingText loading={loading} text="Login" color={COLORS.trustFontColor} />
        </$Button>
      </$Vertical>
      <$ChangeMode onClick={changeToWalletLogin}>Or use your wallet to sign in</$ChangeMode>
      {errorMessage ? <$ErrorMessage>{parseAuthError(errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginEmail
