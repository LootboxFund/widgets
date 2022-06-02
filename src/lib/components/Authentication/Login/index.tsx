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
import { $InputMedium, $ChangeMode } from '../Shared'
import { $Header, $ErrorMessage } from '../../Generics/Typography'

type Mode = 'password' | 'wallet'

interface Props {
  initialMode?: Mode
}
const Login = (props: Props) => {
  const { user, signInWithWallet, signInWithEmailAndPassword } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const userStateSnapshot = useSnapshot(userState)
  const [mode, setMode] = useState<Mode>(props.initialMode || 'wallet')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const isWalletConnected = !!userStateSnapshot.currentAccount

  const changeMode = (mode: Mode) => {
    setMode(mode)
    setErrorMessage('')
  }

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const ChangeAuthProvider = () => {
    if (mode === 'password') {
      return <$ChangeMode onClick={() => changeMode('wallet')}>Or use your wallet to sign in</$ChangeMode>
    } else {
      return <$ChangeMode onClick={() => changeMode('password')}>Or use a password</$ChangeMode>
    }
  }

  const handleLoginWithWallet = async () => {
    setLoading(true)
    try {
      await signInWithWallet()
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithEmailAndPassword = async () => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(email, password)
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
      {mode === 'password' ? (
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
      ) : null}
      {mode === 'wallet' && !isWalletConnected ? <WalletButton /> : null}
      {mode === 'wallet' && isWalletConnected ? (
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
      ) : null}

      <ChangeAuthProvider />
      {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default Login
