import { $Vertical, $h1, $Horizontal, $span } from 'lib/components/Generics'
import AuthGuard from 'lib/components/AuthGuard'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Link, $SettingContainer, Oopsies } from '../common'
import { useAuth } from 'lib/hooks/useAuth'
import ChangePassword from './changePassword'
import ChangeEmail from './ChangeEmail'
import { useEffect, useState } from 'react'
import { auth } from 'lib/api/firebase/app'
import { fetchSignInMethodsForEmail, sendPasswordResetEmail, updateEmail } from 'firebase/auth'
import LogRocket from 'logrocket'
import useWindowSize from 'lib/hooks/useScreenSize'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { manifest } from 'manifest'

interface SettingsProps {
  email?: string
}

const SettingsComponent = (props: SettingsProps) => {
  const { user, refreshUser } = useAuth()
  const { screen } = useWindowSize()
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [passwordResetFormVisible, setPasswordResetFormVisible] = useState(false)
  const [isConfirmEmailEnabled, setIsConfirmEmailEnabled] = useState(false)
  const [loadingConfirmEmail, setLoadingConfirmEmail] = useState(false)
  const [confirmEmailError, setConfirmEmailError] = useState('')
  const [emailFormVisible, setEmailFormVisible] = useState(false)
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

  const toggleEmailChange = () => setEmailFormVisible(!emailFormVisible)

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

  const changeEmailCallback = () => {
    setEmailFormVisible(false)
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

  const updateIDPUserEmail = async () => {
    setConfirmEmailError('')
    try {
      if (!auth.currentUser || !props.email) {
        throw new Error('Something went wrong! Please try again later.')
      }
      setLoadingConfirmEmail(true)
      await updateEmail(auth.currentUser, props.email)
      setIsConfirmEmailEnabled(false)
      await refreshUser()
    } catch (err) {
      console.error(err)
      setConfirmEmailError(words.anErrorOccured)
    } finally {
      setLoadingConfirmEmail(false)
    }
  }

  const toggleConfirmEmail = () => {
    setIsConfirmEmailEnabled(!isConfirmEmailEnabled)
  }

  const userEmail = user?.email || props.email

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
              <$span textAlign="start" ellipsis>
                {user?.phone}
              </$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor} ellipsis>
                {`${phoneNotSetText} ⛔️`}
              </$span>
            )}
          </$span>
          <$span
            textAlign={screen === 'mobile' ? 'start' : 'center'}
            width={screen === 'mobile' ? '100%' : '30%'}
            lineHeight="40px"
          >
            {!user?.phone && (
              <$Link
                style={{ fontStyle: 'normal', textDecoration: 'none' }}
                href={manifest.microfrontends.webflow.anonSignup}
              >
                add phone
              </$Link>
            )}
          </$span>
        </$Horizontal>
      </$SettingContainer>
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
            {words.email}
          </$span>
          <$span width={screen === 'mobile' ? '65%' : '50%'} lineHeight="40px" ellipsis>
            {!!userEmail ? (
              <$span>
                {userEmail} <CopyIcon text={userEmail} smallWidth={24} />
              </$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                {emailNotSetText}
              </$span>
            )}
          </$span>

          <$span
            textAlign={screen === 'mobile' ? 'start' : 'center'}
            width={screen === 'mobile' ? '100%' : '30%'}
            lineHeight="40px"
          >
            {!user?.email && !!props.email ? (
              <$Link style={{ fontStyle: 'normal', textTransform: 'lowercase' }} onClick={toggleConfirmEmail}>
                {isConfirmEmailEnabled ? `👇 ${words.hide}` : `${words.confirm} ${words.email}`}
              </$Link>
            ) : !emailFormVisible ? (
              <$Link style={{ fontStyle: 'normal' }} onClick={toggleEmailChange}>
                {!user?.email ? words.newEmail : words.edit.toLowerCase()}
              </$Link>
            ) : (
              <$Link style={{ fontStyle: 'normal', textTransform: 'lowercase' }} onClick={toggleEmailChange}>
                {`👇 ${words.hide}`}
              </$Link>
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
                <$span textAlign="start" ellipsis>
                  ******************
                </$span>
              ) : (
                <$span textAlign="start" color={COLORS.dangerFontColor} ellipsis>
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
      {passwordResetFormVisible && (
        <AuthGuard strict loginTitle="Login again to change your password">
          <ChangePassword mode={'create-password'} onSuccessCallback={passwordResetFormSuccessCallback} />
        </AuthGuard>
      )}
      {emailFormVisible && (
        <AuthGuard strict loginTitle="Login again to change your email">
          <ChangeEmail onSuccessCallback={changeEmailCallback} />
        </AuthGuard>
      )}
      {isConfirmEmailEnabled && (
        <AuthGuard strict loginTitle="Login again to confirm your email">
          <div style={{ margin: '0 auto' }}>
            <$Button
              screen={screen}
              onClick={updateIDPUserEmail}
              backgroundColor={`${COLORS.trustBackground}C0`}
              backgroundColorHover={`${COLORS.trustBackground}`}
              color={COLORS.trustFontColor}
              style={{
                fontWeight: TYPOGRAPHY.fontWeight.regular,
                fontSize: TYPOGRAPHY.fontSize.large,
                boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
              }}
              disabled={loadingConfirmEmail}
            >
              <LoadingText loading={loadingConfirmEmail} text="Confirm your Email" color={COLORS.white} />
            </$Button>
          </div>
        </AuthGuard>
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
      {(passwordResetStatus === 'error' || confirmEmailError) && (
        <$span color={COLORS.dangerFontColor} textAlign="end" style={{ marginTop: '15px' }}>
          {words.anErrorOccured}. {words.pleaseTryAgainLater}.
        </$span>
      )}
    </$Vertical>
  )
}

export const Settings = (props: SettingsProps) => {
  return (
    <AuthGuard>
      <SettingsComponent {...props} />
    </AuthGuard>
  )
}

export default Settings
