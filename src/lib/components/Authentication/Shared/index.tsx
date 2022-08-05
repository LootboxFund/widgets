import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

export const useAuthWords = () => {
  const intl = useIntl()
  const metaMaskWallet = intl.formatMessage({
    id: 'auth.method.loginWithMetaMaskWallet',
    defaultMessage: 'MetaMask Wallet',
    description: 'Button text for user to login using their MetaMask wallet instead of their email and password',
  })
  const emailAndPassword = intl.formatMessage({
    id: 'auth.method.loginWithPassword',
    defaultMessage: 'Email & Password',
    description: 'Button to login with email & password',
  })
  const phoneNumber = intl.formatMessage({
    id: 'auth.method.loginWithPhone',
    defaultMessage: 'Phone Number',
    description: 'Button to login with phone',
  })

  // const loginWithMetaMaskWallet = intl.formatMessage({
  //   id: 'auth.method.loginWithMetaMaskWallet',
  //   defaultMessage: 'Login with MetaMask Wallet',
  //   description: 'Button text for user to login using their MetaMask wallet instead of their email and password',
  // })
  // const loginWithPassword = intl.formatMessage({
  //   id: 'auth.method.loginWithPassword',
  //   defaultMessage: 'Login with Email & Password',
  //   description: 'Button to login with email & password',
  // })
  // const loginWithPhone = intl.formatMessage({
  //   id: 'auth.method.loginWithPhone',
  //   defaultMessage: 'Login with Phone',
  //   description: 'Button to login with phone',
  // })

  // const signUpWithMetaMaskWallet = intl.formatMessage({
  //   id: 'auth.method.signUpWithMetaMaskWallet',
  //   defaultMessage: 'Sign up with MetaMask Wallet',
  //   description: 'Button text for user to login using their MetaMask wallet instead of their email and password',
  // })
  // const signUpWithPassword = intl.formatMessage({
  //   id: 'auth.method.signUpWithPassword',
  //   defaultMessage: 'Sign up with Email & Password',
  //   description: 'Button to signup with email & password',
  // })
  // const signUpWithPhone = intl.formatMessage({
  //   id: 'auth.method.signUpWithPhone',
  //   defaultMessage: 'Sign up with Phone',
  //   description: 'Button to signup phone',
  // })

  return {
    phoneNumber,
    metaMaskWallet,
    emailAndPassword,
  }
}

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`
export const $ChangeMode = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
  cursor: pointer;
  text-align: center;
  text-decoration-line: underline;
  color: #ababab;
`

export const $Checkbox = styled.input`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-right: 10px;
  cursor: pointer;
`

export type ModeOptions =
  | 'login-password'
  | 'login-wallet'
  | 'login-phone'
  | 'signup-password'
  | 'signup-wallet'
  | 'signup-phone'
  | 'forgot-password'
