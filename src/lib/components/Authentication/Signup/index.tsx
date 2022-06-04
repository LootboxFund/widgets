import { useSnapshot } from 'valtio'
import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import styled from 'styled-components'
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

type Mode = 'wallet' | 'password'

interface Props {
  onSignUpCallback: (mode: Mode) => void
}
const Signup = (props: Props) => {
  const { signUpWithWallet, signUpWithEmailAndPassword } = useAuth()
  const [email, setEmail] = useState<string>('')
  const { screen } = useWindowSize()
  const userStateSnapshot = useSnapshot(userState)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('wallet')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

  const isWalletConnected = !!userStateSnapshot.currentAccount

  const parseEmail = (inputEmail: string) => {
    setEmail(inputEmail)
  }

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const parsePasswordConfirmation = (inputPasswordConfirmation: string) => {
    setPasswordConfirmation(inputPasswordConfirmation)
  }

  const changeMode = (mode: Mode) => {
    setMode(mode)
    setErrorMessage('')
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      await signUpWithWallet(email)
      props.onSignUpCallback(mode)
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpWithEmailAndPassword = async () => {
    setLoading(true)
    try {
      await signUpWithEmailAndPassword(email, password, passwordConfirmation)
      props.onSignUpCallback(mode)
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const ChangeAuthProvider = () => {
    if (mode === 'password') {
      return <$ChangeMode onClick={() => changeMode('wallet')}>Or use your wallet to sign in</$ChangeMode>
    } else {
      return <$ChangeMode onClick={() => changeMode('password')}>Or use a password</$ChangeMode>
    }
  }

  return (
    <$Vertical spacing={4}>
      <$Header>Register</$Header>
      <$InputMedium onChange={(e) => parseEmail(e.target.value)} value={email} placeholder="email" />
      {mode === 'password' ? (
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
      ) : null}
      {mode === 'wallet' && !isWalletConnected ? <WalletButton /> : null}
      {mode === 'wallet' && isWalletConnected ? (
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

      <ChangeAuthProvider />
      {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default Signup
