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
import {
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { $Link } from 'lib/components/Profile/common'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

interface LoginEmailProps {
  onChangeMode: (mode: ModeOptions) => void
  onSignupSuccess?: () => void
  title?: string
}
const LoginEmail = (props: LoginEmailProps) => {
  const { signInWithEmailAndPassword, sendBasicSignInEmail } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const persistence: 'session' | 'local' = (localStorage.getItem('auth.persistence') || 'session') as
    | 'session'
    | 'local'
  const [persistenceChecked, setPersistenceChecked] = useState(persistence === 'local')
  const intl = useIntl()
  const words = useWords()
  const [status, setStatus] = useState<'pending' | 'email-link' | 'password'>('pending')

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const handleLoginWithEmail = async () => {
    setErrorMessage('')
    setLoading(true)
    if (status === 'password') {
      try {
        await signInWithEmailAndPassword(email, password)
        props.onSignupSuccess && props.onSignupSuccess()
      } catch (err) {
        setErrorMessage(err?.message || words.anErrorOccured)
        LogRocket.captureException(err)
      }
    } else {
      // Fetch sign in methods...
      let emailSignInMethods: string[] = []
      try {
        emailSignInMethods = await fetchSignInMethodsForEmail(auth, email)
      } catch (err) {
        console.log('error fethcing sign in methods', err)
        LogRocket.captureException(err)
      }
      if (emailSignInMethods.includes('password')) {
        setStatus('password')
      } else if (emailSignInMethods.includes('emailLink')) {
        try {
          await sendBasicSignInEmail(email)
          setStatus('email-link')
        } catch (err) {
          setErrorMessage(err?.message || words.anErrorOccured)
          LogRocket.captureException(err)
        }
      } else {
        setErrorMessage('No sign in methods found. Try logging in using your Phone Number or create a new account.')
      }
    }
    setLoading(false)
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
      <$Header>{props.title || words.login}</$Header>
      <$Vertical spacing={4}>
        <$InputMedium
          onChange={(e) => parseEmail(e.target.value)}
          value={email}
          placeholder={words.email}
        ></$InputMedium>
        {status === 'password' && (
          <$InputMedium
            onChange={(e) => parsePassword(e.target.value)}
            value={password}
            placeholder={words.password}
            type="password"
          ></$InputMedium>
        )}
        {status === 'email-link' ? (
          <$span>
            ✅ Login email sent to {email}. <mark>Check your spam folder.</mark>
          </$span>
        ) : (
          <$Button
            screen={screen}
            onClick={handleLoginWithEmail}
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
            <LoadingText
              loading={loading}
              text={status === 'pending' ? 'Next' : words.login}
              color={COLORS.trustFontColor}
            />
          </$Button>
        )}
      </$Vertical>
      <$Horizontal spacing={2} flexWrap justifyContent="space-between">
        <$span textAlign="start" style={{ display: 'flex', alignItems: 'center' }}>
          <$Checkbox type="checkbox" checked={persistenceChecked} onChange={clickRememberMe} />
          <$span style={{ verticalAlign: 'middle', display: 'inline-block' }}> {words.rememberMe}</$span>
        </$span>

        <$Link
          style={{ fontStyle: 'normal', display: 'flex', alignItems: 'center' }}
          onClick={() => props.onChangeMode('forgot-password')}
        >
          <FormattedMessage
            id="auth.login.forgotPassword"
            defaultMessage="Forgot password?"
            description="Allows the user to reset their password"
          />
        </$Link>
      </$Horizontal>

      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginEmail
