import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { $Divider, $span, $Vertical } from '../Generics'
import { ModeOptions, useAuthWords } from './Shared'
import SignupEmail from './SignupEmail'
import SignupWallet from './SignupWallet'
import LoginWallet from './LoginWallet'
import LoginEmail from './LoginEmail'
import ResetPassword from './ResetPassword'
import { initDApp } from 'lib/hooks/useWeb3Api'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { initLogging } from 'lib/api/logrocket'
import { FormattedMessage } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import LoginPhone from './LoginPhone'
import EmailLinkAuth from './EmailLinkAuth'
import { isSignInWithEmailLink } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'

interface AuthenticationProps {
  initialMode?: ModeOptions
  onSignupSuccess?: () => void
  loginTitle?: string
  width?: string
  ghost?: boolean
}
const Authentication = ({ initialMode, onSignupSuccess, loginTitle, width, ghost }: AuthenticationProps) => {
  const { mode } = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_Authentication()
    return { mode: parseMode(INITIAL_URL_PARAMS.mode) }
  }, [])

  const [route, setRoute] = useState<ModeOptions>(
    isSignInWithEmailLink(auth, window.location.href) ? 'email-link' : mode || initialMode || 'signup-email'
  )
  const { screen } = useWindowSize()
  const words = useWords()
  const authWords = useAuthWords()

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
    if (route === 'login-email' || route === 'login-wallet' || route === 'login-phone') {
      const destinationRoute =
        route === 'login-email' ? 'signup-email' : route === 'login-wallet' ? 'signup-wallet' : 'signup-phone'
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
    } else if (route === 'signup-email' || route === 'signup-wallet' || route === 'signup-phone') {
      const destinationRoute =
        route === 'signup-email' ? 'login-email' : route === 'signup-wallet' ? 'login-wallet' : 'login-phone'
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

  const AlternativeAuthOptions = ({ selectedRoute }: { selectedRoute: ModeOptions }) => {
    const isLogin = selectedRoute.includes('login')
    type Option = 'email' | 'wallet' | 'phone'
    const options: Option[] = !!mode ? [] : ['email', 'wallet', 'phone']
    const getColor = (option: Option): { background: string; color: string; icon: string } => {
      if (option === 'email') {
        return {
          background: `${COLORS.black}ce`,
          color: COLORS.white,
          icon: '📧',
        }
      } else if (option === 'wallet') {
        return {
          background: `${COLORS.dangerFontColor}ba`,
          color: COLORS.white,
          icon: '🦊',
        }
      } else {
        // phone
        return {
          background: COLORS.successFontColor,
          color: COLORS.white,
          icon: '📞',
        }
      }
    }

    return (
      <$Vertical spacing={2}>
        {options.map((option) => {
          const color = getColor(option)
          const key: ModeOptions = `${isLogin ? 'login' : 'signup'}-${option}`
          if (selectedRoute.includes(option)) {
            // This is the selected route & is shown as the main component. So we dont show it here
            return null
          }

          const word =
            option === 'email' ? 'Email' : option === 'wallet' ? authWords.metaMaskWallet : authWords.phoneNumber

          return (
            <$AuthButton
              key={key}
              screen={screen}
              backgroundColor={color.background}
              color={color.color}
              onClick={() => {
                setRoute(key)
              }}
            >
              {color.icon} {word}
            </$AuthButton>
          )
        })}
      </$Vertical>
    )
  }

  return (
    <$Vertical
      spacing={4}
      width={width ? width : screen == 'mobile' ? '100%' : '420px'}
      padding="1.6rem"
      style={{
        background: ghost ? 'transparent' : '#FFFFFF',
        boxShadow: ghost ? 'none' : '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '21px',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        margin: '0 auto',
        minHeight: '520px',
      }}
    >
      {route === 'login-wallet' && (
        <LoginWallet onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} title={loginTitle} />
      )}
      {route === 'login-email' && (
        <div>
          <LoginEmail onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} title={loginTitle} />
          <br />
        </div>
      )}
      {route === 'signup-wallet' && <SignupWallet onChangeMode={setRoute} />}
      {route === 'signup-email' && <SignupEmail onChangeMode={setRoute} />}
      {(route === 'signup-phone' || route === 'login-phone') && (
        <div>
          <LoginPhone
            onChangeMode={setRoute}
            onSignupSuccess={onSignupSuccess}
            title={!!loginTitle ? loginTitle : route === 'signup-phone' ? words.register : words.login}
          />
          <br />
        </div>
      )}
      {route === 'email-link' && <EmailLinkAuth onSignupSuccess={onSignupSuccess} />}

      {route === 'forgot-password' && <ResetPassword onChangeMode={setRoute} />}

      <$span textAlign="center">{renderSwitchRouteText()}</$span>

      {!mode && <$Divider />}

      {route !== 'forgot-password' && <AlternativeAuthOptions selectedRoute={route} />}
    </$Vertical>
  )
}

const $AuthButton = styled.button<{
  backgroundColor?: string
  color?: string
  colorHover?: string
  backgroundColorHover?: string
  disabled?: boolean
  screen: ScreenSize
  justifyContent?: string
}>`
  padding: 15px 10px 15px 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  text-align: left;
  flex: 1;
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.medium)};
  line-height: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xxlarge : TYPOGRAPHY.fontSize.xlarge)};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  border: 0px solid transparent;
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => props.color && `color: ${props.color}`};
  ${(props) => props.backgroundColor && `background-color: ${props.backgroundColor}`};
  &:hover {
    ${(props) => !props.disabled && props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
    ${(props) => !props.disabled && props.colorHover && `color: ${props.colorHover}`};
  }
`

const $Link = styled.span`
  color: #1abaff;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-style: italic;
  cursor: pointer;
`

export interface AuthenticationURLParams {
  mode: string | null
}

export const extractURLState_Authentication = () => {
  const url = new URL(window.location.href)
  const params: AuthenticationURLParams = {
    mode: url.searchParams.get('m'),
  }

  return { INITIAL_URL_PARAMS: params }
}

const parseMode = (modeUnknown: string | null): ModeOptions | null => {
  switch (modeUnknown) {
    case 'email':
      return 'login-email'
    default:
      return null
  }
}

export default Authentication
