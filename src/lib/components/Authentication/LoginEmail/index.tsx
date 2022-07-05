import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import LogRocket from 'logrocket'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { ChangeEvent, ChangeEventHandler, useState } from 'react'
import { $InputMedium, $ChangeMode, ModeOptions, $Checkbox } from '../Shared'
import { $Header, $ErrorMessage, $span } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'
import { auth } from 'lib/api/firebase/app'
import { browserSessionPersistence, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { $Link } from 'lib/components/Profile/common'

interface LoginEmailProps {
  onChangeMode: (mode: ModeOptions) => void
  onSignupSuccess?: () => void
  title?: string
}
const LoginEmail = (props: LoginEmailProps) => {
  const { signInWithEmailAndPassword } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const persistence: 'session' | 'local' = (localStorage.getItem('auth.persistence') || 'session') as
    | 'session'
    | 'local'
  const [persistenceChecked, setPersistenceChecked] = useState(persistence === 'local')

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
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

  const clickRememberMe = (e: ChangeEvent<HTMLInputElement>) => {
    const newPersistenceChecked = e.target.checked
    setPersistenceChecked(newPersistenceChecked)
    if (newPersistenceChecked) {
      setPersistence(auth, browserLocalPersistence)
      localStorage.setItem('auth.persistence', 'local')
      return
    } else {
      setPersistence(auth, browserSessionPersistence)
      localStorage.setItem('auth.persistence', 'session')
      return
    }
  }

  return (
    <$Vertical spacing={4}>
      <$Header>{props.title || 'Login'}</$Header>
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
      <$Horizontal spacing={2} flexWrap justifyContent="space-between">
        <$span textAlign="start" style={{ display: 'flex', alignItems: 'center' }}>
          <$Checkbox type="checkbox" checked={persistenceChecked} onChange={clickRememberMe} />
          <$span style={{ verticalAlign: 'middle', display: 'inline-block' }}> Remember me</$span>
        </$span>

        <$Link
          style={{ fontStyle: 'normal', display: 'flex', alignItems: 'center' }}
          onClick={() => props.onChangeMode('forgot-password')}
        >
          Forgot password?
        </$Link>
      </$Horizontal>

      {errorMessage ? <$ErrorMessage>{parseAuthError(errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginEmail
