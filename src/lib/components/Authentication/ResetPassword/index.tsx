import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import useWords from 'lib/hooks/useWords'
import { $ErrorMessage, $h1, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import LogRocket from 'logrocket'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { $InputMedium, ModeOptions } from '../Shared'

interface ResetPasswordProps {
  onChangeMode: (mode: ModeOptions) => void
}
const ResetPassword = (props: ResetPasswordProps) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'pending'>('pending')
  const { screen } = useWindowSize()
  const words = useWords()

  const parseEmail = (email: string) => {
    setEmail(email)
  }

  const handlePasswordResetRequest = async () => {
    console.log('password reset', email)
    setStatus('loading')
    try {
      await sendPasswordResetEmail(auth, email)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      LogRocket.captureException(err)
    }
  }

  const navBack = () => {
    props.onChangeMode('login-password')
  }

  return (
    <$Vertical spacing={4}>
      <$h1 style={{ textTransform: 'capitalize' }}>{words.resetPassword}</$h1>
      <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder={words.email} />
      <$Button
        screen={screen}
        onClick={handlePasswordResetRequest}
        backgroundColor={`${COLORS.trustBackground}C0`}
        backgroundColorHover={`${COLORS.trustBackground}`}
        color={COLORS.trustFontColor}
        style={{
          boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
          fontWeight: TYPOGRAPHY.fontWeight.regular,
          fontSize: TYPOGRAPHY.fontSize.large,
        }}
        disabled={status === 'loading'}
      >
        <FormattedMessage
          id="auth.resetPassword.button"
          defaultMessage="Send password reset email"
          description="Button text where a user clicks to reset their password. This will send an email to them with a password reset link."
        />
      </$Button>
      {status === 'error' ? (
        <$ErrorMessage>{`${words.anErrorOccured}! ${words.pleaseTryAgainLater}.`}</$ErrorMessage>
      ) : null}
      {status === 'success' ? (
        <$span>
          ✅{' '}
          <FormattedMessage
            id="auth.resetPassword.emailSuccess"
            defaultMessage="A password reset email was sent to your email! Check your spam folder."
            description="Message displayed when a user successfully gets a password reset email in their inbox."
          />
        </$span>
      ) : null}
      <$span onClick={navBack} style={{ cursor: 'pointer' }}>
        👈 {words.back}
      </$span>
    </$Vertical>
  )
}

export default ResetPassword
