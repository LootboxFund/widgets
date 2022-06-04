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
import { $ChangeMode, ModeOptions } from '../Shared'
import { $Header, $ErrorMessage, $p, $span } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'
import { truncateAddress } from 'lib/api/helpers'

interface LoginWalletProps {
  onChangeMode: (mode: ModeOptions) => void
}
const LoginWallet = (props: LoginWalletProps) => {
  const { signInWithWallet } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const userStateSnapshot = useSnapshot(userState)

  const isWalletConnected = !!userStateSnapshot.currentAccount

  const changeToPasswordLogin = () => {
    props.onChangeMode('login-password')
  }

  const handleLoginWithWallet = async () => {
    setLoading(true)
    try {
      await signInWithWallet()
      setErrorMessage('')
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
      {!isWalletConnected ? <WalletButton /> : null}
      {isWalletConnected ? (
        <$Vertical spacing={2}>
          <$Button
            screen={screen}
            onClick={handleLoginWithWallet}
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
            <LoadingText loading={loading} text="Login with Wallet" color={COLORS.trustFontColor} />
          </$Button>
          <$span textAlign="center">{truncateAddress(userStateSnapshot.currentAccount)}</$span>
        </$Vertical>
      ) : null}
      <$ChangeMode onClick={changeToPasswordLogin}>Or use a password</$ChangeMode>
      {errorMessage ? <$ErrorMessage>{parseAuthError(errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginWallet
