import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { $ErrorMessage, $h1, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { Oopsies } from 'lib/components/Profile/common'
import useWindowSize from 'lib/hooks/useScreenSize'
import { parseAuthError } from 'lib/utils/firebase'
import LogRocket from 'logrocket'
import { useState } from 'react'
import { $InputMedium, ModeOptions } from '../Shared'

interface ResetPasswordProps {
  onChangeMode: (mode: ModeOptions) => void
}
const ResetPassword = (props: ResetPasswordProps) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'pending'>('pending')
  const { screen } = useWindowSize()

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
      <$h1>Reset Password</$h1>
      <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder="email" />
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
        Send password reset email
      </$Button>
      {status === 'error' ? (
        <$ErrorMessage>{parseAuthError('An error occured! Please try again later.')}</$ErrorMessage>
      ) : null}
      {status === 'success' ? (
        <$span>✅ A password reset email was sent to your email! Check your spam folder.</$span>
      ) : null}
      <$span onClick={navBack} style={{ cursor: 'pointer' }}>
        👈 Go back
      </$span>
    </$Vertical>
  )
}

export default ResetPassword
