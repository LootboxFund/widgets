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
      props.onChangeMode('login-password')
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const goToWalletSignup = () => {
    props.onChangeMode('signup-wallet')
  }

  return (
    <$Vertical spacing={4}>
      <$Header>Register</$Header>
      <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder="email" />
      <$Vertical spacing={4}>
        <$InputMedium
          onChange={(e) => parsePassword(e.target.value)}
          value={password}
          placeholder="password"
          type="password"
        ></$InputMedium>
        <$InputMedium
          onChange={(e) => parsePasswordConfirmation(e.target.value)}
          value={passwordConfirmation}
          placeholder="confirm password"
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
          <LoadingText loading={loading} text="Sign Up" color={COLORS.trustFontColor} />
        </$Button>
      </$Vertical>
      <$ChangeMode onClick={goToWalletSignup}>Or use your MetaMask wallet</$ChangeMode>
      {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default SignupEmail
