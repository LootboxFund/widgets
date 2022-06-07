import { useSnapshot } from 'valtio'
import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { userState } from 'lib/state/userState'
import WalletButton from 'lib/components/WalletButton'
import LogRocket from 'logrocket'
import { $Vertical } from 'lib/components/Generics'
import { useState } from 'react'
import { $InputMedium, $ChangeMode, ModeOptions } from '../Shared'
import { $Header, $ErrorMessage } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'

interface SignUpWalletProps {
  onChangeMode: (mode: ModeOptions) => void
}
const SignupWallet = (props: SignUpWalletProps) => {
  const { signUpWithWallet } = useAuth()
  const [email, setEmail] = useState<string>('')
  const { screen } = useWindowSize()
  const userStateSnapshot = useSnapshot(userState)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const isWalletConnected = !!userStateSnapshot.currentAccount

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      await signUpWithWallet(email)
      setErrorMessage('')
      props.onChangeMode('login-wallet')
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const goToPasswordSignUp = () => {
    props.onChangeMode('signup-password')
  }

  return (
    <$Vertical spacing={4}>
      <$Header>Register</$Header>
      <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder="email" />
      {!isWalletConnected ? <WalletButton /> : null}
      {isWalletConnected ? (
        <$Button
          screen={screen}
          onClick={handleSignup}
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
          <LoadingText loading={loading} text="Wallet Sign Up" color={COLORS.trustFontColor} />
        </$Button>
      ) : null}

      <$ChangeMode onClick={goToPasswordSignUp}>Or use a password</$ChangeMode>
      {errorMessage ? <$ErrorMessage>{parseAuthError(errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default SignupWallet
