import { TYPOGRAPHY } from '@wormgraph/helpers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { $span, $Vertical } from '../Generics'
import { $ChangeMode, ModeOptions } from './Shared'
import SignupEmail from './SignupEmail'
import SignupWallet from './SignupWallet'
import LoginWallet from './LoginWallet'
import LoginEmail from './LoginEmail'
import ResetPassword from './ResetPassword'
import { initDApp } from 'lib/hooks/useWeb3Api'
import useWindowSize from 'lib/hooks/useScreenSize'
import { initLogging } from 'lib/api/logrocket'
import { FormattedMessage, useIntl } from 'react-intl'
import { getWords } from 'lib/api/words'

interface AuthenticationProps {
  initialMode?: ModeOptions
  onSignupSuccess?: () => void
  loginTitle?: string
  width?: string
}
const Authentication = ({ initialMode, onSignupSuccess, loginTitle, width }: AuthenticationProps) => {
  const [route, setRoute] = useState<ModeOptions>(initialMode || 'signup-password')
  const { screen } = useWindowSize()
  const intl = useIntl()
  const words = getWords(intl)

  const orUsePassword = intl.formatMessage({
    id: 'auth.method.orUsePassword',
    defaultMessage: 'Or use a password',
    description: 'Hyperlink message to user allowing them to signin / signup with a password',
  })

  const orUseMetamaskWallet = intl.formatMessage({
    id: 'auth.method.orUseMetamaskWallet',
    defaultMessage: 'Or use your MetaMask wallet',
    description: 'Hyperlink message to user allowing them to signin / signup with using their Metamask wallet',
  })

  useEffect(() => {
    const load = async () => {
      initLogging()
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
    }
    load()
  }, [])

  const renderSwitchRouteText = (): React.ReactElement | null => {
    if (route === 'login-password' || route === 'login-wallet') {
      const destinationRoute = route === 'login-password' ? 'signup-password' : 'signup-wallet'
      return (
        <FormattedMessage
          id="auth.link.switchToSignup"
          defaultMessage="Don't have an account? {signUpHyperlink}"
          values={{
            signUpHyperlink: <$Link onClick={() => setRoute(destinationRoute)}>{words.signUp}</$Link>,
          }}
          description="Message to user allowing them to switch to signup with nested hyperlink"
        />
      )
    } else if (route === 'signup-password' || route === 'signup-wallet') {
      const destinationRoute = route === 'signup-password' ? 'login-password' : 'login-wallet'
      return (
        <FormattedMessage
          id="auth.link.switchToLogin"
          defaultMessage="Already have an account? {loginHyperlink}"
          values={{
            loginHyperlink: <$Link onClick={() => setRoute(destinationRoute)}>{words.login}</$Link>,
          }}
        />
      )
    }
    return null
  }

  const renderSwitchInnerRouteText = () => {
    if (route === 'login-password') {
      return <$ChangeMode onClick={() => setRoute('login-wallet')}>{orUseMetamaskWallet}</$ChangeMode>
    } else if (route === 'login-wallet') {
      return <$ChangeMode onClick={() => setRoute('login-password')}>{orUsePassword}</$ChangeMode>
    } else if (route === 'signup-password') {
      return <$ChangeMode onClick={() => setRoute('signup-wallet')}>{orUseMetamaskWallet}</$ChangeMode>
    } else if (route === 'signup-wallet') {
      return (
        <$ChangeMode
          onClick={() => {
            setRoute('signup-password')
          }}
        >
          {orUsePassword}
        </$ChangeMode>
      )
    }

    return null
  }

  return (
    <$Vertical
      spacing={4}
      width={width ? width : screen == 'mobile' ? '100%' : '420px'}
      height="520px"
      padding="1.6rem"
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '21px',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      {route === 'login-wallet' && (
        <LoginWallet onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} title={loginTitle} />
      )}
      {route === 'login-password' && (
        <LoginEmail onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} title={loginTitle} />
      )}
      {route === 'signup-wallet' && <SignupWallet onChangeMode={setRoute} />}
      {route === 'signup-password' && <SignupEmail onChangeMode={setRoute} />}
      {route === 'forgot-password' && <ResetPassword onChangeMode={setRoute} />}

      <$Vertical spacing={4}>
        <$span textAlign="center">{renderSwitchInnerRouteText()}</$span>
        <$span textAlign="center">{renderSwitchRouteText()}</$span>
      </$Vertical>
    </$Vertical>
  )
}

const $Link = styled.span`
  color: #1abaff;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-style: italic;
  cursor: pointer;
`

export default Authentication
