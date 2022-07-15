import { IntlShape } from 'react-intl'

export const throwInvalidPasswords = (
  intl: IntlShape,
  {
    password,
    passwordConfirmation,
  }: {
    password?: string
    passwordConfirmation?: string
  }
) => {
  const minLen = 6

  const pleaseEnterPassword = intl.formatMessage({
    id: 'auth.password.pleaseEnterPassword',
    defaultMessage: 'Please enter a password',
    description: 'Error message when user tries to sign up/in without a password',
  })

  const passwordLength = intl.formatMessage(
    {
      id: 'auth.password.passwordLength',
      defaultMessage: 'Password must be at least {minLength} characters',
      description: 'Error message when user tries to sign up/in with a password that is too short',
    },
    {
      minLength: minLen,
    }
  )

  const passwordMustContainNumber = intl.formatMessage({
    id: 'auth.password.passwordMustContainNumber',
    defaultMessage: 'Password must contain at least one number',
    description: 'Error message when user tries to sign up/in with a password that does not contain a number',
  })

  const pleaseConfirmYourPassword = intl.formatMessage({
    id: 'auth.password.pleaseConfirmYourPassword',
    defaultMessage: 'Please confirm your password',
    description: 'Error message when user tries to sign up/in without a password confirmation',
  })

  const passwordMismatch = intl.formatMessage({
    id: 'auth.password.passwordMismatch',
    defaultMessage: 'Passwords do not match!',
    description:
      'Error message when user tries to sign up/in with a password that does not match the password confirmation',
  })

  if (!password) {
    throw new Error(pleaseEnterPassword)
  }

  // Some rules.... Lets say greater than or eqal 10 characters, with 1 number, and one upercase
  if (password.length < minLen) {
    throw new Error(passwordLength)
  }

  const hasNumber = /\d/
  if (!hasNumber.test(password)) {
    throw new Error(passwordMustContainNumber)
  }

  if (!passwordConfirmation) {
    throw new Error(pleaseConfirmYourPassword)
  }

  if (password !== passwordConfirmation) {
    throw new Error(passwordMismatch)
  }

  return
}
