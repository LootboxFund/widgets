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

const SettingsComponent = () => {
  const { user } = useAuth()
  const { screen } = useWindowSize()
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [passwordResetFormVisible, setPasswordResetFormVisible] = useState(false)

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

  return (
    <$Vertical spacing={4}>
      <$h1>Account Settings</$h1>
      <$SettingContainer disabled>
        <$Horizontal justifyContent="flex-start" flexWrap>
          <$span width="20%" lineHeight="40px">
            Email
          </$span>
          <$span width="80%" lineHeight="40px">
            {user?.email ? (
              <$span>{user?.email}</$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                Password not set!
              </$span>
            )}
          </$span>
        </$Horizontal>
      </$SettingContainer>
      <$SettingContainer>
        <$Horizontal justifyContent="flex-start" flexWrap>
          <$span width={screen === 'mobile' ? '100%' : '20%'} lineHeight="40px">
            Password
          </$span>
          <$span width={screen === 'mobile' ? '100%' : '60%'} lineHeight="40px">
            {isPasswordEnabled ? (
              <$span textAlign="start">******************</$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                Password not set ⛔️
              </$span>
            )}
          </$span>
          <$span textAlign="end" width={screen === 'mobile' ? '100%' : '20%'} lineHeight="40px">
            {isPasswordEnabled ? (
              <$Link style={{ fontStyle: 'normal' }} onClick={sendPasswordReset}>
                reset password?
              </$Link>
            ) : (
              <$Link style={{ fontStyle: 'normal' }} onClick={handleNewPassword}>
                {passwordResetFormVisible ? '👇 close' : 'new password'}
              </$Link>
            )}
          </$span>
        </$Horizontal>
      </$SettingContainer>
      {passwordResetStatus === 'email-sent' && (
        <$span textAlign="end">✅ A password reset email was sent to your email.</$span>
      )}
      {passwordResetStatus === 'error' && (
        <$span color={COLORS.dangerFontColor} textAlign="end">
          An error occured sending a password reset email. Please try again later.
        </$span>
      )}
      {passwordResetFormVisible && (
        <ChangePassword mode={'create-password'} onSuccessCallback={passwordResetFormSuccessCallback} />
      )}
      {newPasswordStatus === 'success' && <$span textAlign="end">✅ Password was added to your account.</$span>}
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
