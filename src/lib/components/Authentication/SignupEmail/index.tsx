import { useSnapshot } from 'valtio'
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
import { useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

interface SignUpEmailProps {
  onChangeMode: (mode: ModeOptions) => void
}
const SignupEmail = (props: SignUpEmailProps) => {
  const { signUpWithEmailAndPassword } = useAuth()
  const [email, setEmail] = useState<string>('')
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
  const intl = useIntl()
  const words = useWords()

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const parsePasswordConfirmation = (inputPasswordConfirmation: string) => {
    setPasswordConfirmation(inputPasswordConfirmation)
  }

  const handleSignUpWithEmailAndPassword = async () => {
    setLoading(true)
    try {
      await signUpWithEmailAndPassword(email, password, passwordConfirmation)
      setErrorMessage('')
      props.onChangeMode('login-email')
    } catch (err) {
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <$Vertical spacing={4}>
      <$Header>{words.register}</$Header>
      <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder={words.email} />
      <$Vertical spacing={4}>
        <$InputMedium
          onChange={(e) => parsePassword(e.target.value)}
          value={password}
          placeholder={words.password}
          type="password"
        ></$InputMedium>
        <$InputMedium
          onChange={(e) => parsePasswordConfirmation(e.target.value)}
          value={passwordConfirmation}
          placeholder={words.confirmPassword}
          type="password"
        ></$InputMedium>
        <$Button
          screen={screen}
          onClick={handleSignUpWithEmailAndPassword}
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
          <LoadingText loading={loading} text={words.signUp} color={COLORS.trustFontColor} />
        </$Button>
      </$Vertical>
      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default SignupEmail
