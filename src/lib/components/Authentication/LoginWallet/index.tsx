import { useSnapshot } from 'valtio'
import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { userState } from 'lib/state/userState'
import WalletButton from 'lib/components/WalletButton'
import LogRocket from 'logrocket'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { ChangeEvent, useState } from 'react'
import { $ChangeMode, $Checkbox, ModeOptions } from '../Shared'
import { $Header, $ErrorMessage, $p, $span } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'
import { truncateAddress } from 'lib/api/helpers'
import { auth } from 'lib/api/firebase/app'
import { browserSessionPersistence, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

interface LoginWalletProps {
  onChangeMode: (mode: ModeOptions) => void
  onSignupSuccess?: () => void
  title?: string
}
const LoginWallet = (props: LoginWalletProps) => {
  const intl = useIntl()
  const { signInWithWallet } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const userStateSnapshot = useSnapshot(userState)
  const persistence: 'session' | 'local' = (localStorage.getItem('auth.persistence') || 'session') as
    | 'session'
    | 'local'
  const [persistenceChecked, setPersistenceChecked] = useState(persistence === 'local')
  const words = useWords()

  const isWalletConnected = !!userStateSnapshot.currentAccount

  const handleLoginWithWallet = async () => {
    setLoading(true)
    try {
      await signInWithWallet()
      setErrorMessage('')
      props.onSignupSuccess && props.onSignupSuccess()
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured!')
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const clickRememberMe = (e: ChangeEvent<HTMLInputElement>) => {
    const newPersistenceChecked = e.target.checked
    setPersistenceChecked(newPersistenceChecked)
    if (newPersistenceChecked) {
      setPersistence(auth, browserLocalPersistence)
      localStorage.setItem('auth.persistence', 'local')
      return
    } else {
      setPersistence(auth, browserSessionPersistence)
      localStorage.setItem('auth.persistence', 'session')
      return
    }
  }

  const loginWithWallet = intl.formatMessage({
    id: 'auth.method.loginWithWallet',
    defaultMessage: 'Login with Wallet',
    description: 'Button text for user to login using their MetaMask wallet instead of their email and password',
  })

  return (
    <$Vertical spacing={4}>
      <$Header>{props.title || words.login}</$Header>
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
            <LoadingText loading={loading} text={loginWithWallet} color={COLORS.trustFontColor} />
          </$Button>
        </$Vertical>
      ) : null}
      <$Horizontal spacing={2} flexWrap justifyContent="space-between">
        <$span textAlign="start">
          <$Checkbox type="checkbox" checked={persistenceChecked} onChange={clickRememberMe} />
          <$span style={{ verticalAlign: 'middle', marginBottom: '10px', display: 'inline-block' }}>
            {' '}
            {words.rememberMe}
          </$span>
        </$span>
        {isWalletConnected ? (
          <$span textAlign="end" style={{ display: 'inline-block', verticalAlign: 'middle', marginTop: '5px' }}>
            {truncateAddress(userStateSnapshot.currentAccount)}
          </$span>
        ) : null}
      </$Horizontal>
      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginWallet
