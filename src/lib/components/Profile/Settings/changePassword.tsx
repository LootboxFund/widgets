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

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const parsePasswordConfirmation = (inputPasswordConfirmation: string) => {
    setPasswordConfirmation(inputPasswordConfirmation)
  }

  const handlePasswordChangeRequest = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('You are not signed in!')
      }
      if (!auth.currentUser?.email) {
        throw new Error('No email found for this user')
      }
      throwInvalidPasswords({ password, passwordConfirmation })
    } catch (err) {
      setErrorMessage(err?.message || 'An error occured. Please try again later.')
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
        setErrorMessage(err?.message || 'An error occured. Please try again later.')
      } finally {
        setLoading(false)
        return
      }
    }
  }

  return (
    <$Vertical spacing={3}>
      <$h3 style={{ fontSize: TYPOGRAPHY.fontSize.large }}>Add a Password</$h3>
      <$InputMedium
        onChange={(e) => parsePassword(e.target.value)}
        value={password}
        placeholder="password"
        type="password"
        style={{
          boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
        }}
      ></$InputMedium>
      <$InputMedium
        onChange={(e) => parsePasswordConfirmation(e.target.value)}
        value={passwordConfirmation}
        placeholder="confirm password"
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
          <LoadingText loading={loading} text="Save password" color={COLORS.trustFontColor} />
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
