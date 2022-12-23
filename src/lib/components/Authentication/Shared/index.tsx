import { COLORS, QuestionFieldType, TYPOGRAPHY } from '@wormgraph/helpers'
import React from 'react'
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

  const termsOfService = intl.formatMessage({
    id: 'auth.termsOfService',
    defaultMessage: 'Terms of Service',
    description: 'Link to terms of service',
  })
  const privacyPolicy = intl.formatMessage({
    id: 'auth.privacyPoligy',
    defaultMessage: 'Privacy Policy',
    description: 'Link to privacy policy',
  })

  const consentDataSharingLinks = (privacyPolicyHyperlink: any, termsHyperlink: any) => {
    return (
      <span>
        {intl.formatMessage(
          {
            id: 'viralOnboarding.signup.email.consentDataSharing',
            defaultMessage:
              'By providing your email, you also agree to share your data with the event organizer who may email you for marketing purposes, according to our {privacyPolicy} and {termsOfService}. You can cancel this at any time.',
          },
          {
            termsOfService: termsHyperlink,
            privacyPolicy: privacyPolicyHyperlink,
          }
        )}
      </span>
    )
  }

  const signupWithPhoneTerms = (termsHyperlink: any) => {
    return (
      <span>
        {intl.formatMessage(
          {
            id: 'auth.method.signupWithPhoneTerms',
            defaultMessage: 'By verifying your phone number, you are agreeing to our {termsOfService}.',
          },
          {
            termsOfService: termsHyperlink,
          }
        )}
      </span>
    )
  }

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
    signupWithPhoneTerms,
    termsOfService,
    privacyPolicy,
    consentDataSharingLinks,
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

export const renderAvailableQuestionTypes = (type: QuestionFieldType) => {
  if (type === QuestionFieldType.Address) return 'text'
  if (type === QuestionFieldType.Checkbox) return 'checkbox'
  if (type === QuestionFieldType.Date) return 'date'
  if (type === QuestionFieldType.DateTime) return 'datetime-local'
  if (type === QuestionFieldType.Email) return 'email'
  if (type === QuestionFieldType.File) return 'file'
  if (type === QuestionFieldType.Link) return 'url'
  if (type === QuestionFieldType.MultiSelect) return 'text'
  if (type === QuestionFieldType.Number) return 'number'
  if (type === QuestionFieldType.Phone) return 'tel'
  if (type === QuestionFieldType.Range) return 'range'
  if (type === QuestionFieldType.Screenshot) return 'file'
  if (type === QuestionFieldType.SingleSelect) return 'text'
  if (type === QuestionFieldType.Text) return 'text'
  if (type === QuestionFieldType.Time) return 'time'
  return 'text'
}

export const $Checkbox = styled.input`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-right: 10px;
  cursor: pointer;
`

export type ModeOptions =
  | 'login-email'
  | 'login-wallet'
  | 'login-phone'
  | 'signup-email'
  | 'signup-wallet'
  | 'signup-phone'
  | 'forgot-password'
  | 'email-link'
