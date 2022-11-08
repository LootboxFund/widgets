import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Vertical } from 'lib/components/Generics'
import { useEffect, useState } from 'react'
import { $InputMedium } from '../Shared'
import { $Header, $ErrorMessage, $span } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'
import { auth } from 'lib/api/firebase/app'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'

interface LoginEmailProps {
  onSignupSuccess?: () => void
}
const LoginEmail = (props: LoginEmailProps) => {
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const intl = useIntl()
  const words = useWords()
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')

  useEffect(() => {
    handleAuthenticateDynamicLink()
  }, [])

  const handleAuthenticateDynamicLink = async () => {
    if (loading) {
      return
    }

    setErrorMessage('')

    if (!emailForSignup) {
      setErrorMessage('Enter your email')
      return
    }

    if (isSignInWithEmailLink(auth, window.location.href) && emailForSignup) {
      setLoading(true)
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.

      try {
        // The client SDK will parse the code from the link for you.
        await signInWithEmailLink(auth, emailForSignup, window.location.href)
        props.onSignupSuccess && props.onSignupSuccess()
      } catch (err) {
        console.error(err)
        setErrorMessage(err?.message || words.anErrorOccured)
      } finally {
        setLoading(false)
      }
    } else {
      setErrorMessage('Invalid link. Please check your email and try again.')
    }
  }

  return (
    <$Vertical spacing={4}>
      <$Header>Logging in</$Header>
      <$Vertical spacing={4}>
        <$InputMedium
          onChange={(e) => {
            setEmailForSignup(e.target.value)
          }}
          value={emailForSignup}
          placeholder={words.email}
        ></$InputMedium>
      </$Vertical>
      <$Button
        screen={screen}
        onClick={handleAuthenticateDynamicLink}
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
        <LoadingText loading={loading} text={words.login} color={COLORS.trustFontColor} />
      </$Button>

      {loading && <$span>Please wait while we log you in...</$span>}

      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginEmail
