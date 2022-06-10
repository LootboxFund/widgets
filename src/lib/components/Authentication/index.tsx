import { TYPOGRAPHY } from '@wormgraph/helpers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { $span, $Vertical } from '../Generics'
import { ModeOptions } from './Shared'
import SignupEmail from './SignupEmail'
import SignupWallet from './SignupWallet'
import LoginWallet from './LoginWallet'
import LoginEmail from './LoginEmail'
import ResetPassword from './ResetPassword'
import { initDApp } from 'lib/hooks/useWeb3Api'
import useWindowSize from 'lib/hooks/useScreenSize'
import { initLogging } from 'lib/api/logrocket'

interface AuthenticationProps {
  initialMode?: ModeOptions
  onSignupSuccess?: () => void
}
const Authentication = ({ initialMode, onSignupSuccess }: AuthenticationProps) => {
  const [route, setRoute] = useState<ModeOptions>(initialMode || 'signup-password')
  const { screen } = useWindowSize()

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

  const renderSwitchRouteText = () => {
    if (route === 'login-password' || route === 'login-wallet') {
      const destinationRoute = route === 'login-password' ? 'signup-password' : 'signup-wallet'
      return (
        <$span>
          Don't have an account? <$Link onClick={() => setRoute(destinationRoute)}>sign up</$Link>
        </$span>
      )
    } else if (route === 'signup-password' || route === 'signup-wallet') {
      const destinationRoute = route === 'signup-password' ? 'login-password' : 'login-wallet'
      return (
        <$span>
          Already have an account? <$Link onClick={() => setRoute(destinationRoute)}>log in</$Link>
        </$span>
      )
    }
    return ''
  }

  return (
    <$Vertical
      spacing={4}
      width={screen == 'mobile' ? '100%' : '420px'}
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
      {route === 'login-wallet' && <LoginWallet onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} />}
      {route === 'login-password' && <LoginEmail onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} />}
      {route === 'signup-wallet' && <SignupWallet onChangeMode={setRoute} />}
      {route === 'signup-password' && <SignupEmail onChangeMode={setRoute} />}
      {route === 'forgot-password' && <ResetPassword onChangeMode={setRoute} />}

      <$Vertical spacing={4}>
        {route !== 'forgot-password' && route == 'login-password' && (
          <$PromptText>
            {
              <$span style={{ cursor: 'pointer' }}>
                Forgot password? <$Link onClick={() => setRoute('forgot-password')}>click here</$Link>
              </$span>
            }
          </$PromptText>
        )}

        <$PromptText>{renderSwitchRouteText()}</$PromptText>
      </$Vertical>
    </$Vertical>
  )
}

const $PromptText = styled.div`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  text-align: center;
`
const $Link = styled.span`
  color: #1abaff;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-style: italic;
  cursor: pointer;
`

export default Authentication
