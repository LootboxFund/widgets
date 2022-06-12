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

interface AuthenticationProps {
  initialMode?: ModeOptions
  onSignupSuccess?: () => void
}
const Authentication = ({ initialMode, onSignupSuccess }: AuthenticationProps) => {
  const [route, setRoute] = useState<ModeOptions>(initialMode || 'signup-password')
  const { screen } = useWindowSize()

  useEffect(() => {
    const load = async () => {
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

  const renderSwitchInnerRouteText = () => {
    if (route === 'login-password') {
      return <$ChangeMode onClick={() => setRoute('login-wallet')}>Or use your wallet to sign in</$ChangeMode>
    } else if (route === 'login-wallet') {
      return <$ChangeMode onClick={() => setRoute('login-password')}>Or use a password</$ChangeMode>
    } else if (route === 'signup-password') {
      return <$ChangeMode onClick={() => setRoute('signup-wallet')}>Or use your MetaMask wallet</$ChangeMode>
    } else if (route === 'signup-wallet') {
      return (
        <$ChangeMode
          onClick={() => {
            setRoute('signup-password')
          }}
        >
          Or use a password
        </$ChangeMode>
      )
    }

    return null
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
