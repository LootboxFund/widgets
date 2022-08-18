import { $Vertical, $h1, $Horizontal, $span } from 'lib/components/Generics'
import AuthGuard from 'lib/components/AuthGuard'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Link, $SettingContainer, Oopsies } from '../common'
import { useAuth } from 'lib/hooks/useAuth'
import ChangePassword from './changePassword'
import { useEffect, useState } from 'react'
import { auth } from 'lib/api/firebase/app'
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth'
import LogRocket from 'logrocket'
import useWindowSize from 'lib/hooks/useScreenSize'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

const SettingsComponent = () => {
  const { user } = useAuth()
  const { screen } = useWindowSize()
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [passwordResetFormVisible, setPasswordResetFormVisible] = useState(false)
  const intl = useIntl()
  const words = useWords()

  const [passwordResetStatus, setPasswordResetStatus] = useState<'loading' | 'email-sent' | 'error' | 'pending'>(
    'pending'
  )

  const [newPasswordStatus, setNewPasswordStatus] = useState<'loading' | 'success' | 'pending'>('pending')

  useEffect(() => {
    if (user?.email && auth.currentUser?.email) {
      fetchSignInMethodsForEmail(auth, auth.currentUser?.email)
        .then((data) => {
          setIsPasswordEnabled(data.includes('password'))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [user])

  const sendPasswordReset = () => {
    // Send user email with password reset link
    if (auth.currentUser?.email && passwordResetStatus !== 'loading') {
      console.log('password reset email')
      setPasswordResetStatus('loading')
      sendPasswordResetEmail(auth, auth.currentUser?.email)
        .then(() => {
          setPasswordResetStatus('email-sent')
        })
        .catch((err) => {
          setPasswordResetStatus('error')
          LogRocket.captureException(err)
        })
    }
  }

  const handleNewPassword = () => {
    setPasswordResetFormVisible(!passwordResetFormVisible)
  }

  const passwordResetFormSuccessCallback = () => {
    setPasswordResetFormVisible(false)
    setNewPasswordStatus('success')
  }

  const passwordNotSetText = intl.formatMessage({
    id: 'profile.settings.passwordNotSet',
    defaultMessage: 'Password not set!',
    description: 'Message displayed when the user does not have a password.',
  })

  const phoneNotSetText = intl.formatMessage({
    id: 'profile.settings.phoneNotSet',
    defaultMessage: 'Phone not set!',
    description: 'Message displayed when the user does not have a phone.',
  })

  const emailNotSetText = intl.formatMessage({
    id: 'profile.settings.emailNotSet',
    defaultMessage: 'Email not set!',
    description: 'Message displayed when the user does not have an email.',
  })

  const newPasswordText = intl.formatMessage({
    id: 'profile.settings.newPassword',
    defaultMessage: 'New password',
    description: 'Message displayed when the user clicks to make a new password.',
  })

  return (
    <$Vertical spacing={4}>
      <$h1>
        <FormattedMessage
          id="profile.settings.title"
          defaultMessage="Account Settings"
          description="Title for the account settings page. Here users can change their password, email, etc."
        />
      </$h1>
      <$SettingContainer disabled>
        <$Horizontal
          justifyContent="flex-start"
          flexWrap
          style={{
            paddingLeft: screen === 'mobile' ? '0px' : '8%',
          }}
        >
          <$span
            width={screen === 'mobile' ? '35%' : '20%'}
            lineHeight="40px"
            color={`${COLORS.surpressedFontColor}be`}
          >
            {words.phone}
          </$span>
          <$span width={screen === 'mobile' ? '65%' : '50%'} lineHeight="40px">
            {user?.phone ? (
              <$span textAlign="start">{user?.phone}</$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                {`${phoneNotSetText} ⛔️`}
              </$span>
            )}
          </$span>
          {/* <$span
            textAlign={screen === 'mobile' ? 'start' : 'center'}
            width={screen === 'mobile' ? '100%' : '30%'}
            lineHeight="40px"
          >
            {!user?.phone && <$Link style={{ fontStyle: 'normal' }}>Add phone</$Link>}
          </$span> */}
        </$Horizontal>
      </$SettingContainer>
      <$SettingContainer disabled>
        <$Horizontal
          justifyContent="flex-start"
          flexWrap
          style={{
            paddingLeft: screen === 'mobile' ? '0px' : '8%',
          }}
        >
          <$span width="20%" lineHeight="40px" color={`${COLORS.surpressedFontColor}be`}>
            {words.email}
          </$span>
          <$span width="80%" lineHeight="40px">
            {user?.email ? (
              <$span>{user?.email}</$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                {emailNotSetText}
              </$span>
            )}
          </$span>
        </$Horizontal>
      </$SettingContainer>
      {user?.email && (
        <$SettingContainer>
          <$Horizontal
            justifyContent="flex-start"
            flexWrap
            style={{
              paddingLeft: screen === 'mobile' ? '0px' : '8%',
            }}
          >
            <$span
              width={screen === 'mobile' ? '35%' : '20%'}
              lineHeight="40px"
              color={`${COLORS.surpressedFontColor}be`}
            >
              {words.password}
            </$span>
            <$span width={screen === 'mobile' ? '65%' : '50%'} lineHeight="40px">
              {isPasswordEnabled ? (
                <$span textAlign="start">******************</$span>
              ) : (
                <$span textAlign="start" color={COLORS.dangerFontColor}>
                  {`${passwordNotSetText} ⛔️`}
                </$span>
              )}
            </$span>
            <$span
              textAlign={screen === 'mobile' ? 'start' : 'center'}
              width={screen === 'mobile' ? '100%' : '30%'}
              lineHeight="40px"
            >
              {isPasswordEnabled ? (
                <$Link style={{ fontStyle: 'normal' }} onClick={sendPasswordReset}>
                  {`${words.resetPassword.toLowerCase()}?`}
                </$Link>
              ) : (
                <$Link style={{ fontStyle: 'normal', textTransform: 'lowercase' }} onClick={handleNewPassword}>
                  {passwordResetFormVisible ? `👇 ${words.hide}` : newPasswordText}
                </$Link>
              )}
            </$span>
          </$Horizontal>
        </$SettingContainer>
      )}

      {passwordResetStatus === 'email-sent' && (
        <$span textAlign="end">
          ✅{' '}
          <FormattedMessage
            id="profile.settings.passwordResetEmailSent"
            defaultMessage="A password reset email was sent to your email."
            description="Message displayed when the user clicks to make a new password."
          />
        </$span>
      )}
      {passwordResetStatus === 'error' && (
        <$span color={COLORS.dangerFontColor} textAlign="end">
          {words.anErrorOccured}. {words.pleaseTryAgainLater}.
        </$span>
      )}
      {passwordResetFormVisible && (
        <ChangePassword mode={'create-password'} onSuccessCallback={passwordResetFormSuccessCallback} />
      )}
      {newPasswordStatus === 'success' && (
        <$span textAlign="end">
          ✅{' '}
          <FormattedMessage
            id="profile.settings.newPasswordSuccess"
            defaultMessage="Password was added to your account."
            description="Message displayed after a user successfully makes a new password."
          />
        </$span>
      )}
    </$Vertical>
  )
}

export const Settings = () => {
  return (
    <AuthGuard>
      <SettingsComponent />
    </AuthGuard>
  )
}

export default Settings
