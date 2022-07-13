import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { auth } from 'lib/api/firebase/app'
import { linkWithCredential } from 'firebase/auth'
import { $Divider, $h2, $h3, $p, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useState } from 'react'
import styled from 'styled-components'
import { throwInvalidPasswords } from 'lib/utils/password'
import { EmailAuthProvider } from 'firebase/auth'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

interface ChangePasswordProps {
  /**
   * update-password: We are changing an existing password
   * create-password: We are linking a NEW password to an existing account
   */
  mode: 'create-password' // | 'update-password'
  onSuccessCallback?: () => void
}

const ChangePassword = ({ mode, onSuccessCallback }: ChangePasswordProps) => {
  const { screen } = useWindowSize()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const intl = useIntl()
  const words = useWords()

  const notSignedInMessage = intl.formatMessage({
    id: 'profile.settings.notSignedInMessage',
    defaultMessage: 'You are not signed in!',
    description: 'Error message shown to user when they are not signed in',
  })

  const noEmailFoundForUser = intl.formatMessage({
    id: 'profile.settings.noEmailFoundForUser',
    defaultMessage: 'No email found for this user',
    description: 'Error message shown to user when they do not have an email address',
  })

  const savePassword = intl.formatMessage({
    id: 'profile.settings.savePassword',
    defaultMessage: 'Save password',
    description: 'Button to save the password',
  })

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const parsePasswordConfirmation = (inputPasswordConfirmation: string) => {
    setPasswordConfirmation(inputPasswordConfirmation)
  }

  const handlePasswordChangeRequest = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error(notSignedInMessage)
      }
      if (!auth.currentUser?.email) {
        throw new Error(noEmailFoundForUser)
      }
      throwInvalidPasswords(intl, { password, passwordConfirmation })
    } catch (err) {
      setErrorMessage(err?.message || `${words.anErrorOccured}. ${words.pleaseTryAgainLater}.`)
      return
    }

    if (mode === 'create-password') {
      setLoading(true)
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
        await linkWithCredential(auth.currentUser, credential)
        onSuccessCallback && onSuccessCallback()
        setErrorMessage('')
      } catch (err) {
        setErrorMessage(err?.message || `${words.anErrorOccured}. ${words.pleaseTryAgainLater}.`)
      } finally {
        setLoading(false)
        return
      }
    }
  }

  return (
    <$Vertical spacing={3}>
      <$h3 style={{ fontSize: TYPOGRAPHY.fontSize.large }}>
        <FormattedMessage
          id="profile.settings.changePassword.title"
          defaultMessage="Add a Password"
          description="Title for the page that allows a user to add a password"
        />
      </$h3>
      <$InputMedium
        onChange={(e) => parsePassword(e.target.value)}
        value={password}
        placeholder={words.password}
        type="password"
        style={{
          boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
        }}
      ></$InputMedium>
      <$InputMedium
        onChange={(e) => parsePasswordConfirmation(e.target.value)}
        value={passwordConfirmation}
        placeholder={words.confirmPassword}
        type="password"
        style={{
          boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
        }}
      ></$InputMedium>
      <div>
        <$Button
          screen={screen}
          onClick={handlePasswordChangeRequest}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.regular,
            fontSize: TYPOGRAPHY.fontSize.large,
            boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
          }}
          disabled={loading}
        >
          <LoadingText loading={loading} text={savePassword} color={COLORS.trustFontColor} />
        </$Button>
      </div>

      {errorMessage && (
        <$span color={COLORS.dangerFontColor} textAlign="start">
          {errorMessage}
        </$span>
      )}
    </$Vertical>
  )
}

const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`

export default ChangePassword
