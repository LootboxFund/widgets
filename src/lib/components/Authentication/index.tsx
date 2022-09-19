import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { $Divider, $span, $Vertical } from '../Generics'
import { $ChangeMode, ModeOptions, useAuthWords } from './Shared'
import SignupEmail from './SignupEmail'
import SignupWallet from './SignupWallet'
import LoginWallet from './LoginWallet'
import LoginEmail from './LoginEmail'
import ResetPassword from './ResetPassword'
import { initDApp } from 'lib/hooks/useWeb3Api'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { initLogging } from 'lib/api/logrocket'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import LoginPhone from './LoginPhone'

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
  const words = useWords()
  const authWords = useAuthWords()

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
    if (route === 'login-password' || route === 'login-wallet' || route === 'login-phone') {
      const destinationRoute =
        route === 'login-password' ? 'signup-password' : route === 'login-wallet' ? 'signup-wallet' : 'signup-phone'
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
    } else if (route === 'signup-password' || route === 'signup-wallet' || route === 'signup-phone') {
      const destinationRoute =
        route === 'signup-password' ? 'login-password' : route === 'signup-wallet' ? 'login-wallet' : 'login-phone'
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
    type Option = 'password' | 'wallet' | 'phone'
    const options: Option[] = ['password', 'wallet', 'phone']
    const getColor = (option: Option): { background: string; color: string; icon: string } => {
      if (option === 'password') {
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
            option === 'password'
              ? authWords.emailAndPassword
              : option === 'wallet'
              ? authWords.metaMaskWallet
              : authWords.phoneNumber

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
        background: '#FFFFFF',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
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
      {route === 'login-password' && (
        <div>
          <LoginEmail onChangeMode={setRoute} onSignupSuccess={onSignupSuccess} title={loginTitle} />
          <br />
        </div>
      )}
      {route === 'signup-wallet' && <SignupWallet onChangeMode={setRoute} />}
      {route === 'signup-password' && <SignupEmail onChangeMode={setRoute} />}
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

      {route === 'forgot-password' && <ResetPassword onChangeMode={setRoute} />}

      <$span textAlign="center">{renderSwitchRouteText()}</$span>

      <$Divider />

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

export default Authentication
