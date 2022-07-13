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
import { getWords } from 'lib/api/words'
import { useIntl } from 'react-intl'

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
  const intl = useIntl()
  const words = getWords(intl)

  const walletSignUpText = intl.formatMessage({
    id: 'auth.signup.wallet.text',
    defaultMessage: 'Wallet Sign Up',
    description: 'Button text where a user clicks to sign up using their Metamask wallet',
  })

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
          <LoadingText loading={loading} text={walletSignUpText} color={COLORS.trustFontColor} />
        </$Button>
      ) : null}

      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default SignupWallet
